// here we have search the url from window
const urlParams = new URLSearchParams(window.location.search);
// here fetch the url from the id
const superHeroId = urlParams.get('id');

// here the function for fetch the super hero
async function fetchSuperHero() {
    let PRIVATE_KEY = "7acaa0a973619a98f3406bebd693822f1ac82eb4";
    let PUBLIC_KEY = "70392fec40011ae2956d65e925b17e15";
    let ts = new Date().getTime();
    let hash = CryptoJS.MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();
    const baseUrl = `https://gateway.marvel.com:443/v1/public/characters/${superHeroId}`;
    const apiUrl = `${baseUrl}?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`)
    }
    const data = await response.json();
    const heroData = data.data.results[0];
    return heroData;
}

// here the function for show the super hero details and show the details over the website
async function showSuperHeroDetails() {
    const heroData = await fetchSuperHero();
    const { name, description, thumbnail, id, comics, stories, series } = heroData;
    const { path, extension } = thumbnail;
    const { available } = comics;

    document.getElementById('hero-image').src = `${path}.${extension}`;
    document.getElementById('hero-name').textContent = `Name:- ${name}`;
    document.getElementById('hero-description').textContent = `Description:- ${description}`
    document.getElementById('hero-id').textContent = `Id:- ${id}`;
    document.getElementById('hero-comics').textContent = `comics:- ${available}`;
    document.getElementById('hero-story-count').textContent = `Story Count:- ${stories.available}`;
    document.getElementById('hero-series-count').textContent = `Series Count:- ${series.available}`;

    const storyContainer = document.getElementById('hero-story');
    storyContainer.innerHTML = '';

    stories.items.forEach(story => {
        const { name } = story;

        const paraTag = document.createElement('small');
        paraTag.setAttribute('class', 'hero-story-name');
        paraTag.textContent = `Story Name: ${name}, `;

        storyContainer.appendChild(paraTag);
    });

    const seriesContainer = document.getElementById('hero-series');
    seriesContainer.innerHTML = '';

    series.items.forEach(series => {
        const { name } = series;
        const serieName = document.createElement('small');
        serieName.setAttribute('id', 'hero-series-name');
        serieName.textContent = `Series Name:- ${name} `;

        seriesContainer.appendChild(serieName);
    })

}

showSuperHeroDetails();
fetchSuperHero();