#!/usr/bin/env node

const url = require('url');
const http = require('http');
const https = require('https');
const crypto = require('crypto');

const stringCompare = String.prototype.localeCompare;
const padStart = String.prototype.padStart;
const padEnd = String.prototype.padEnd;

// accesskeys 访问<https://ram.console.aliyun.com/#/user/list>申请
const ACCESS_KEY_ID = 'YOUR_ACCESS_KEY_ID';
const ACCESS_KEY_SECRET = 'YOUR_ACCESS_KEY_SECRET';


/**
 * 比较字符串
 * 
 * String.prototype.localeCompare 算法有问题 AA > Aa 
 *
 * @param {*} str1
 * @param {*} str2
 * @returns
 */
function compareString(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const lim = Math.min(len1, len2);

    const str1codes = str1.split('').map(char => char.codePointAt(0));
    const str2codes = str2.split('').map(char => char.codePointAt(0));

    let k = 0, c1, c2;
    while (k < lim) {
        c1 = str1codes[k];
        c2 = str2codes[k];

        if (c1 !== c2) {
            return c1 - c2;
        }
        k++;
    }
    return len1 - len2;
}


function sha1(str, key) {
    return crypto.createHmac('sha1', key)
        .update(str)
        .digest()
        .toString('base64');
}


/**
 * 获取时间字符串 YYYY-MM-DDTHH:mm:ssZ
 *
 * @param {*} date
 * @returns
 */
function utcDateFormat(time) {
    // YYYY-MM-DDTHH:mm:ss.sssZ include milliseconds
    // return time.toISOString().match(/^(\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2})/)[1] + 'Z';

    const year = time.getUTCFullYear();
    const month = padStart.call(time.getUTCMonth() + 1, 2, '0');
    const date = padStart.call(time.getUTCDate(), 2, '0');
    const hours = padStart.call(time.getUTCHours(), 2, '0');
    const minutes = padStart.call(time.getUTCMinutes(), 2, '0');
    const secounds = padStart.call(time.getUTCSeconds(), 2, '0');

    return `${year}-${month}-${date}T${hours}:${minutes}:${secounds}Z`;
}


/**
 * 字符串编码（阿里规则）
 * 
 * 规则：<https://help.aliyun.com/document_detail/29747.html> 1.b
 * 
 * @param {*} str
 * @returns
 */
function percentEncode(str) {
    return encodeURIComponent(str).replace('+', '%20').replace('*', '%2A').replace('%7E', '~');
}


/**
 * HTTPs GET
 * 
 * @param {*} { url, timeout = 5000, json = true }
 * @param query 请求参数对象
 * @param json 如果为true并且content-type为application/json的情况下会反序列化
 * @returns 
 * @throws 如果响应码为4xx或者5xx响应会作为错误抛出
 */
async function request({ url: uri, query = {}, timeout = 5000, json = true }) {
    return new Promise((resolve, reject) => {
        // 合并query
        const urlObject = url.parse(uri, true);
        Object.assign(urlObject.query, query);
        urlObject.search = null;
        uri = url.format(urlObject);

        // support HTTPs
        let protocol;
        if (urlObject.protocol === 'https:') protocol = https;
        else if (urlObject.protocol === 'http:') protocol = http;
        else { throw new Error(`unsupported protocol [${urlObject.protocol}]`) };

        const req = protocol.get(uri)
        req.setTimeout(timeout);
        req.on('timeout', () => req.abort());

        req.on('response', (res) => {
            res.setEncoding('utf8');
            const { statusCode, headers } = res;

            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                let data = rawData;
                if (json && -1 !== headers['content-type'].indexOf('application/json')) {
                    data = JSON.parse(rawData);
                }

                if (statusCode >= 400) {
                    reject(data);
                } else {
                    resolve(data);
                }
            });
        });

        req.on('error', reject);
    });
}


function timeout(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('operation timed out'));
        }, time);
    });
}


/**
 * 查询本机公网IP
 *
 * @returns
 */
async function findMyIP() {
    const rawData = await Promise.race([
        request({ url: 'http://myip.ipip.net', json: false }),
        // request({ url: 'http://ipinfo.io', json: false }),
        request({ url: 'https://api.ipify.org', json: false })
    ]);

    const match = rawData.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
    if (!match) throw new Error(`无法解析IP。${rawData}`)

    return match[1];
}

/**
 * 生成公共参数
 * 
 * 参考：<https://help.aliyun.com/document_detail/29745.html>
 *
 * @param {*} { accessKeyId, format = 'JSON', signatureNonce = Math.random(), timestamp = utcDateFormat(new Date()) }
 * @returns
 */
