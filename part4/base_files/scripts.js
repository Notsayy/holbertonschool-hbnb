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
  } catch (error) {
    console.error('Error when recovering places :', error.message);
  }
}
fetchPlaces();

function displayPlaces(places) {
  const placesList = document.getElementById('places-list');
  placesList.innerHTML = '';
  places.forEach(place => {
      const placeDiv = document.createElement('div');
      placeDiv.className = 'place';
      placeDiv.innerHTML = `
          <h3>${place.name}</h3>
          <p>${place.description}</p>
          <p><strong>Localisation :</strong> ${place.location}</p>
          <p><strong>Prix :</strong> $${place.price}</p>
      `;
      placesList.appendChild(placeDiv);
  });
}