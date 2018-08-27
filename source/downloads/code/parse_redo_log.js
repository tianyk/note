function readInt64BE(buf, offset = 0) {
    return parseInt(buf.slice(offset, offset + 8).toString('hex'), 16);
}

function _parseLogFileHeader(header) {
    let _readerIndex = 0;
    const groupId = header.readInt32BE();
    _readerIndex += 4;
    const startLSN = readInt64BE(header, _readerIndex);

    return { groupId, startLSN };
}

function _parseCheckpoint(checkpoint) {
    let _readerIndex = 0;
    const no = readInt64BE(checkpoint, _readerIndex);
    _readerIndex += 8;

    const lsn = readInt64BE(checkpoint, _readerIndex);
    _readerIndex += 8;

    const offset = checkpoint.readInt32BE(_readerIndex);
    _readerIndex += 4;

    const bufferSize = checkpoint.readInt32BE(_readerIndex);
    _readerIndex += 4;

    const archivedLSN = readInt64BE(checkpoint, _readerIndex);
    _readerIndex += 8;

    _readerIndex += 256; // skip LOG_CHECKPOINT_ARRAY 

    const checksum1 = checkpoint.readInt32BE(_readerIndex);
    _readerIndex += 4;

    const checksum2 = checkpoint.readInt32BE(_readerIndex);
    _readerIndex += 4;


    return { no, lsn, offset, bufferSize, archivedLSN, checksum1, checksum2 };
}

function parseRedoLogHeader(header) {
    let _readerIndex = 0;
    const logFileHeader = header.slice(_readerIndex, 512);
    _readerIndex += 512;
    _parseLogFileHeader(logFileHeader);

    const checkpoint1 = header.slice(_readerIndex, _readerIndex + 512);
    _readerIndex += 512;
    _parseCheckpoint(checkpoint1);

    _readerIndex += 512; // skip 
    const checkpoint2 = header.slice(_readerIndex, _readerIndex + 512);
    _parseCheckpoint(checkpoint2);
}

function parseRedoLogBlock(block) {
    let _readerIndex = 0;

    let HdrNo = block.readInt32BE(_readerIndex);
    HdrNo = HdrNo & 0x7fffffff;
    let flushBit = HdrNo & 0x80000000;
    _readerIndex += 4;
    const hdrDataLen = block.readInt16BE(_readerIndex);
    _readerIndex += 2;
    const firstRecGroup = block.readInt16BE(_readerIndex);
    _readerIndex += 2;
    const checkpointNo = block.readInt32BE(_readerIndex);
    _readerIndex += 4;

    // console.log(block.slice(_readerIndex, _readerIndex + 496).toString('hex'))
    _readerIndex += 496; // skip data

    const checksum = block.readInt32BE(_readerIndex);

    console.log(HdrNo, flushBit, hdrDataLen, firstRecGroup, checkpointNo, checksum);
}


function parseRedoLog(redoLog) {
    let _readerIndex = 0;
    const header = redoLog.slice(_readerIndex, _readerIndex + 2048);
    parseRedoLogHeader(header);
    _readerIndex += 2048; // 2kb

    let block;
    while (_readerIndex < redoLog.length) {
        block = redoLog.slice(_readerIndex, _readerIndex + 512);
        _readerIndex += 512;
        parseRedoLogBlock(block);
    }
}

const fs = require('fs');
const redoLog = fs.readFileSync('./ib_logfile0');
parseRedoLog(redoLog);
// console.log(redoLog.length)
