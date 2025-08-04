const MAIN = document.querySelector('main');
const SHOW_LIST = document.querySelector('#show_list');
const LIST_COUNT = document.querySelector('#count');
const SEARCH = document.querySelector('#search');
const CLEAR = document.querySelector('#clear');
const CLOSE = document.querySelector('#close');
const BADGE = document.querySelector('#badge');
const TABLE = document.querySelector('#table');
const LIST = document.querySelector('#list');
const EXACT = document.querySelector('#exact');
const MAP = document.querySelector('#map>svg');
const LANDKREISE = MAP.querySelectorAll('.kreis');

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

const renderList = () => {
    TABLE.innerHTML = '';
    if (!filtered || filtered.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td class="empty">Keine Ergebnisse gefunden</td>';
        TABLE.appendChild(row);
        LIST_COUNT.innerText = '0';
        return;
    };
    filtered.forEach((item) => {
        const row = document.createElement('tr');
        row.dataset.id = item.id;
        row.addEventListener('click', () => {
            SEARCH.value = item.kennzeichen;
            EXACT.dispatchEvent(new Event('click'));
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
        TABLE.appendChild(row);
    })
    LIST_COUNT.innerText = filtered.length;
}
const renderMap = () => {
    LANDKREISE.forEach((landkreis) => {
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
    LIST.classList.remove('visible');
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
    LIST.classList.add('visible');
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
    LIST.classList.add('visible');
    MAIN.classList.add('listed');
    renderList();
    renderMap();
}

SEARCH.addEventListener('input', () => {
    if (!data) return;
    const query = SEARCH.value.toUpperCase();
    SEARCH.value = SEARCH.value.toUpperCase();
    if (query) {
        findAll(query);
    } else {
        clearSearch();
    }
});
EXACT.addEventListener('click', () => {
    if (!data) return;
    const query = SEARCH.value.toUpperCase();
    SEARCH.value = SEARCH.value.toUpperCase();
    if (query) {
        findExact(query);
    } else {
        clearSearch()
    }
})
CLEAR.addEventListener('click', () => {
    SEARCH.value = '';
    clearSearch();
})
CLOSE.addEventListener('click', () => {
    SEARCH.value = '';
    clearSearch();
})
SHOW_LIST.addEventListener('click', () => {
    // if (!filtered.length) return;
    LIST.classList.add('visible');
    MAIN.classList.add('listed');
})
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        SEARCH.value = '';
        document.activeElement.blur();
        clearSearch();
    }
    if (e.key === 'k' && e.metaKey) {
        SEARCH.focus();
    }
})

LANDKREISE.forEach((LANDKREIS) => {
    LANDKREIS.addEventListener('click', () => {
        const id = parseInt(LANDKREIS.dataset.name);
        const landkreis = data.find(item => item.id === id);
        if (!landkreis) return;
        BADGE.classList.add('inactive')
        SEARCH.value = landkreis.kennzeichen;
        EXACT.dispatchEvent(new Event('click'));
    })
    LANDKREIS.addEventListener('mouseover', (e) => {
        const id = parseInt(LANDKREIS.dataset.name);
        const landkreise = data.filter(item => item.landkreis_id === id);
        if (!landkreise.length) return;
        BADGE.innerHTML = landkreise.map(landkreis => landkreis.kennzeichen).join(', ');
        BADGE.style.left = `${e.clientX + 10}px`;
        BADGE.style.top = `${e.clientY - 10}px`;
        BADGE.classList.remove('inactive')
    })
    LANDKREIS.addEventListener('mouseleave', () => {
        BADGE.classList.add('inactive')
    })
})
