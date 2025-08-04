/*DOM elements*/
const MAIN = document.querySelector('main');
const ASIDE = document.querySelector('aside');
const BTN_TOGGLE_LIST = document.querySelector('#btn_toggle_list');
const BTN_CLEAR_SEARCH = document.querySelector('#btn_clear_search');
const BTN_CLOSE_LIST = document.querySelector('#btn_close_list');
const BTN_SEARCH_EXACT = document.querySelector('#btn_search_exact');
const DATA_COUNT = document.querySelector('#data_count');
const DATA_TABLE = document.querySelector('#data_table');
const DATA_TOOLTIP = document.querySelector('#data_tooltip');
const INPUT_SEARCH = document.querySelector('#input_search');
const ITEM_SVG = document.querySelector('#item_svg');
const ITEMS_LANDKREISE = ITEM_SVG.querySelectorAll('.kreis');

/*init*/
async function loadData() {
    try {
        const response = await fetch('./data/list.json');
        return await response.json();
    } catch (e) {
        return false;
    }
}
const data = await loadData();

let filtered = [];
let ids = [];

/*functions*/
const renderList = () => {
    DATA_TABLE.innerHTML = '';
    if (!filtered || filtered.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td id="item_empty">Keine Ergebnisse gefunden</td>';
        DATA_TABLE.appendChild(row);
        DATA_COUNT.innerText = '0';
        return;
    };
    filtered.forEach((item) => {
        const row = document.createElement('tr');
        row.dataset.id = item.id;
        row.addEventListener('click', () => {
            INPUT_SEARCH.value = item.kennzeichen;
            BTN_SEARCH_EXACT.dispatchEvent(new Event('click'));
        })
        const kennzeichen = document.createElement('td');
        kennzeichen.innerText = item.kennzeichen;
        row.appendChild(kennzeichen);
        const stadt = document.createElement('td');
        stadt.innerText = item.stadt;
        row.appendChild(stadt);
        const bundesland = document.createElement('td');
        bundesland.innerText = item.bundesland;
        row.appendChild(bundesland);
        const ursprung = document.createElement('td');
        ursprung.innerText = item.ursprung;
        row.appendChild(ursprung);
        DATA_TABLE.appendChild(row);
    })
    DATA_COUNT.innerText = filtered.length;
}
const renderMap = () => {
    ITEMS_LANDKREISE.forEach((landkreis) => {
        const id = parseInt(landkreis.dataset.name);
        if (ids.includes(id)) {
            landkreis.classList.add('active');
        } else {
            landkreis.classList.remove('active');
        }
    })
}

const clearSearch = () => {
    filtered = [];
    ids = [];
    ASIDE.classList.remove('visible');
    MAIN.classList.remove('listed');
    renderList();
    renderMap();
}
const findAll = (query) => {
    filtered = data.filter((item) => {
        return item.kennzeichen.startsWith(query) || item.kennzeichen === query;
    })
    const mapped = filtered.map((item) => item.landkreis_id)
    ids = [...new Set(mapped)];
    ASIDE.classList.add('visible');
    MAIN.classList.add('listed');
    renderList();
    renderMap();
}
const findExact = (query) => {
    filtered = data.filter((item) => {
        return item.kennzeichen === query;
    })
    const mapped = filtered.map((item) => item.landkreis_id)
    ids = [...new Set(mapped)];
    ASIDE.classList.add('visible');
    MAIN.classList.add('listed');
    renderList();
    renderMap();
}

/*events*/
INPUT_SEARCH.addEventListener('input', () => {
    if (!data) return;
    const query = INPUT_SEARCH.value.toUpperCase();
    INPUT_SEARCH.value = INPUT_SEARCH.value.toUpperCase();
    if (query) {
        findAll(query);
    } else {
        clearSearch();
    }
});
BTN_SEARCH_EXACT.addEventListener('click', () => {
    if (!data) return;
    const query = INPUT_SEARCH.value.toUpperCase();
    INPUT_SEARCH.value = INPUT_SEARCH.value.toUpperCase();
    if (query) {
        findExact(query);
    } else {
        clearSearch()
    }
})
BTN_CLEAR_SEARCH.addEventListener('click', () => {
    INPUT_SEARCH.value = '';
    clearSearch();
})
BTN_CLOSE_LIST.addEventListener('click', () => {
    ASIDE.classList.remove('visible');
    MAIN.classList.remove('listed');
})
BTN_TOGGLE_LIST.addEventListener('click', () => {
    if (ASIDE.classList.contains('visible')) {
        ASIDE.classList.remove('visible');
        MAIN.classList.remove('listed');
    } else {
        ASIDE.classList.add('visible');
        MAIN.classList.add('listed');
    }
})
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        INPUT_SEARCH.value = '';
        document.activeElement.blur();
        clearSearch();
    }
    if (e.key === 'k' && e.metaKey) {
        INPUT_SEARCH.focus();
    }
})
ITEMS_LANDKREISE.forEach((LANDKREIS) => {
    LANDKREIS.addEventListener('click', () => {
        const id = parseInt(LANDKREIS.dataset.name);
        const landkreis = data.find(item => item.id === id);
        if (!landkreis) return;
        DATA_TOOLTIP.classList.add('inactive')
        INPUT_SEARCH.value = landkreis.kennzeichen;
        BTN_SEARCH_EXACT.dispatchEvent(new Event('click'));
    })
    LANDKREIS.addEventListener('mouseover', (e) => {
        const id = parseInt(LANDKREIS.dataset.name);
        const landkreise = data.filter(item => item.landkreis_id === id);
        if (!landkreise.length) return;
        DATA_TOOLTIP.innerHTML = landkreise.map(landkreis => landkreis.kennzeichen).join(', ');
        DATA_TOOLTIP.style.left = `${e.clientX + 10}px`;
        DATA_TOOLTIP.style.top = `${e.clientY - 10}px`;
        DATA_TOOLTIP.classList.remove('inactive')
    })
    LANDKREIS.addEventListener('mouseleave', () => {
        DATA_TOOLTIP.classList.add('inactive')
    })
})
