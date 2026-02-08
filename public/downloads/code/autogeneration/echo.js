const net = require('net');

const PORT = 7000;
const HOST = '0.0.0.0';
const LF = '\n'.charCodeAt(0);
const CR = '\r'.charCodeAt(0);
const MAX_LENGTH = 128; 
const STRIP_DELIMITER = false;

function findEndOfLine(buffer) {
    let i = buffer.indexOf(LF);
    if (i > 0 && buffer[i - 1] === CR) {
        i--;
    }
    return i;
}

function fail(socket, length) {
    if (socket.writable) {
        socket.end(`frame length ${length} exceeds the allowed maximum ${MAX_LENGTH}`);
    } else {
        socket.end();
    }
}

const server = net.createServer();
// 最大连接数
server.maxConnections = 10240;

server.on('connection', (socket) => {
    console.log(`新的客户端加入：${socket.remoteAddress}:${socket.remotePort}`);
    // 设置编码 否则为Buffer
    // socket.setEncoding('utf8');

    // 启用长连接，每100毫秒检测一次是否断开
    // socket.setKeepAlive(true, 100);

    socket.setTimeout(5000); // 5s
    socket.on('timeout', () => {
        // timeout并不会断开连接，需要手动断开
        console.log('超时断开');
        socket.end();
    });

    // 接收的字节数量（累计）
    // socket.bytesRead

    let readBuffer = Buffer.alloc(0);
    socket.on('data', (data) => {
        readBuffer = Buffer.concat([readBuffer, data]);
        const eol = findEndOfLine(readBuffer);

        if (eol >= 0) {
            let frame;
            const delimLength = readBuffer[eol] === CR ? 2 : 1;
            const length = eol + 1;
            if (length > MAX_LENGTH) {
                fail(socket, length);
                return;
            }

            if (STRIP_DELIMITER) {
                frame = readBuffer.slice(0, eol);
            } else {
                frame = readBuffer.slice(0, eol + delimLength);
            }
            readBuffer = readBuffer.slice(eol + delimLength + 1);

            if (socket.writable) socket.write(frame);
        } else {
            const length = readBuffer.length;
            if (length > MAX_LENGTH) {
                fail(socket, length);
                return;
            }
        }
    });

    socket.on('error', (err) => {
        // 当错误发生时触发。'close' 事件也会紧接着该事件被触发。
        console.error(`客户端错误：${err.name}\n${err.stack}`);
    });

    socket.on('close', () => {
        console.log(`客户端断开：${socket.remoteAddress}:${socket.remotePort}`);
    });

    socket.on('end', () => {
        // 客户端断开FIN
        console.log('FIN');
    });
});

server.on('error', (err) => {
    console.error(`服务器错误：${err.name}\n${err.stack}`);
});

server.on('close', () => {
    console.log('服务停止');
});

server.on('listening', () => {
    console.log(`Server listen on ${HOST}:${PORT}`);
});

server.listen(PORT, HOST);

setInterval(() => {
    server.getConnections((err, connections) => {
        if (!err) {
            const now = (new Date()).toUTCString();
            const memoryUsage = JSON.stringify(process.memoryUsage());
            console.log(`[${now}] 连接数为：${connections}，最大连接数为：${server.maxConnections}，内存使用：${memoryUsage}`);
        }
    });
}, 2000);

process.on('uncaughtException', (err) => {
    console.error(`uncaughtException：${err.name}\n${err.stack}`);
    process.exit(1);
});