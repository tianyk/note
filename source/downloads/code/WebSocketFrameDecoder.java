public class WebSocketFrameDecoder extends ByteToMessageDecoder {
    private static final short MAX_FRAME_SIZE = 1024 * 10; // 10kb

    private static final byte READ_HEADER = 1;
    private static final byte READ_EXT_PAYLOAD_LEN_16 = 2;
    private static final byte READ_EXT_PAYLOAD_LEN_64 = 4;
    private static final byte READ_MASK_KEY = 8;
    private static final byte READ_PAYLOAD = 16;

    private byte STATE = READ_HEADER;

    // frame
    private byte fin;
    private byte opcode;
    private byte mask;
    private long payloadLen;
    // 无符号byte
    private short[] maskKey = new short[4];
    private byte[] payload;

    private void reset() {
        STATE = READ_HEADER;
    }

    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
        if (STATE == READ_HEADER) {
            if (in.readableBytes() < 2) return;
            int header = in.readUnsignedShort();
            fin = (byte) (header >> 15);
            opcode = (byte) (header & 0b0000111100000000 >> 8);
            mask = (byte) ((header & 0b0000000010000000) >> 7);
            payloadLen = header & 0b0000000001111111;

            if (payloadLen == 127) STATE = READ_EXT_PAYLOAD_LEN_64;
            else if (payloadLen == 126) STATE = READ_EXT_PAYLOAD_LEN_16;
            else STATE = READ_MASK_KEY;
        } else if (STATE == READ_EXT_PAYLOAD_LEN_16) {
            if (in.readableBytes() < 2) return;
            payloadLen = in.readUnsignedShort();

            STATE = READ_MASK_KEY;
        } else if (STATE == READ_EXT_PAYLOAD_LEN_64) {
            if (in.readableBytes() < 8) return;
            // 协议规定64位时最高有效位必须是0
            payloadLen = in.readLong();

            STATE = READ_MASK_KEY;
        } else if (STATE == READ_MASK_KEY) {
            if (mask == 1) {
                if (in.readableBytes() < 4) return;

                maskKey[0] = in.readUnsignedByte();
                maskKey[1] = in.readUnsignedByte();
                maskKey[2] = in.readUnsignedByte();
                maskKey[3] = in.readUnsignedByte();
            }
            STATE = READ_PAYLOAD;
        } else if (STATE == READ_PAYLOAD) {
            if (payloadLen > MAX_FRAME_SIZE) {
                //bad frame. you should close the channel.
                in.skipBytes(in.readableBytes());
                throw new TooLongFrameException("Frame too big!");
            }

            if (in.readableBytes() < payloadLen) return;

            payload = new byte[(int) payloadLen];
            int pos = 0;
            while (in.isReadable() && payloadLen > 0) {
                payload[pos] = (byte) (in.readByte() ^ maskKey[pos % 4]);
                pos++;
                payloadLen--;
            }

            out.add(new WebSocketFrame(fin, opcode, mask, payload.length, maskKey, payload));
            reset(); // next frame
        }
    }
}