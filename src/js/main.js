const MAIN = document.querySelector('main');
const SEARCH = document.querySelector('#search');
const CLEAR = document.querySelector('#clear');
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
        row.innerHTML = '<td class="empty" colspan="4">Keine Ergebnisse gefunden</td>';
        TABLE.appendChild(row);
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
const renderOverscroll = () => {
    const height = LIST.clientHeight;
    MAIN.style.marginBottom = `${height}px`;
}

const clearSearch = () => {
    filtered = [];
    ids = [];
    LIST.classList.add('hidden');
    renderList();
    renderOverscroll();
    renderMap();
}
const findAll = (query) => {
    filtered = data.filter((item) => {
        return item.kennzeichen.startsWith(query) || item.kennzeichen === query;
    })
    const mapped = filtered.map((item) => item.landkreis_id)
    ids = [...new Set(mapped)];
    LIST.classList.remove('hidden');
    renderList();
    renderOverscroll();
    renderMap();
}
const findExact = (query) => {
    filtered = data.filter((item) => {
        return item.kennzeichen === query;
    })
    const mapped = filtered.map((item) => item.landkreis_id)
    ids = [...new Set(mapped)];
    LIST.classList.remove('hidden');
    renderList();
    renderOverscroll();
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
    filtered = [];
    ids = [];
    LIST.classList.add('hidden');
    SEARCH.focus();
    renderList();
    renderOverscroll();
    renderMap();
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
