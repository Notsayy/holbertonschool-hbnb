function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function getPlaceIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

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

function displayPlaces(places) {
  const placesList = document.getElementById('places-list');
  if (!placesList) return;

  placesList.innerHTML = '';

  places.forEach((place, index) => {
    const placeElement = document.createElement('div');
    placeElement.className = 'place-item';
    placeElement.dataset.price = place.price;

    const placeImage = document.createElement('img');
    if (index === 0) {
      placeImage.src = '/images/moder_loft_london.jpg';
    } else if (index === 1) {
      placeImage.src = '/images/Beachfront_Bungalow_in_Bali.jpg';
    } else {
      placeImage.src = '/images/Luxury_Penthouse_in_Dubai.jpg';
    }
    placeImage.alt = `${place.title} Image`;
    placeImage.className = 'place-image';

    placeElement.appendChild(placeImage);

    placeElement.innerHTML += `
      <h2>${place.title}</h2>
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
              <p><strong>Latitude:</strong> ${place.latitude}</p>
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
      <h1>Reviews</h1>
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

function displayReviews(reviews) {
  const reviewsContainer = document.getElementById('reviews-list');
  if (!reviewsContainer) return;

  reviewsContainer.innerHTML = '';

  if (!reviews || reviews.length === 0) {
    reviewsContainer.innerHTML = '<p>No reviews available.</p>';
    return;
  }

  reviews.forEach((review) => {
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review-item';
    reviewElement.innerHTML = `
          <p><strong>Host:</strong> test user<p>
          <p><strong>Rating:</strong> ${review.rating}/5</p>
          <p><strong>Text:</strong> ${review.text}</p>
      `;
    reviewsContainer.appendChild(reviewElement);
  });
}

function displayReviewError(message) {
  const reviewsContainer = document.getElementById('reviews-list');
  if (reviewsContainer) {
    reviewsContainer.innerHTML = `<p class="error-message">${message}</p>`;
  } else {
    console.error('Reviews container not found.');
  }
}

function displaySuccessMessage(message) {
  const addReviewSection = document.getElementById('add-review');
  if (addReviewSection) {
    addReviewSection.innerHTML = `<p class="success-message">${message}</p>`;
  } else {
    console.error('Add review section not found.');
  }
}

function displayAddReviewError(message) {
  const addReviewSection = document.getElementById('add-review');
  if (addReviewSection) {
    addReviewSection.innerHTML = `<p class="error-message">${message}</p>`;
  } else {
    console.error('Add review section not found.');
  }
}

function displayAddReviewForm() {
  const token = getCookie('token');
  const addReviewSection = document.getElementById('add-review');

  if (token) {
    const formHTML = `
          <h3>Add a Review</h3>
          <form id="review-form">
              <textarea name="text" placeholder="Write your review..." required></textarea><br>
              <label for="rating">Rating:</label>
              <select name="rating" id="rating" required>
                  <option value="5">5/5</option>
                  <option value="4">4/5</option>
                  <option value="3">3/5</option>
                  <option value="2">2/5</option>
                  <option value="1">1/5</option>
              </select><br>
              <button type="submit">Submit Review</button>
          </form>
      `;
    addReviewSection.innerHTML = formHTML;

    document
      .getElementById('review-form')
      .addEventListener('submit', async (event) => {
        event.preventDefault();

        const placeId = getPlaceIdFromURL();
        const text = event.target.text.value;
        const rating = event.target.rating.value;

        try {
          const response = await fetch(
            `http://localhost:5000/api/v1/places/${placeId}/reviews/`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ text, rating }),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
          }

          displaySuccessMessage('Review submitted successfully!');
          location.reload();
        } catch (error) {
          console.error('Error submitting review:', error);
          displayAddReviewError(
            'Failed to submit the review. Please try again.'
          );
        }
      });
  } else {
    addReviewSection.innerHTML =
      '<p>You must be logged in to add a review.</p>';
  }
}

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

  if (window.location.pathname.includes('place.html')) {
    const placeId = getPlaceIdFromURL();
    const token = getCookie('token');

    if (placeId && token) {
      fetchPlaceDetails(token, placeId).then((placeDetails) => {
        if (placeDetails) {
          displayPlaceDetails(placeDetails);
          displayAddReviewForm();
        } else {
          displayError('Failed to load place details.');
        }
      });
    } else {
      displayError('Place not found or not authenticated.');
    }
  }
});

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
