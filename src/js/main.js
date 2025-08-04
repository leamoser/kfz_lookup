const MAIN = document.querySelector('main');
const SEARCH = document.querySelector('#search');
const CLEAR = document.querySelector('#clear');
const TABLE = document.querySelector('#table');
const LIST = document.querySelector('#list');
const EXACT = document.querySelector('#exact');
const MAP = document.querySelector('#map>svg');
const LANDKREISE = MAP.querySelectorAll('#landkreise path, #landkreise polygon');

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
    if (!filtered || filtered.length === 0) return;
    filtered.forEach((item) => {
        const row = document.createElement('tr');
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

SEARCH.addEventListener('input', () => {
    if (!data) return;
    const query = SEARCH.value.toUpperCase();
    SEARCH.value = SEARCH.value.toUpperCase();
    if (query) {
        filtered = data.filter((item) => {
            return item.kennzeichen.startsWith(query) || item.kennzeichen === query;
        })
        const mapped = filtered.map((item) => item.landkreis_id)
        ids = [...new Set(mapped)];
        LIST.classList.remove('hidden');
        renderList();
        renderOverscroll();
        renderMap();
    } else {
        filtered = [];
        ids = [];
        LIST.classList.add('hidden');
        renderList();
        renderOverscroll();
        renderMap();
    }
});
EXACT.addEventListener('click', () => {
    if (!data) return;
    const query = SEARCH.value.toUpperCase();
    SEARCH.value = SEARCH.value.toUpperCase();
    if (query) {
        filtered = data.filter((item) => {
            return item.kennzeichen === query;
        })
        const mapped = filtered.map((item) => item.landkreis_id)
        ids = [...new Set(mapped)];
        LIST.classList.remove('hidden');
        renderList();
        renderOverscroll();
        renderMap();
    } else {
        filtered = [];
        ids = [];
        LIST.classList.add('hidden');
        renderList();
        renderOverscroll();
        renderMap();
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
