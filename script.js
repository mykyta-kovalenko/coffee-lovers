// Prevents multiple scrolling triggers during the scroll animation
let isScrolling = false;

// Function to smoothly scroll to the home-page content
function scrollToContent() {
  if (!isScrolling) {
    isScrolling = true;
    const element = document.getElementById('home-page');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Resets the scrolling flag after the animation completes
      setTimeout(() => (isScrolling = false), 1400);
    }
  }
}

// Event listener for the scroll down arrow
document.addEventListener('DOMContentLoaded', () => {
  const arrow = document.getElementsByClassName('scroll-down-arrow')[0];
  if (arrow) {
    arrow.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToContent();
    });
  }

  // Handles scroll events to trigger content scrolling
  window.addEventListener('wheel', (_) => {
    if (!isScrolling) {
      scrollToContent();
    }
  });
});

// Fetches coffee data and updates the DOM with the retrieved information
function fetchCoffeeData(type) {
  const container = document.getElementById(`${type}-coffee-container`);
  container.innerHTML = '<p>Loading coffee data...</p>';

  fetch(`https://api.sampleapis.com/coffee/${type}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      container.innerHTML = '';
      if (data.length === 0) {
        container.innerHTML = `<p>There are no coffee at the moment, the coffee shop is probably closed.</p>`;
      } else {
        displayCoffeeData(data, type);
      }
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
      container.innerHTML = `<p>Unable to fetch coffee data. Please try again later.</p>`;
    });
}

fetchCoffeeData('hot');

// Function to display tab content for each coffee in the list
function displayCoffeeData(coffeeList, type) {
  const container = document.getElementById(`${type}-coffee-container`);

  coffeeList.forEach((coffee) => {
    const coffeeDiv = document.createElement('div');
    coffeeDiv.className = 'coffee';

    const title = document.createElement('h2');
    title.textContent = coffee.title;
    coffeeDiv.appendChild(title);

    const description = document.createElement('p');
    description.textContent = coffee.description;
    coffeeDiv.appendChild(description);

    coffeeDiv.addEventListener('click', () =>
      displayCoffeeDetails(coffee, type)
    );

    container.appendChild(coffeeDiv);
  });
}

// Function to display detailed information for a selected coffee item
function displayCoffeeDetails(coffee, type) {
  const container = document.getElementById(`${type}-coffee-container`);
  container.innerHTML = '';
  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'coffee-details';
  detailsDiv.innerHTML = `
    <button class="back-button" onclick="fetchCoffeeData('${type}')">
      <img src="assets/icons/angle-left-solid.svg" alt="Back">
    </button>
    <h1>${coffee.title}</h1>
    <div id="image-container">
      <p id="loading-text">Loading image...</p>
      <img src="${coffee.image}" alt="${
    coffee.title
  }" class="coffee-image" style="display: none;">
    </div>
    <h2>Description</h2><p>${coffee.description}</p>
    <h2>Ingredients</h2>
    <ul class="coffee-ingredients">${coffee.ingredients
      .map((ingredient) => `<li>${ingredient}</li>`)
      .join('')}</ul>
  `;
  container.appendChild(detailsDiv);

  const image = container.querySelector('.coffee-image');
  const loadingText = document.getElementById('loading-text');

  image.onload = () => {
    image.style.display = 'block';
    loadingText.style.display = 'none';
  };

  image.onerror = () => {
    loadingText.textContent = 'Failed to load image.';
  };
}

// Function to handle tab switching and content updating
function openCoffeeType(e, coffeeType) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName('tabcontent');
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }

  tablinks = document.getElementsByClassName('tablinks');
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }

  document.getElementById(coffeeType).style.display = 'block';
  e.currentTarget.className += ' active';

  fetchCoffeeData(coffeeType.toLowerCase());
}
