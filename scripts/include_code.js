'use strict';

const fs = require('hexo-fs');
const { basename, extname, join } = require('path');
const stripIndent = require('strip-indent');
const { highlight } = require('hexo-util');
const mime = require('mime-types');
const ms = require('ms');

const DOWNLOAD_TIMEOUT = '10s';
const REMOTE_DIR = 'autogeneration';
const URL_REG = /^https?:\/\//i;

const rCaptionTitleFile = /(.*)?(?:\s+|^)(\/*\S+)/;
const rLang = /\s*lang:(\w+)/i;
const rFrom = /\s*from:(\d+)/i;
const rTo = /\s*to:(\d+)/i;
const rMimeLang = /\/([a-zA-Z0-9.+-]+)$/;
const DOWNLOAD_TIMEOUT_MS = ms(DOWNLOAD_TIMEOUT);

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderDownloadFailedNotice(url) {
  const safeUrl = escapeHtml(url);
  return `<p><strong>include_code 下载失败：</strong><a href="${safeUrl}" target="_blank" rel="noopener">${safeUrl}</a></p>`;
}

function normalizeCodeDir(codeDir) {
  const normalized = String(codeDir || '').replace(/\\/g, '/').replace(/^\/+/, '');
  if (!normalized) return 'downloads/code/';
  return normalized.endsWith('/') ? normalized : `${normalized}/`;
}

function getLangByFileName(filename) {
  const mimeType = mime.lookup(filename);
  if (!mimeType) return;

  const match = mimeType.match(rMimeLang);
  if (!match) return;
  return `lang:${match[1]}`;
}

async function downloadRemoteFile(url, distDir, filename, timeoutMs) {
  await fs.mkdirs(distDir);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: { 'user-agent': userAgent },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Download failed with status ${response.status}: ${url}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(join(distDir, filename), buffer);
  } catch (err) {
    if (err && err.name === 'AbortError') {
      throw new Error(`Timeout [${DOWNLOAD_TIMEOUT}] while downloading: ${url}`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function parseRemoteArgs(args) {
  const url = args[args.length - 1];
  if (!URL_REG.test(url)) return;

  let filename;
  let lang;

  if (args.length === 1) {
    filename = basename(url);
    lang = getLangByFileName(filename);
  } else if (args.length === 2) {
    if (args[0].startsWith('lang:')) {
      filename = basename(url);
      lang = args[0];
    } else {
      filename = args[0];
      lang = getLangByFileName(filename);
    }
  } else if (args.length === 3) {
    filename = args[0];
    lang = args[1];
  } else {
    return;
  }

  return { url, filename, lang };
}

async function resolveRemoteCodeArgs(ctx, args) {
  const remote = parseRemoteArgs(args);
  if (!remote) return args;

  const codeDir = normalizeCodeDir(ctx.config.code_dir);
  const distDir = join(ctx.source_dir, codeDir, REMOTE_DIR);
  const relativePath = `${REMOTE_DIR}/${remote.filename}`;
  const cachePath = join(ctx.source_dir, codeDir, relativePath);
  const includeArgs = [remote.filename, remote.lang, relativePath].filter(Boolean);

  try {
    await downloadRemoteFile(remote.url, distDir, remote.filename, DOWNLOAD_TIMEOUT_MS);
    return includeArgs;
  } catch (err) {
    if (await fs.exists(cachePath)) {
      hexo.log.warn(`Download code fail, fallback to cached file: ${remote.url}`);
      return includeArgs;
    }

    hexo.log.warn(`Download code fail and no cache found: ${remote.url}`);
    hexo.log.debug(err.stack);
    return renderDownloadFailedNotice(remote.url);
  }
}

function createIncludeCodeTag(ctx) {
  return async function includeCodeTag(args) {
    const resolvedArgs = await resolveRemoteCodeArgs(ctx, args);
    if (typeof resolvedArgs === 'string') return resolvedArgs;
    if (!resolvedArgs || resolvedArgs.length === 0) return '';

    const config = ctx.config.highlight || {};
    const codeDir = normalizeCodeDir(ctx.config.code_dir);
    let arg = resolvedArgs.join(' ');

    let lang = '';
    arg = arg.replace(rLang, (match, _lang) => {
      lang = _lang;
      return '';
    });

    let from = 0;
    arg = arg.replace(rFrom, (match, _from) => {
      from = Number(_from) - 1;
      return '';
    });

    let to = Number.MAX_SAFE_INTEGER;
    arg = arg.replace(rTo, (match, _to) => {
      to = Number(_to);
      return '';
    });

    const match = arg.match(rCaptionTitleFile);
    if (!match) return '';

    const filePath = match[2];
    const title = match[1] || basename(filePath);
    lang = lang || extname(filePath).substring(1);

    const src = join(ctx.source_dir, codeDir, filePath);
    if (!await fs.exists(src)) return '';

    let code = await fs.readFile(src);
    code = stripIndent(code);
    const lines = code.split('\n');
    code = lines.slice(from, to).join('\n').trim();

    if (!config.enable) {
      return `<pre><code>${code}</code></pre>`;
    }

    return highlight(code, {
      lang,
      caption: `<span>${title}</span><a href="${ctx.config.root}${codeDir}${filePath.replace(/\\/g, '/')}">view raw</a>`,
      gutter: config.line_number,
      hljs: config.hljs,
      tab: config.tab_replace
    });
  };
}

function registerIncludeCodeTags() {
  const includeCodeTag = createIncludeCodeTag(hexo);
  hexo.extend.tag.unregister('include_code');
  hexo.extend.tag.unregister('include-code');
  hexo.extend.tag.register('include_code', includeCodeTag, { async: true });
  hexo.extend.tag.register('include-code', includeCodeTag, { async: true });
}

registerIncludeCodeTags();
hexo.on('ready', registerIncludeCodeTags);
