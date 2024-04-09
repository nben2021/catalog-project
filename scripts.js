let currentIndex = 0;
let sortedRestaurants = [];

function fetchRestaurants() {
    const city = document.getElementById("city-input").value;
    const state = document.getElementById("state-input").value;
    const country = document.getElementById("country-input").value;
    const zipCode = document.getElementById("zip-code-input").value;
    let locationQuery = `${city}${state ? ', ' + state : ''}${zipCode ? ', ' + zipCode : ''}, ${country}`;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': locationQuery }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            const location = results[0].geometry.location;
            const service = new google.maps.places.PlacesService(document.createElement('div'));
            const request = {
                location: location,
                radius: '80000',
                type: 'restaurant',
                keyword: 'food'
            };

            service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    const popularFoodPlaces = results.filter(place => place.rating > 4 && place.user_ratings_total > 500);
                    sortedRestaurants = popularFoodPlaces.sort((a, b) => b.user_ratings_total - a.user_ratings_total || b.rating - a.rating);
                    currentIndex = 0;
                    displayRestaurants();
                } else {
                    console.error('Google Places API error:', status);
                }
            });
        } else {
            console.error('Geocoder error:', status);
        }
    });
}

function displayRestaurants() {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";

    const startIndex = currentIndex * 4;
    const endIndex = Math.min(startIndex + 4, sortedRestaurants.length);

    for (let i = startIndex; i < endIndex; i++) {
        const restaurant = sortedRestaurants[i];
        const photoUrl = restaurant.photos && restaurant.photos.length > 0 ? restaurant.photos[0].getUrl() : 'default-image-url.jpg';

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="card-content">
                <h2>${restaurant.name}</h2>
                <img src="${photoUrl}" alt="${restaurant.name} Photo">
                <p>Rating: ${restaurant.rating} (${restaurant.user_ratings_total} reviews)</p>
                <button class="view-more-button" onclick="toggleDetails(this)">View More</button>
                <div class="restaurant-details" style="display: none;">
                    <p>Address: ${restaurant.vicinity || 'Address not available'}</p>
                </div>
            </div>
        `;
        cardContainer.appendChild(card);
    }
}

function toggleDetails(button) {
    const details = button.nextElementSibling;
    if (details.style.display === 'none') {
        details.style.display = 'block';
        button.textContent = 'View Less';
    } else {
        details.style.display = 'none';
        button.textContent = 'View More';
    }
}

function previousRestaurant() {
    if (currentIndex > 0) {
        currentIndex--;
        displayRestaurants();
    }
}

function nextRestaurant() {
    const maxIndex = Math.ceil(sortedRestaurants.length / 4) - 1;
    if (currentIndex < maxIndex) {
        currentIndex++;
        displayRestaurants();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const cardContainer = document.getElementById("card-container");
    if (!cardContainer) {
        console.error("Card container not found");
    }
});


