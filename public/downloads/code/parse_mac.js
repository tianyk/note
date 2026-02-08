function parseMAC(mac) {
    let _readerIndex = 0;
    let srcMac = [], dstMac = [], type;

    for (let pos = 0; pos < 6; pos ++) dstMac.push(mac.readUInt8(_readerIndex++));
    for (let pos = 0; pos < 6; pos ++) srcMac.push(mac.readUInt8(_readerIndex++));

    type = mac.readUInt16BE(_readerIndex);

    return {
        srcMac: srcMac.map(v => v.toString(16)).join(':'),
        dstMac: dstMac.map(v => v.toString(16)).join(':'),
        type: type.toString(16)
    }
}

console.log(parseMAC(Buffer.from('01005e7ffffa507b9d0bd1f40800', 'hex')));