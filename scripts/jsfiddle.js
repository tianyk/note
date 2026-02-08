'use strict';

const DEFAULT_TABS = 'default';
const DEFAULT_SKIN = 'light';
const DEFAULT_WIDTH = '100%';
const DEFAULT_HEIGHT = '300';

hexo.extend.tag.register('jsfiddle', function jsfiddleTag(args) {
  const id = args[0];
  if (!id) return '';

  const tabs = args[1] || DEFAULT_TABS;
  const skin = args[2] || DEFAULT_SKIN;
  const width = args[3] || DEFAULT_WIDTH;
  const height = args[4] || DEFAULT_HEIGHT;
  const src = `https://jsfiddle.net/${id}/embedded/${tabs}/${skin}/`;

  return `<iframe scrolling="no" width="${width}" height="${height}" src="${src}" frameborder="0" loading="lazy" allowfullscreen="allowfullscreen"></iframe>`;
});
