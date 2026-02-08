function parseTCPHeader(header) {
    if (header.length < 20) throw new Error('Bad Frame');

    let _readerIndex = 0;
    let sourcePort = header.readUInt16BE(_readerIndex);
    _readerIndex += 2;
    let destinationPort = header.readUInt16BE(_readerIndex);
    _readerIndex += 2;
    let sequenceNumber = header.readUInt32BE(_readerIndex);
    _readerIndex += 4;
    let acknowledgmentNumber = header.readUInt32BE(_readerIndex);
    _readerIndex += 4;

    let dataOffsetAndFlags = header.readUInt16BE(_readerIndex);
    _readerIndex += 2;
    let dataOffset = dataOffsetAndFlags >> 12;
    let headerLength = dataOffset * 4; // 4 bytes 32 bits
    let urg = dataOffsetAndFlags >> 5 & 0x01;
    let ack = dataOffsetAndFlags >> 4 & 0x01;
    let psh = dataOffsetAndFlags >> 3 & 0x01;
    let rst = dataOffsetAndFlags >> 2 & 0x01;
    let syn = dataOffsetAndFlags >> 1 & 0x01;
    let fin = dataOffsetAndFlags & 0x01;

    let window = header.readUInt16BE(_readerIndex);
    _readerIndex += 2;
    let checksum = header.readUInt16BE(_readerIndex);
    _readerIndex += 2;
    urgentPointer = header.readUInt16BE(_readerIndex);
    _readerIndex += 2;

    let options;
    if (headerLength > 20) options = parseTCPOptions(header.slice(_readerIndex)); 

    return {
        sourcePort,
        destinationPort,
        sequenceNumber,
        acknowledgmentNumber,
        dataOffset,
        urg,
        ack,
        psh,
        rst,
        syn,
        fin,
        window,
        checksum,
        urgentPointer,
        options
    }
}