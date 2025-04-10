// Helper function to get a cookie value by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Helper function to extract the place ID from the URL
function getPlaceIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id'); // Changed from 'place_id' to 'id'
}

// Display a general error message in the DOM
function displayError(message) {
  const errorMessage = document.getElementById('error-message');
  if (errorMessage) {
    errorMessage.textContent = message;
  }
}

// Check authentication and redirect if not authenticated
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

// Fetch places from the API
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
    displayError('Error when recovering places. Please try again.');
  }
}

// Display places in the DOM
function displayPlaces(places) {
  const placesList = document.getElementById('places-list');
  if (!placesList) return;

  placesList.innerHTML = '';

  places.forEach((place) => {
    const placeElement = document.createElement('div');
    placeElement.className = 'place-item';
    placeElement.dataset.price = place.price;

    placeElement.innerHTML = `
          <h2>${place.title}</h2>
          <p>Description: ${place.description}</p>
          <p>Latitude: ${place.latitude}</p>
          <p>Longitude: ${place.longitude}</p>
          <p>Price per night: $${place.price}</p>
      `;

    const viewDetailsButton = document.createElement('button');
    viewDetailsButton.textContent = 'View Details';
    viewDetailsButton.className = 'view-details-button';
    viewDetailsButton.addEventListener('click', () => {
      window.location.href = `place.html?id=${place.id}`;
    });

    placeElement.appendChild(viewDetailsButton);
    placesList.appendChild(placeElement);
  });
}

// Handle price filter change event
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

// Fetch details of a specific place from the API
async function fetchPlaceDetails(token, placeId) {
  try {
    const url = `http://localhost:5000/api/v1/places/${placeId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const placeDetails = await response.json();
    console.log('Place Details:', placeDetails);
    return placeDetails;
  } catch (error) {
    console.error('Error fetching place details:', error);
    displayError('Error fetching place details. Please try again.');
    return null;
  }
}

// Fetch reviews for a specific place from the API
async function fetchReviews(token, placeId) {
  try {
    const url = `http://localhost:5000/api/v1/places/${placeId}/reviews/`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const reviews = await response.json();
    console.log('Reviews:', reviews);
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    displayReviewError('Error fetching reviews. Please try again.');
    return null;
  }
}

// Display the details of a specific place in the DOM
async function displayPlaceDetails(place) {
  const placeDetailsContainer = document.getElementById('place-details');
  if (!placeDetailsContainer) return;

  console.log('Displaying place details:', place);

  const placeDetailsHTML = `
      <h1>${place.title}</h1>
      <div class="place-details-container">
          <div class="place-info">
              <p><strong>Description:</strong> ${place.description}</p>
              <p><strong>Price per night:</strong> $${place.price}</p>
              <p><strong>Latitude:</strong> ${place.latitude}<p>
               <p><strong>Longitude:</strong> ${place.longitude}</p>
          </div>
          <div class="place-owner">
              <p><strong>Host:</strong> ${
                place.owner
                  ? `${place.owner.first_name} ${place.owner.last_name}`
                  : 'Not specified'
              }</p>
          </div>
      </div>
      <h2>Reviews</h2>
      <div id="reviews-list">
          <!-- Reviews will be displayed here -->
      </div>
  `;

  placeDetailsContainer.innerHTML = placeDetailsHTML;

  console.log('Place details content added to DOM');

  const token = getCookie('token');
  const reviews = await fetchReviews(token, place.id);
  displayReviews(reviews);
}

// Display reviews in the DOM
function displayReviews(reviews) {
  const reviewsContainer = document.getElementById('reviews-list');
  if (!reviewsContainer) return;

  reviewsContainer.innerHTML = ''; // Efface le contenu précédent

  if (!reviews || reviews.length === 0) {
    reviewsContainer.innerHTML = '<p>No reviews available.</p>';
    return;
  }

  reviews.forEach((review) => {
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review-item';
    reviewElement.innerHTML = `
          <p><strong>Rating:</strong> ${review.rating}/5</p>
          <p><strong>Text:</strong> ${review.text}</p>
      `;
    reviewsContainer.appendChild(reviewElement);
  });
}

// Display an error message for reviews
function displayReviewError(message) {
  const reviewsContainer = document.getElementById('reviews-list');
  if (reviewsContainer) {
    reviewsContainer.innerHTML = `<p class="error-message">${message}</p>`;
  } else {
    console.error('Reviews container not found.');
  }
}

// Event listener for DOMContentLoaded
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

  // Check if we are on place.html
  if (window.location.pathname.includes('place.html')) {
    const placeId = getPlaceIdFromURL();
    const token = getCookie('token');

    if (placeId && token) {
      fetchPlaceDetails(token, placeId).then((placeDetails) => {
        if (placeDetails) {
          displayPlaceDetails(placeDetails);
        } else {
          displayError('Failed to load place details.');
        }
      });
    } else {
      displayError('Place not found or not authenticated.');
    }
  }
});

// Add a debug function to see potential errors
window.addEventListener('error', function (e) {
  console.error(
    'JavaScript error:',
    e.message,
    'at',
    e.filename,
    'line',
    e.lineno
  );
});

// Event listener for price filter (initialized only on index.html)
document.addEventListener('DOMContentLoaded', () => {
  if (!window.location.pathname.includes('place.html')) {
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
  }
});
