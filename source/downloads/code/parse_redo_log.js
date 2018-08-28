function readUInt64BE(buf, offset = 0) {
    return parseInt(buf.slice(offset, offset + 8).toString('hex'), 16);
}

function parseLogFileHeader(header) {
    let _readerIndex = 0;
    const groupId = header.readUInt32BE();
    _readerIndex += 4;
    const startLSN = readUInt64BE(header, _readerIndex);

    return { groupId, startLSN };
}

function parseCheckpoint(checkpoint) {
    let _readerIndex = 0;
    const no = readUInt64BE(checkpoint, _readerIndex);
    _readerIndex += 8;

    const lsn = readUInt64BE(checkpoint, _readerIndex);
    _readerIndex += 8;

    const offset = checkpoint.readUInt32BE(_readerIndex);
    _readerIndex += 4;

    const bufferSize = checkpoint.readUInt32BE(_readerIndex);
    _readerIndex += 4;

    const archivedLSN = readUInt64BE(checkpoint, _readerIndex);
    _readerIndex += 8;

    _readerIndex += 256; // skip LOG_CHECKPOINT_ARRAY 

    const checksum1 = checkpoint.readUInt32BE(_readerIndex);
    _readerIndex += 4;

    const checksum2 = checkpoint.readUInt32BE(_readerIndex);
    _readerIndex += 4;

    return { no, lsn, offset, bufferSize, archivedLSN, checksum1, checksum2 };
}

function parseRedoLogHeader(header) {
    let _readerIndex = 0;
    let logFileHeader = header.slice(_readerIndex, 512);
    _readerIndex += 512;
    logFileHeader = parseLogFileHeader(logFileHeader);

    let checkpoint1 = header.slice(_readerIndex, _readerIndex + 512);
    _readerIndex += 512;
    checkpoint1 = parseCheckpoint(checkpoint1);

    _readerIndex += 512; // skip 

    let checkpoint2 = header.slice(_readerIndex, _readerIndex + 512);
    _readerIndex += 512;
    checkpoint2 = parseCheckpoint(checkpoint2);

    return { logFileHeader, checkpoint1, checkpoint2 };
}

function parseRedoLogBlock(block) {
    let _readerIndex = 0;

    let HdrNo = block.readUInt32BE(_readerIndex);
    HdrNo = HdrNo & 0x7fffffff;
    let flushBit = HdrNo & 0x80000000;
    _readerIndex += 4;
    const hdrDataLen = block.readUInt16BE(_readerIndex);
    _readerIndex += 2;
    const firstRecGroup = block.readUInt16BE(_readerIndex);
    _readerIndex += 2;
    const checkpointNo = block.readUInt32BE(_readerIndex);
    _readerIndex += 4;

    // console.log(block.slice(_readerIndex, _readerIndex + 496).toString('hex'))
    _readerIndex += 496; // skip data

    const checksum = block.readUInt32BE(_readerIndex);

    return { HdrNo, flushBit, hdrDataLen, firstRecGroup, checkpointNo, checksum };
}


function parseRedoLog(redoLog) {
    let _readerIndex = 0;
    let header = redoLog.slice(_readerIndex, _readerIndex + 2048);
    _readerIndex += 2048; // 2kb
    header = parseRedoLogHeader(header);
    console.log(header);

    let block;
    while (_readerIndex < redoLog.length) {
        block = redoLog.slice(_readerIndex, _readerIndex + 512);
        _readerIndex += 512;
        block = parseRedoLogBlock(block);
        console.log(block);
    }
}

const redoLog = require('fs').readFileSync('./ib_logfile0');
parseRedoLog(redoLog);
// console.log(redoLog.length)
