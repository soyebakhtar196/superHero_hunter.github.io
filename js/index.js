// SETUP the key variable.
let PRIVATE_KEY = "7acaa0a973619a98f3406bebd693822f1ac82eb4";
let PUBLIC_KEY = "70392fec40011ae2956d65e925b17e15";
// calculate the time stamp and assign variable for this
let ts = new Date().getTime();
// calculate our hash key for the URL
let hash = CryptoJS.MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();

// Call the DOM function
const form = document.getElementById('form');
const search = document.getElementById('search');
const searchButton = document.getElementById('search-btn');
const main = document.getElementById('main');
const loadingImg = document.getElementById('loading');

// write a variable to set the limit and total data
const total = 1562;
const limit = 90;
let offset = 0;

const baseUrl = `https://gateway.marvel.com:443/v1/public/characters`;
let superHeroData = [];

// function for fetch the super hero data
async function fetchSuperHero() {
  // set the style for loading image function
  loadingImg.style.display = 'block';
  while (offset < total) {
    const apiUrl = `${baseUrl}?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}&limit=${limit}&offset=${offset}`;
    const Response = await fetch(apiUrl);

    if (!Response.ok) {
      throw new Error(`Failed to fetch data. Status: ${Response.status}`);
    }

    const data = await Response.json();
    let results = data.data.results; // Assign the fetched data to superHeroData
    showSuperHeros(superHeroData);
    superHeroData.push(...results);
    offset += limit;
  }
  // here we have call the show super hero function
  showSuperHeros(superHeroData);

  // here we have set the style for loading
  loadingImg.style.display = 'none';
}

// we have called the fetch super hero function here
fetchSuperHero();

// here is the function for show the super hero details on site
function showSuperHeros(superHeroData) {
  main.innerHTML = "";

  superHeroData.forEach(superHero => {
    const { name, description, thumbnail, id } = superHero;
    const { path, extension } = thumbnail;
    const superHeroEl = document.createElement('div');
    superHeroEl.innerHTML = `<div class="col">
                            <div class="card">
                            <button class="container-heart button" onclick="addFavorites(${id})" data-id="${id}"><i class="fa-solid fa-heart"></i></button>
                                <img src="${path}.${extension}" class="card-img-top" alt="${name}">
                                <div class="card-body">
                                    <h5 class="card-title">${name}</h5>
                                    <p class="card-text">${description}</p>
                                    <a href="superhero_info.html?id=${id}"><button>Show Details..</button></a>
                                </div>
                            </div>
                    </div>`;

    main.appendChild(superHeroEl);
  });
}

// here is the function for add favorite superhero in local storage
function addFavorites(superHeroId) {
  const selectedSuperHero = superHeroData.find(superHero => superHero.id === superHeroId);
  if (selectedSuperHero) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const isAlreadyFavorite = favorites.some(superHero => superHero.id === selectedSuperHero.id);
    if (isAlreadyFavorite) {
      alert('Superhero is Already in Favorites');
      return;
    }
    favorites.push(selectedSuperHero);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
  // here the function for change the color of the favorite icon
  const heartButtons = document.querySelectorAll('.container-heart');
  heartButtons.forEach(heartButton => {
      const dataId = heartButton.getAttribute('data-id');
      if (dataId === String(superHeroId)) {
          heartButton.classList.add('favorite');
          heartButton.querySelector('i').style.color = 'red';
      }
  });
}


// here is input addevent listener to serch a item by alphbet
search.addEventListener('input', function () {
  const searchQuery = search.value.toLowerCase();
  const filteredSuperHeroes = superHeroData.filter(searchsuperhero =>
    searchsuperhero.name.toLowerCase().includes(searchQuery)
  );
  showSuperHeros(filteredSuperHeroes);
});

// here click eventlistener to search the item by name after using searchButton
searchButton.addEventListener('click', function (e) {
  e.preventDefault();
  const searchQuery = search.value.toLowerCase();
  const filteredSuperHeroes = superHeroData.filter(searchsuperhero =>
    searchsuperhero.name.toLowerCase().includes(searchQuery)
  );
  showSuperHeros(filteredSuperHeroes);
})