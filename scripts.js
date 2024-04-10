document.addEventListener('DOMContentLoaded', () => {
    fetchAllData()
})

let restaurants = []
let categories = new Set()

function fetchAllData() {
    const jsonFilePath = 'la_businesses2.json'

    fetch(jsonFilePath)
        .then((res) => res.json())
        .then((data) => {
            restaurants = data
            data.forEach((restaurant) => {
                if (restaurant.categories) {
                    const restaurantCategories =
                        restaurant.categories.split(',')
                    categories.add(...restaurantCategories)
                }
            })
            console.log(categories)
        })
        .catch((error) => {
            console.error('Error loading data:', error)
        })
}

function fetchRestaurants() {
    const city = document.getElementById('city-input')?.value.toLowerCase()
    const state = document.getElementById('state-input')?.value.toLowerCase()
    const zipCode = document
        .getElementById('zip-code-input')
        ?.value.toLowerCase()
    const sortDirection = document
        .getElementById('sort-direction')
        ?.value.toLowerCase()
    const sortCategory = document
        .getElementById('sort-category')
        ?.value.toLowerCase()

    console.log(
        `city: ${city}, state: ${state}, zipCode: ${zipCode} sortDirection: ${sortDirection} sortCategory: ${sortCategory}`
    )

    let filteredRestaurants = []
    for (let i = 0; i < restaurants.length; i++) {
        let valid = true
        if (city !== '' && restaurants[i]?.city.toLowerCase() != city) {
            valid = false
        }

        if (state !== '' && restaurants[i].state.toLowerCase() != state) {
            valid = false
        }

        if (zipCode !== '' && restaurants[i].zipCode != zipCode) {
            valid = false
        }

        if (valid) {
            filteredRestaurants.push(restaurants[i])
        }
    }

    let sortedArr = []
    if (sortDirection === 'asc') {
        filteredRestaurants.sort((a, b) => {
            return a[sortCategory] - b[sortCategory]
        })
    } else {
        filteredRestaurants.sort((a, b) => {
            return b[sortCategory] - a[sortCategory]
        })
    }

    console.log(filteredRestaurants)
    displayRestaurants(filteredRestaurants)
}

function displayRestaurants(filteredRestaurants) {
    const cardContainer = document.getElementById('card-container')
    cardContainer.innerHTML = ''

    filteredRestaurants.forEach((restaurant) => {
        const card = document.createElement('div')
        card.className = 'card'

        let starsHTML = ''
        for (let i = 0; i < 5; i++) {
            if (i < restaurant.stars) {
                starsHTML += '<span class="star filled">&#9733;</span>' 
            } else {
                starsHTML += '<span class="star">&#9734;</span>' 
            }
        }

        card.innerHTML = `
              <div class="card-content">
                  <h2>${restaurant.name}</h2>
                  <div class="stars">${starsHTML}</div>
                  <p class="review-count">${restaurant.review_count} Reviews</p>
                  <p>Address: ${restaurant.address}, ${restaurant.city}, ${restaurant.state}, ${restaurant.postal_code}, ${restaurant.review_count} Reviews</p>
              </div>
          `
        cardContainer.appendChild(card)
    })
}
document
    .getElementById('search-button')
    .addEventListener('click', fetchRestaurants)
