function parse(ip) {
    let _readerIndex = 0;
    let version, ihl, type, len, id, flags, offset, ttl, protocol, checksum, source = [], dest = [], options;

    version = ip.readUInt8(_readerIndex) >> 4;
    ihl = ip.readUInt8(_readerIndex) & 0x0f;
    _readerIndex++;

    type = ip.readUInt8(_readerIndex);
    _readerIndex++;

    len = ip.readUInt16BE(_readerIndex);
    _readerIndex += 2;

    id = ip.readUInt16BE(_readerIndex);
    _readerIndex += 2;

    flags = ip.readUInt16BE(_readerIndex) >> 13;
    offset = ip.readUInt16BE(_readerIndex) & 0x1fff;
    _readerIndex += 2;

    ttl = ip.readUInt8(_readerIndex);
    _readerIndex++;

    protocol = ip.readUInt8(_readerIndex);
    _readerIndex++;

    checksum = ip.readUInt16BE(_readerIndex);
    _readerIndex += 2;

    for (let p = 0; p < 4; p++) source[p] = ip.readUInt8(_readerIndex++);

    for (let p = 0; p < 4; p++) dest[p] = ip.readUInt8(_readerIndex++);

    if (_readerIndex < ihl * 4) options = ip.toString('hex', _readerIndex);

    return {
        version, ihl, type, len, id, flags, offset, ttl, protocol, checksum, source, dest, options
    };
}

console.log(parse(Buffer.from('4500004000004000400635c70a0001022f5eca91', 'hex')));
console.log(parse(Buffer.from('4500003c544000003106308b2f5eca910a000102', 'hex')));
