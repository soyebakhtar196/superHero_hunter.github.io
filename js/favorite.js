// Retrieve favorites from local storage
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// show the favorite data
function showFavorites() {
  const mainContainer = document.getElementById('main-container');
  mainContainer.innerHTML = "";

  // set the function for show the details over the site
  favorites.forEach(superHero => {
    const { name, description, thumbnail, id } = superHero;
    const { path, extension } = thumbnail;
    const superHeroEl = document.createElement('div');
    superHeroEl.innerHTML = `<div class="col" data-id="${id}">
                          <div class="card">
                            <button class="container-heart remove-btn"><i class="fa-solid fa-trash fa-beat"></i></button>
                            <img src="${path}.${extension}" class="card-img-top" alt="${name}">
                            <div class="card-body">
                                <h5 class="card-title">${name}</h5>
                                <p class="card-text">${description}</p>
                                <a href="superhero_info.html?id=${id}"><button>Show Details...</button></a>
                            </div>
                          </div>
                        </div>`;

    mainContainer.appendChild(superHeroEl);
  });

  // here addevent listener to perform click event function to remove the data from favorite
  const removeButtons = mainContainer.getElementsByClassName('remove-btn');
  Array.from(removeButtons).forEach(button => {
    button.addEventListener('click', function () {
      const superHeroId = parseInt(button.parentNode.parentNode.getAttribute('data-id'));
      removeFavorite(superHeroId);
    });
  });
}

// here we have written a function for remove data from favorite
function removeFavorite(superHeroId) {

  const index = favorites.findIndex(superHero => superHero.id === superHeroId);
  if (index !== -1) {
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Superhero removed successfully');
  }
  showFavorites();
}

// we have called the show Favorite function
showFavorites();
