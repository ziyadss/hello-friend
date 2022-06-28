function validate(options) {
  // TODO: validate

  if (options.ROOT_FOLDER.length == 0) {
    return false;
  }

  if (options.COLOR_THEME.length == 0) {
    return false;
  }

  if (options.MAX_NAME_LENGTH <= 2) {
    return false;
  }

  console.log(options.COLOR_THEME);

  return true;
}

function save() {
  const new_options = {
    TITLE: document.getElementById('title').value,
    ROOT_FOLDER: document.getElementById('root_folder').value,
    TITLE_COLOR: document.getElementById('title_color').value,
    BACKGROUND: document.getElementById('background').value,
    SEPARATORS: document.getElementById('separators').value.split(','),
    COLOR_THEME: document
      .getElementById('color_theme')
      .value.split(',')
      .filter((color) => color),
    MAX_NAME_LENGTH: parseInt(document.getElementById('max_name_length').value),
  };

  const status = document.getElementById('status');
  if (validate(new_options)) {
    chrome.storage.sync.set(new_options, () => {
      restore();
      status.textContent = 'Options saved.';
      setTimeout(() => (status.textContent = ''), 750);
    });
  } else {
    status.textContent = 'Invalid options.';
    setTimeout(() => (status.textContent = ''), 750);
  }
}

function restore() {
  chrome.storage.sync.get(options, (options) => {
    document.getElementById('title').value = options.TITLE;
    document.getElementById('root_folder').value = options.ROOT_FOLDER;
    document.getElementById('title_color').value = options.TITLE_COLOR;
    document.getElementById('background').value = options.BACKGROUND;
    document.getElementById('separators').value = options.SEPARATORS;
    document.getElementById('color_theme').value = options.COLOR_THEME;
    document.getElementById('max_name_length').value = options.MAX_NAME_LENGTH;

    document.body.style.background = options.BACKGROUND;
    document.getElementById('welcome').style.color = options.TITLE_COLOR;
    document.getElementById('welcome').innerHTML = options.TITLE;
  });
}

function loaded() {
  restore();
  document.getElementById('save').addEventListener('click', save);
  document.getElementById('defaults').addEventListener('click', () =>
    chrome.storage.sync.set(options, () => {
      restore();
      const status = document.getElementById('status');
      status.textContent = 'Defaults restored.';
      setTimeout(() => (status.textContent = ''), 750);
    })
  );
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
  loaded();
} else {
  document.addEventListener('DOMContentLoaded', loaded);
}
