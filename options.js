var options = {};

function defaults() {
  options = {
    TITLE: 'hello, friend',
    ROOT_FOLDER: /(bookmarks (tool)?bar|favou?rites bar)/i,
    TITLE_COLOR: '#4d4f68',
    BACKGROUND: '#282936',
    SEPARATORS: ['-', ''],
    COLOR_THEME: [
      '#ea51b2',
      '#00f769',
      '#ebff87',
      '#62d6e8',
      '#b45bcf',
      '#a1efe4',
      '#e9e9f4',
    ],
    MAX_NAME_LENGTH: 30,
  };
  restore();
}

function validate(options) {
  // TODO: validate

  if (options.ROOT_FOLDER.source.length == 0) {
    return false;
  }

  if (options.COLOR_THEME.length == 0) {
    return false;
  }

  if (options.MAX_NAME_LENGTH <= 2) {
    return false;
  }

  return true;
}

function save() {
  const TITLE = document.getElementById('title').value;
  const ROOT_FOLDER = new RegExp(
    document.getElementById('root_folder').value,
    'i'
  );
  const TITLE_COLOR = document.getElementById('title_color').value;
  const BACKGROUND = document.getElementById('background').value;
  const SEPARATORS = document.getElementById('separators').value.split(',');
  const COLOR_THEME = document
    .getElementById('color_theme')
    .value.split(',')
    .filter((color) => color);
  const MAX_NAME_LENGTH = parseInt(
    document.getElementById('max_name_length').value
  );

  const new_options = {
    TITLE,
    ROOT_FOLDER,
    TITLE_COLOR,
    BACKGROUND,
    SEPARATORS,
    COLOR_THEME,
    MAX_NAME_LENGTH,
  };

  if (validate(new_options)) {
    options = new_options;
  } else {
    console.log('invalid options');
    // TODO: show error
  }
}

function restore() {
  document.getElementById('title').value = options.TITLE;
  document.getElementById('root_folder').value = options.ROOT_FOLDER.source;
  document.getElementById('title_color').value = options.TITLE_COLOR;
  document.getElementById('background').value = options.BACKGROUND;
  document.getElementById('separators').value = options.SEPARATORS;
  document.getElementById('color_theme').value = options.COLOR_THEME;
  document.getElementById('max_name_length').value = options.MAX_NAME_LENGTH;

  document.body.style.background = options.BACKGROUND;
  document.getElementById('welcome').style.color = options.TITLE_COLOR;
  document.getElementById('welcome').innerHTML = options.TITLE;
}

document.addEventListener('DOMContentLoaded', () => {
  defaults();
  document.getElementById('save').addEventListener('click', save);
  document.getElementById('defaults').addEventListener('click', defaults);
});
