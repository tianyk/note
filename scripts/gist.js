'use strict';

hexo.extend.tag.register('gist', function gistTag(args) {
  const id = args[0];
  if (!id) return '';

  const file = args[1];
  const matched = id.match(/^([^/]+)\/(.+)$/);
  const gistUrl = matched
    ? `https://gist.github.com/${matched[1]}/${matched[2]}.js`
    : `https://gist.github.com/${id}.js`;
  const query = file ? `?file=${encodeURIComponent(file)}` : '';

  return `<script src="${gistUrl}${query}"></script>`;
});
