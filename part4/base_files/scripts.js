document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.querySelector('input[name="email"]').value;
      const password = document.querySelector('input[name="password"]').value;

      try {
        const response = await fetch(
          'http://localhost:5000/api/v1/auth/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const jwtToken = data.access_token;
          const expires = new Date(Date.now() + 3600 * 1000).toUTCString();
          document.cookie = `token=${jwtToken}; expires=${expires}; path=/; Secure; SameSite=Strict`;

          window.location.href = 'index.html';
        } else {
          displayError(`Email or password incorrect. Please try again.`);
        }
      } catch (error) {
        displayError('An error occurred while connecting to the server.');
        console.error(error);
      }
    });
  }
});

function displayError(message) {
  const errorMessage = document.getElementById('error-message');
  if (errorMessage) {
    errorMessage.textContent = message;
  }
}

function checkAuthentication() {
  const token = getCookie('token');
  const login_link = document.getElementById('login-link');
  if (!token) {
    login_link.style.display = 'block';
  } else {
    login_link.style.display = 'none';
    fetchPlaces(token);
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
async function fetchPlaces(token) {
  const url = 'http://localhost:5000/api/v1/places/';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`HTTP Error : ${response.status}`);
    }
    const places = await response.json();
    console.log(places);
    displayPlaces(places);
  } catch (error) {
    console.error('Error when recovering places :', error.message);
  }
}

function displayPlaces(places) {
  const placesList = document.getElementById('places-list');
  if (!placesList) return;

  // Réinitialise le contenu du conteneur
  placesList.innerHTML = '';

  // Parcourt les lieux et ajoute chaque élément au DOM
  places.forEach((place) => {
    // Crée un conteneur pour le lieu
    const placeElement = document.createElement('div');
    placeElement.className = 'place-item';
    placeElement.dataset.price = place.price;

    // Ajoute le contenu HTML du lieu
    placeElement.innerHTML = `
      <h2>${place.title}</h2>
      <p>Description: ${place.description}</p>
      <p>Latitude: ${place.latitude}</p>
      <p>Longitude: ${place.longitude}</p>
      <p>Price per night: $${place.price}</p>
    `;

    // Crée dynamiquement le bouton "View Details"
    const viewDetailsButton = document.createElement('button');
    viewDetailsButton.textContent = 'View Details';
    viewDetailsButton.className = 'view-details-button';

    // Ajoute un gestionnaire d'événement au bouton
    viewDetailsButton.addEventListener('click', () => {
      window.location.href = `place.html?id=${place.id}`; // Redirige vers la page des détails avec l'ID dans l'URL
    });

    // Ajoute le bouton au conteneur de la place
    placeElement.appendChild(viewDetailsButton);

    // Ajoute la place au conteneur principal
    placesList.appendChild(placeElement);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const priceFilter = document.getElementById('price-filter');
  if (priceFilter) {
    priceFilter.innerHTML = '';
    const options = [
      { value: '10', text: '$10' },
      { value: '50', text: '$50' },
      { value: '100', text: '$100' },
      { value: 'all', text: 'All' },
    ];

    options.forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      priceFilter.appendChild(optionElement);
    });
    priceFilter.value = 'all';
    priceFilter.addEventListener('change', handlePriceFilter);
  }
});

function handlePriceFilter(event) {
  const selectedPrice = event.target.value;
  const placesList = document.querySelectorAll('.place-item');

  placesList.forEach((place) => {
    const placePrice = parseInt(place.dataset.price, 10);

    if (selectedPrice === 'all' || placePrice <= parseInt(selectedPrice, 10)) {
      place.style.display = 'block';
    } else {
      place.style.display = 'none';
    }
  });
}
function getPlaceIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}
async function fetchPlaceDetails(token, placeId) {
  try {
    const url = `http://localhost:5000/api/v1/places/${placeId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const placeDetails = await response.json();
    console.log('Place Details:', placeDetails);
    return placeDetails;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}

// Nouveau code pour afficher les détails d'une place
document.addEventListener('DOMContentLoaded', async () => {
  // Vérifier si nous sommes sur la page de détails d'une place
  if (window.location.pathname.includes('place.html')) {
    checkAuthentication(); // Vérifier l'authentification pour gérer le lien de connexion
    
    const placeId = getPlaceIdFromURL();
    const token = getCookie('token');
    
    if (placeId && token) {
      const placeDetails = await fetchPlaceDetails(token, placeId);
      if (placeDetails) {
        displayPlaceDetails(placeDetails);
      } else {
        displayError("Impossible de charger les détails de la place.");
      }
    } else {
      displayError("Place non trouvée ou non authentifié");
    }
  }
});

function displayPlaceDetails(place) {
  const placeDetailsContainer = document.getElementById('place-details');
  if (!placeDetailsContainer) return;
  
  console.log("Displaying place details:", place);
  
  // Créer le contenu HTML pour afficher les détails de la place
  const placeDetailsHTML = `
    <h1>${place.title}</h1>
    <div class="place-details-container">
      <div class="place-info">
        <p><strong>Description:</strong> ${place.description}</p>
        <p><strong>Prix par nuit:</strong> $${place.price}</p>
        <p><strong>Emplacement:</strong> Latitude ${place.latitude}, Longitude ${place.longitude}</p>
      </div>
      <div class="place-owner">
        <p><strong>Propriétaire:</strong> ${place.owner ? `${place.owner.first_name} ${place.owner.last_name}` : 'Non spécifié'}</p>
      </div>
    </div>
  `;
  
  // Insérer le HTML dans le conteneur
  placeDetailsContainer.innerHTML = placeDetailsHTML;
  
  // Afficher un message de débogage dans la console
  console.log("Place details content added to DOM");
}

// Ajouter une fonction de débogage pour voir les erreurs potentielles
window.addEventListener('error', function(e) {
  console.error('JavaScript error:', e.message, 'at', e.filename, 'line', e.lineno);
});
