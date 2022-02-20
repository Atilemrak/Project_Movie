

const API_KEY = '8c8e1a50-6322-4135-8875-5d40a5420d86';
const API_URL_TOP = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&';
const API_Search = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';

getMovies(API_URL_TOP);

const result = document.querySelector('.result');
let resultSearch;
let pages = 1;
let maxPages;

async function getMovies(url) {
    const response = await fetch(url, {
        headers: {
            'Content-type': 'application/json',
            'X-API-KEY': API_KEY
        }
    });
    const Data = await response.json();
    showMovies(Data);
}

function getByRating(rating) {
    if (rating > 6.9) return 'green';
    if (rating > 5) return 'orange'
    else return 'red';

}

const MoviesEl = document.querySelector('.movies');
const divPagination = document.querySelector('.pagination');

function showMovies(data) {
    divPagination.innerHTML = '';
    maxPages = data.pagesCount;
    pagination(maxPages);


    MoviesEl.innerHTML = '';

    data.films.forEach(movie => {
        const movieEl = document.createElement("div");

        movieEl.classList.add("movie");
        movieEl.innerHTML = `
        <div class="movie__cover-inner">
                    <img class="movie__cover"
                        src="${movie.posterUrl}"
                        alt="${movie.nameRu}">
                    <div class="movie__cover--darkened"></div>
                </div>
                <div class="movie__info">
                    <div class="movie__title">${movie.nameRu}</div>
                    <div class="movie__category">${movie.genres.map((item) => ` ${item.genre}`)}</div>
                    <div class="movie__average movie__average--${getByRating(movie.rating)}">${movie.rating > 0 ? movie.rating : '0'}</div>
                </div>
        `;

        MoviesEl.appendChild(movieEl);

    });
}


const form = document.querySelector('form');
const inputSearch = form.querySelector(".header__search");

form.addEventListener('submit', (e) => search(e));


function search(e) {
    e.preventDefault();
    pages = 1;
    resultSearch = inputSearch.value;
    const urlSearch = `${API_Search}${resultSearch}`;
    if (resultSearch) {
        getMovies(urlSearch);
        result.innerHTML = `
        поиск по запросу: ${resultSearch}
        `;
        inputSearch.value = '';
    }
}


function pagination(Onpages) {

    divPagination.innerHTML += `<div class="page"><</div>`;

    if (pages + 4 <= Onpages) {
        console.log('d');

        for (let i = pages; i < Onpages + 1; ++i) {
            divPagination.innerHTML += `<div class="page">${i}</div>`;
            if (i === pages + 4) break;
        }
    } else {
        console.log('s', pages);
        for (let i = Onpages - 4; i < Onpages + 1; ++i) {
            divPagination.innerHTML += `<div class="page">${i}</div>`;
            if (i === Onpages + 4) break;
        }
    }

    divPagination.innerHTML += `<div class="page">></div>`;
    const page = divPagination.querySelectorAll(".page");
    page.forEach((item) => {
        item.addEventListener('click', () => clickPage(item));
        if (Number(item.innerHTML) === pages) item.classList.add("page--active");
    });

}

function clickPage(e) {

    if (e.innerHTML == '&lt;') {
        if (pages > 1) --pages;
    }

    if (e.innerHTML == '&gt;') {
        if (maxPages > pages) ++pages;
    }

    if (e.innerHTML != '&gt;' && e.innerHTML != '&lt;') {
        pages = Number(e.innerHTML);
    }

    const urlSearch = `${API_Search}${resultSearch}`;
    if (resultSearch) {
        getMovies(`${urlSearch}&page=${pages}`);
    } else {
        getMovies(`${API_URL_TOP}page=${pages}`);
    }

}