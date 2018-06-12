function _parse_options(options) {
    let _readerIndex = 0;
    let mss, wscale, sackOK, sack, tsVal, tsEcr;

    while(_readerIndex < options.length) {
        let kid = options.readUInt8(_readerIndex);
        _readerIndex++;

        if (kid === 0) {
            // 结束
            return;
        } else if (kid === 1) {
            // 无操作 补齐用
            continue;
        } else if (kid === 2) {
            // MSS
            _readerIndex++; // skip length 值固定是4（包含类型和长度字段）

             mss = options.readUInt16BE(_readerIndex);
            _readerIndex += 2;
        } else if (kid === 3) {
            // 窗口扩大因子
            _readerIndex++; // skip length 值固定是3

             wscale = options.readUInt8(_readerIndex);
            _readerIndex ++;
        } else if (kid === 4) {
            // 允许SACK
            _readerIndex++; // skip length 值固定是2

             sackOK = true;
        } else if (kid === 5) {
            // SACK 
            let len = options.readUInt8(_readerIndex);
            _readerIndex++;

            _readerIndex += (len -2); // skip 
        } else if (kid === 8) {
            // 
            _readerIndex++; // skip length 值固定为10
             tsVal = options.readUInt32BE(_readerIndex);
            _readerIndex += 4;
             tsEcr = options.readUInt32BE(_readerIndex);
            _readerIndex += 4;
        }else {
            // unknow
            let len = options.readUInt8(_readerIndex);
            _readerIndex++;

            // skip 
            _readerIndex += (len - 2);
        }
    }

    return {
        mss, wscale, sackOK, sack, tsVal, tsEcr
    };
}

function _parse_header(header) {
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
    if (headerLength > 20) options = _parse_options(header.slice(_readerIndex)); 

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



console.log('No. %d, headers: %j', 399, _parse_header(Buffer.from('d2e60050f5e91f4900000000b002ffff5a790000020405b4010303050101080aba8734a10000000004020000', 'hex')));
console.log('No. %d, headers: %j', 400, _parse_header(Buffer.from('0050d2e62eebdc1af5e91f4aa0123890d0d60000020405b40402080aa6a7b057ba8734a101030306', 'hex')));
console.log('No. %d, headers: %j', 401, _parse_header(Buffer.from('d2e60050f5e91f4a2eebdc1b80101015281300000101080aba8734aba6a7b057', 'hex')));
console.log('No. %d, headers: %j', 402, _parse_header(Buffer.from('d2e60050f5e91f4a2eebdc1b8018101596b900000101080aba8734aba6a7b057', 'hex')));
console.log('No. %d, headers: %j', 403, _parse_header(Buffer.from('0050d2e62eebdc1bf5e91f96801000e336f000000101080aa6a7b060ba8734ab', 'hex')));
console.log('No. %d, headers: %j', 404, _parse_header(Buffer.from('0050d2e62eebdc1bf5e91f96801000e3907a00000101080aa6a7b061ba8734ab', 'hex')));
console.log('No. %d, headers: %j', 405, _parse_header(Buffer.from('0050d2e62eebe1c3f5e91f96801000e3234200000101080aa6a7b061ba8734ab', 'hex')));
console.log('No. %d, headers: %j', 406, _parse_header(Buffer.from('0050d2e62eebe76bf5e91f96801800e3a37500000101080aa6a7b061ba8734ab', 'hex')));
console.log('No. %d, headers: %j', 407, _parse_header(Buffer.from('d2e60050f5e91f962eebe76b80100fd21ca500000101080aba8734b6a6a7b061', 'hex')));
console.log('No. %d, headers: %j', 408, _parse_header(Buffer.from('d2e60050f5e91f962eebec4380100fac17f300000101080aba8734b6a6a7b061', 'hex')));
console.log('No. %d, headers: %j', 409, _parse_header(Buffer.from('d2e60050f5e91f962eebec4380111000179e00000101080aba8734b6a6a7b061', 'hex')));
console.log('No. %d, headers: %j', 411, _parse_header(Buffer.from('0050d2e62eebec43f5e91f97801100e325dc00000101080aa6a7b13fba8734b6', 'hex')));
console.log('No. %d, headers: %j', 412, _parse_header(Buffer.from('d2e60050f5e91f972eebec448010100015e800000101080aba87358da6a7b13f', 'hex')));