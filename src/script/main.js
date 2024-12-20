// Importing apiFetch.js
import { config, fetchApiKey } from './apiFetch.js'; 

// Queryselcectors.
const planets = document.querySelectorAll('.planet');
const sun = document.querySelector('.sun');
const popup = document.getElementById('planetPopup');
const closeButton = document.querySelector('.close-btn');
const popupData = document.getElementById('popupData');
const planetSidePopup = document.querySelector('.planet-sidepopup');
const planetSidePopupTwo = document.querySelector('.planet-sidepopup-two');
const planetSidePopupThree = document.querySelector('.planet-sidepopup-three');

// Planet name map for our event.
const planetNameMap = {
    mercury: "Merkurius",
    venus: "Venus",
    earth: "Jorden",
    mars: "Mars",
    jupiter: "Jupiter",
    saturn: "Saturnus",
    uranus: "Uranus",
    neptune: "Neptunus",
    sun: "Solen"
};

// Fetch celestial body data
const fetchCelestialData = async (name) => {
    if (!config.apiKey) {
        await fetchApiKey();
        if (!config.apiKey) return;
    }

    try {
        // fetch the bodies
        const response = await fetch(`${config.BASE_URL}/bodies`, {
            method: 'GET',
            headers: { 'x-zocom': config.apiKey }
        });
        // error if response not OK.
        if (!response.ok) {
            console.error(`API Error: ${response.status} ${response.statusText}`);
            popupData.textContent = `Error fetching data: ${response.statusText}`;
            return;
        }

        const responseData = await response.json();
        const celestialBodies = responseData.bodies || [];
        const body = celestialBodies.find(b => b.name.toLowerCase() === name.toLowerCase());

        // if body is avaliable then run the displayCelestialData Function with the body.
        if (body) {
            displayCelestialData(body);
        } else {
            popupData.textContent = `No data available for ${name}.`;
        }
    } catch (error) {
        console.error('Error fetching celestial data:', error);
        popupData.textContent = `Failed to fetch data for ${name}. Please try again later.`;
    }
};

// Format numbers with spaces using localString sv-SE.
const formatNumber = (number) => number.toLocaleString('sv-SE');

// Display Celestial Data on website.
const displayCelestialData = (body) => {
    popupData.innerHTML = `
        <div class="popup-content">
            <h1 class="planet-name">${body.name}</h1>
            <h2 class="planet-latin-name">${body.latinName}</h2>
            <p class="planet-description">${body.desc}</p>
            <hr>
            <div class="planet-details">
                <div class="detail-item left">
                    <h3>OMKRETS</h3>
                    <p>${formatNumber(body.circumference)} km</p>
                </div>
                <div class="detail-item right">
                    <h3>KM FRÅN SOLEN</h3>
                    <p>${formatNumber(body.distance)} km</p>
                </div>
                <div class="detail-item left">
                    <h3>MAX TEMPERATUR</h3>
                    <p>${body.temp.day}C</p>
                </div>
                <div class="detail-item right">
                    <h3>MIN TEMPERATUR</h3>
                    <p>${body.temp.night}C</p>
                </div>
            </div>
            <hr>
            <div class="moon-details">
                <div class="detail-item">
                    <h3>MÅNAR</h3>
                    <p>${body.moons.length > 0 ? body.moons.join(', ') : 'Inga'}</p>
                </div>
            </div>
        </div>
    `;
};

// Update side-popup classes (planet etc)
const updateSidePopupClasses = (name) => {
    planetSidePopup.className = `planet-sidepopup planet-${name}-side`;
    planetSidePopupTwo.className = `planet-sidepopup-two planet-${name}-side`;
    planetSidePopupThree.className = `planet-sidepopup-three planet-${name}-side`;
};

// Add event listeners for pressing on the planets.
planets.forEach(planet => {
    planet.addEventListener('click', () => {
        const className = planet.classList[1].split('-')[1];
        const apiName = planetNameMap[className];
        if (apiName) {
            updateSidePopupClasses(className);
            fetchCelestialData(apiName);
            popup.style.display = 'flex';
        }
    });
});

// add event listner for pressing on the sun.
sun.addEventListener('click', () => {
    updateSidePopupClasses('sun');
    fetchCelestialData(planetNameMap['sun']);
    popup.style.display = 'flex';
});

// event listner when closing the popup
closeButton.addEventListener('click', () => {
    popup.style.display = 'none';
});
