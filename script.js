const columns = [];
chrome.storage.sync.get(options, (options) => {
  chrome.bookmarks.getTree((items) => {
    options.ROOT_FOLDER = new RegExp(options.ROOT_FOLDER, 'i');
    const bookmarksBar = items[0].children.find((x) => options.ROOT_FOLDER.test(x.title));

    if (!bookmarksBar) {
      console.error(`Was expecting a folder called '${options.ROOT_FOLDER}'`);
    }

    const rootBookmarks = bookmarksBar.children.filter((node) => !node.children);
    const rootFolders = bookmarksBar.children.filter((node) => !!node.children);

    const rootColumn = { title: '/', children: [] };
    rootBookmarks.forEach((node) => addBookmark(rootColumn, node));
    columns.push(rootColumn);

    rootFolders.forEach((node) => {
      const column = { title: node.title, children: [] };
      visit(column, node);
      columns.push(column);
    });

    render(columns);
  });

  function render(columns) {
    const colors = options.COLOR_THEME;
    const root = document.getElementById('container');

    let colourIndex = 0;

    root.innerHTML = columns
      .filter((column) => column.children.length)
      .map((column) => {
        const listItems = column.children
          .map((bookmark) => {
            const full_title = bookmark.path.slice(1).concat(bookmark.title).join('/');

            const title =
              full_title.length <= options.MAX_NAME_LENGTH - 2
                ? full_title
                : full_title.substring(0, options.MAX_NAME_LENGTH) + '…';

            if (bookmark.isSeparator) {
              return '<li class="separator">&nbsp;</li>';
            }

            return `<li><a href="${bookmark.url}" ${
              title.endsWith('…') ? `title="${bookmark.title}"` : ''
            }>${title}</a></li>`;
          })
          .join('');

        colourIndex = (colourIndex + 1) % colors.length;
        return `<div class="column"><h2 class="folder-name" style="color: ${colors[colourIndex]}">${column.title}</h2><ul>${listItems}</ul></div>`;
      })
      .join('');
  }

  function visit(column, node, path = []) {
    if (node.children) {
      node.children.forEach((x) => visit(column, x, [...path, node.title]));
      return;
    }

    addBookmark(column, node, path);
  }

  function addBookmark(column, node, path = []) {
    if (!node.url || node.url.startsWith('javascript:')) {
      return;
    }

    const isSeparator = options.SEPARATORS.includes(node.title) || node.type === 'separator';

    column.children.push({ title: node.title, url: node.url, path: path, isSeparator });
  }

  function loaded() {
    document.body.style.background = options.BACKGROUND;

    const welcome = document.getElementById('welcome');
    welcome.textContent = options.TITLE;
    welcome.style.color = options.TITLE_COLOR;
  }

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    loaded();
  } else {
    document.addEventListener('DOMContentLoaded', loaded);
  }
});
