
function _parse(header) {
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
    if (headerLength > 20) options = header.toString('hex', _readerIndex, headerLength + _readerIndex + 1);
    
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



console.log('No. %d, headers: %j', 399, _parse(Buffer.from('d2e60050f5e91f4900000000b002ffff5a790000020405b4010303050101080aba8734a10000000004020000', 'hex')));
console.log('No. %d, headers: %j', 400, _parse(Buffer.from('0050d2e62eebdc1af5e91f4aa0123890d0d60000020405b40402080aa6a7b057ba8734a101030306', 'hex')));
console.log('No. %d, headers: %j', 401, _parse(Buffer.from('d2e60050f5e91f4a2eebdc1b80101015281300000101080aba8734aba6a7b057', 'hex')));
console.log('No. %d, headers: %j', 402, _parse(Buffer.from('d2e60050f5e91f4a2eebdc1b8018101596b900000101080aba8734aba6a7b057', 'hex')));
console.log('No. %d, headers: %j', 403, _parse(Buffer.from('0050d2e62eebdc1bf5e91f96801000e336f000000101080aa6a7b060ba8734ab', 'hex')));
console.log('No. %d, headers: %j', 404, _parse(Buffer.from('0050d2e62eebdc1bf5e91f96801000e3907a00000101080aa6a7b061ba8734ab', 'hex')));
console.log('No. %d, headers: %j', 405, _parse(Buffer.from('0050d2e62eebe1c3f5e91f96801000e3234200000101080aa6a7b061ba8734ab', 'hex')));
console.log('No. %d, headers: %j', 406, _parse(Buffer.from('0050d2e62eebe76bf5e91f96801800e3a37500000101080aa6a7b061ba8734ab', 'hex')));
console.log('No. %d, headers: %j', 407, _parse(Buffer.from('d2e60050f5e91f962eebe76b80100fd21ca500000101080aba8734b6a6a7b061', 'hex')));
console.log('No. %d, headers: %j', 408, _parse(Buffer.from('d2e60050f5e91f962eebec4380100fac17f300000101080aba8734b6a6a7b061', 'hex')));
console.log('No. %d, headers: %j', 409, _parse(Buffer.from('d2e60050f5e91f962eebec4380111000179e00000101080aba8734b6a6a7b061', 'hex')));
console.log('No. %d, headers: %j', 411, _parse(Buffer.from('0050d2e62eebec43f5e91f97801100e325dc00000101080aa6a7b13fba8734b6', 'hex')));
console.log('No. %d, headers: %j', 412, _parse(Buffer.from('d2e60050f5e91f972eebec448010100015e800000101080aba87358da6a7b13f', 'hex')));