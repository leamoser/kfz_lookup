const BTN_COLORMODE = document.querySelector('#btn_colormode');

let colormode = 'light';

const setColorMode = (mode, save = false) => {
    document.documentElement.dataset.theme = mode;
    colormode = mode;
    if (save) {
        localStorage.setItem('theme', mode);
    }
}
const toggleColorMode = () => {
    if (colormode === 'light') {
        setColorMode('dark', true);
    } else {
        setColorMode('light', true);
    }
}

BTN_COLORMODE.addEventListener('click', toggleColorMode);

const init = () => {
    if (!window.matchMedia) return;
    const saved_theme = localStorage.getItem('theme');
    if (saved_theme) {
        setColorMode(saved_theme, false);
        return;
    }
    const query = window.matchMedia('prefers-color-scheme: dark');
    if (query.matches) {
        setColorMode('dark', false);
    } else {
        setColorMode('light', false);
    }
}
init();
