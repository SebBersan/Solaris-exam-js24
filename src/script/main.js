document.addEventListener('DOMContentLoaded', async function () {
    const planets = document.querySelectorAll('.planet');
    const sun = document.querySelector('.sun');
    const popup = document.getElementById('planetPopup');
    const closeButton = document.querySelector('.close-btn');
    const popupData = document.getElementById('popupData');
    const planetSidePopup = document.querySelector('.planet-sidepopup');
    const planetSidePopupTwo = document.querySelector('.planet-sidepopup-two');
    const planetSidePopupThree = document.querySelector('.planet-sidepopup-three');

    const BASE_URL = "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com";
    let apiKey = null;

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

    // Fetch API key
    async function fetchApiKey() {
        try {
            const response = await fetch(`${BASE_URL}/keys`, { method: 'POST' });
            const data = await response.json();
            return data.key;
        } catch (error) {
            console.error('Error fetching API key:', error);
            alert('Failed to fetch API key. Please try again later.');
        }
    }

    // Fetch celestial body data
    async function fetchCelestialData(name) {
        if (!apiKey) {
            apiKey = await fetchApiKey();
            if (!apiKey) return;
        }

        try {
            const response = await fetch(`${BASE_URL}/bodies`, {
                method: 'GET',
                headers: { 'x-zocom': apiKey }
            });

            if (!response.ok) {
                console.error(`API Error: ${response.status} ${response.statusText}`);
                popupData.textContent = `Error fetching data: ${response.statusText}`;
                return;
            }

            const responseData = await response.json();
            const celestialBodies = responseData.bodies || [];
            const body = celestialBodies.find(b => b.name.toLowerCase() === name.toLowerCase());

            if (body) {
                displayCelestialData(body);
            } else {
                popupData.textContent = `No data available for ${name}.`;
            }
        } catch (error) {
            console.error('Error fetching celestial data:', error);
            popupData.textContent = `Failed to fetch data for ${name}. Please try again later.`;
        }
    }

    function displayCelestialData(body) {
        popupData.innerHTML = `
            <div class="popup-content">
                <h1 class="planet-name">${body.name}</h1>
                <h2 class="planet-latin-name">${body.latinName}</h2>
                <p class="planet-description">${body.desc}</p>
                <hr>
                <div class="planet-details">
                    <div class="detail-item left">
                        <h3>OMKRETS</h3>
                        <p>${body.circumference} km</p>
                    </div>
                    <div class="detail-item right">
                        <h3>KM FRÅN SOLEN</h3>
                        <p>${body.distance} km</p>
                    </div>
                    <div class="detail-item left">
                        <h3>MAX TEMPERATUR</h3>
                        <p>${body.temp.day}°C</p>
                    </div>
                    <div class="detail-item right">
                        <h3>MIN TEMPERATUR</h3>
                        <p>${body.temp.night}°C</p>
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
    }
    

    // Update side-popup classes
    function updateSidePopupClasses(name) {
        planetSidePopup.className = `planet-sidepopup planet-${name}-side`;
        planetSidePopupTwo.className = `planet-sidepopup-two planet-${name}-side`;
        planetSidePopupThree.className = `planet-sidepopup-three planet-${name}-side`;
    }

    // Add event listeners for celestial body interactions
    planets.forEach(planet => {
        planet.addEventListener('click', function () {
            const className = planet.classList[1].split('-')[1]; 
            const apiName = planetNameMap[className];
            if (apiName) {
                updateSidePopupClasses(className);
                fetchCelestialData(apiName);
                popup.style.display = 'flex';
            }
        });
    });

    sun.addEventListener('click', function () {
        updateSidePopupClasses('sun');
        fetchCelestialData(planetNameMap['sun']);
        popup.style.display = 'flex';
    });

    closeButton.addEventListener('click', function () {
        popup.style.display = 'none';
    });
});
