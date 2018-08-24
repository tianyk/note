const includeCode = require('hexo/lib/plugins/tag/include_code')(hexo);
const download = require('download');
const mime = require('mime-types');
const path = require('path');
const SEP = path.sep;

const langREG = /\/([a-zA-Z]+)$/;
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36';

function getLang(filename) {
    const mimeType = mime.lookup(filename);
    if (!mimeType) return;

    const match = mimeType.match(langREG);
    if (match) return `lang:${match[1]}`;
}

async function includeCodeTag(args) {
    if (args.length >= 1 && args.length <= 3 && args[args.length - 1].startsWith('http')) {
        const { source_dir: sourceDir, code_dir: codeDir } = hexo.config;
        let filename, lang, filepath;

        if (args.length === 1) {
            filepath = args[0];
            filename = path.basename(filepath);
            lang = getLang(filename);
        } else if (args.length === 2) {
            if (args[0].startsWith('lang')) {
                lang = args[0];
                filepath = args[1];
                filename = path.basename(filepath);
            } else {
                filename = args[0];
                lang = getLang(filename);
                filepath = args[1];
            }
        } else if (args.length === 3) {
            filename = args[0];
            lang = args[1];
            filepath = args[2];
        }

        await download(filepath, path.join(sourceDir, codeDir, 'autogeneration'), { filename, headers: { 'user-agent': userAgent } });
        args = [filename, lang, `autogeneration${SEP}${filename}`].filter(arg => !!arg);
    }
    console.log(args)
    return includeCode(args);
}


hexo.extend.tag.register('include_code', includeCodeTag, { async: true });
hexo.extend.tag.register('include-code', includeCodeTag, { async: true });
