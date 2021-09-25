
require('dotenv').config();
const imgContainer = document.getElementById('img-container');
const loader = document.getElementById('loader');


let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let isInitialLoad = true;

// Unsplash API
let key = process.env.API_KEY;
let initialCount = 5;
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${key}&count=${initialCount}`;
function updateAPIURLWithNewCount (picCount) {
  apiUrl = `https://api.unsplash.com/photos/random?client_id=${key}&count=${picCount}`;
}

//Check if all images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
      }
}
//Helper Function to set attributes on DOM elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}
// Create Elelemts for links and photos, add to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  photosArray.forEach((photo) => {
    //Create <a> to link to Unsplash
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank'
    });
    //Create <img> for photo
    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description
    });
    //Event Listener, check when each is finished loading
    img.addEventListener('load', imageLoaded);
    //Put <img> inside <a>, the put both inside img-container
    item.appendChild(img);
    imgContainer.appendChild(item);
  });
}
//Get photos from Unplash Api
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
    if (isInitialLoad) { 
      updateAPIURLWithNewCount(30) 
      isInitialLoad = false 
    } 
  } catch (error){
    //catch error here
  }
}

//Check if scrolling is near the bottom of the page
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1 && ready) {
    getPhotos();
  }
  
})
// On load
getPhotos();