function generatePublicParams({ accessKeyId, format = 'JSON', signatureNonce = Math.random(), timestamp = utcDateFormat(new Date()) }) {
    return {
        'AccessKeyId': accessKeyId,
        'Format': format,
        'Version': '2015-01-09',
        'SignatureMethod': 'HMAC-SHA1',
        'SignatureNonce': signatureNonce,
        'SignatureVersion': '1.0',
        'Timestamp': timestamp
    };
}

/**
 * 签名
 * 
 * 规则：<https://help.aliyun.com/document_detail/29747.html>
 *
 * @param {*} { params, accesskeySecret }
 * @returns
 */
function sign({ params, accesskeySecret }) {
    const query = Object.entries(params)
        .sort((param1, param2) => compareString(param1[0], param2[0]))
        .map(([key, val]) => [percentEncode(key), percentEncode(val)])
        .map(param => param.join('='))
        .join('&');


    let stringToSign = 'GET&' + percentEncode('/') + '&' + percentEncode(query);
    const signStr = sha1(stringToSign, `${accesskeySecret}&`);
    return signStr;
}

/**
 * 请求接口
 *
 * @param {*} { params, accessKeyId, accesskeySecret }
 * @returns
 */
async function callApi({ params, accessKeyId, accesskeySecret }) {
    // 签名
    const signStr = sign({ params, accesskeySecret });
    params['Signature'] = signStr;

    const data = await request({ url: 'https://alidns.aliyuncs.com/', query: params });
    return data;
}


/**
 * 获取解析记录列表
 *
 * 参考：<https://help.aliyun.com/document_detail/29776.html>
 * 
 * @param {*} { domainName, rrKeyWord, pageNumber = 1, pageSize = 20, typeKeyWord = 'A', accessKeyId = ACCESS_KEY_ID, accesskeySecret = ACCESS_KEY_SECRET }
 * @returns
 */
async function describeDomainRecords({ domainName, rrKeyWord, pageNumber = 1, pageSize = 20, typeKeyWord = 'A', accessKeyId = ACCESS_KEY_ID, accesskeySecret = ACCESS_KEY_SECRET }) {
    const params = {
        'Action': 'DescribeDomainRecords',
        'DomainName': domainName,
        'PageNumber': pageNumber,
        'PageSize': pageSize,
        'RRKeyWord': rrKeyWord,
        'TypeKeyWord': typeKeyWord
    };

    Object.assign(params, generatePublicParams({ accessKeyId }));

    const resp = await callApi({ params, accessKeyId, accesskeySecret });
    return resp;
}


/**
 * 修改解析记录
 * 
 * 参考：<https://help.aliyun.com/document_detail/29774.html>
 * 
 * @param {*} { recordId, rr, value, type = 'A', ttl = 600, line = 'default', accessKeyId = ACCESS_KEY_ID, accesskeySecret = ACCESS_KEY_SECRET }
 * @param ttl 基础版最小600秒
 * @returns
 */
async function updateDomainRecord({ recordId, rr, value, type = 'A', ttl = 600, line = 'default', accessKeyId = ACCESS_KEY_ID, accesskeySecret = ACCESS_KEY_SECRET }) {
    const params = {
        'Action': 'UpdateDomainRecord',
        'RecordId': recordId,
        'RR': rr,
        'Type': type,
        'Value': value,
        'TTL': ttl,
        'Line': line
    };

    Object.assign(params, generatePublicParams({ accessKeyId }));

    const resp = await callApi({ params, accessKeyId, accesskeySecret });
    return resp;
}

// findMyIP().then(console.log).catch(console.error);

// describeDomainRecords({ domainName: 'kekek.cc', rrKeyWord: 'www' }).then((recoder) => {
//     console.log(JSON.stringify(recoder, null, 2))
// }).catch(console.error)

// updateDomainRecord({ recordId: '3535020439014400', rr: 'www', value: '202.106.0.21' }).then(console.log).catch(console.error)

// ========================================>

(async () => {
    // 要更新的域名
    let records = [];
    try {
        records = require('./domains.json');
    } catch (ignored) {
        records = [
            {
                domainName: 'kekek.cc',
                rrKeyWord: 'www'
            },
            {
                domainName: 'kekek.cc',
                rrKeyWord: '@'
            }
        ];
    }

    const myip = await findMyIP();

    for (const record of records) {
        const recordDetails = await describeDomainRecords(record);
        const recordDetail = recordDetails.DomainRecords.Record.filter(_record => _record.RR === record.rrKeyWord)[0];

        if (recordDetail && recordDetail['Value'] !== myip) {
            console.log('[update] domainName: %s, rr: %s, before: %s, after: %s', record.domainName, record.rrKeyWord, recordDetail['Value'], myip);
            await updateDomainRecord({ recordId: recordDetail['RecordId'], rr: record.rrKeyWord, value: myip, ttl: record.ttl });
        }
    }
})().then(() => console.log(new Date())).catch(console.error)
