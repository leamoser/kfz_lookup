const SEARCH = document.querySelector('#search');
const CLEAR = document.querySelector('#clear');
const LIST = document.querySelector('#list');
const LIST_WRAPPER = document.querySelector('#list_wrapper');
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
    LIST.innerHTML = '';
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
        LIST.appendChild(row);
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
        LIST_WRAPPER.classList.remove('hidden');
        renderList();
        renderMap();
    } else {
        filtered = [];
        ids = [];
        LIST_WRAPPER.classList.add('hidden');
        renderList();
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
        LIST_WRAPPER.classList.remove('hidden');
        renderList();
        renderMap();
    } else {
        filtered = [];
        ids = [];
        LIST_WRAPPER.classList.add('hidden');
        renderList();
        renderMap();
    }
})
CLEAR.addEventListener('click', () => {
    SEARCH.value = '';
    filtered = [];
    ids = [];
    LIST_WRAPPER.classList.add('hidden');
    SEARCH.focus();
    renderList();
    renderMap();
})
