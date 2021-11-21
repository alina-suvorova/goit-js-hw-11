import '/./css/main.css';
import { searchImages } from './pixabay';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('[id="search-form"]');
const searchInput = document.querySelector('[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');

let page = 1;
let perPage = 40;

  function galleryMarkup (images){
    const markup = images.map((image => {
        return `
        <div class="photo-card">
        <a href="${image.largeImageURL}">
        <img class="gallery_image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="about">
          <p class="about-item">
            <b>Likes</b><span>${image.likes}</span>
          </p>
          <p class="about-item">
            <b>Views</b><span>${image.views}</span>
          </p>
          <p class="about-item">
            <b>Comments</b><span>${image.comments}</span>
          </p>
          <p class="about-item">
            <b>Downloads</b><span>${image.downloads}</span>
          </p>
        </div>
        </div>`})).join('');
    gallery.insertAdjacentHTML('beforeend', markup);  
    const lightbox = new SimpleLightbox('.gallery a', {captionDelay: 250, captionsData: 'alt'});
    lightbox.refresh();
  }

  function onSearchForm (event){
    event.preventDefault();
    fetch(`https://pixabay.com/api/?key=24421927-3704d5d5ee001c08661d65ce4&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`)
    .then(() => {
      fetchImages();
      gallery.innerHTML = '';
      loadMoreBtn.classList.add('is-hidden');
    });
  }

  function onLoadMoreBtn (){
      page += 1;
      fetch(`https://pixabay.com/api/?key=24421927-3704d5d5ee001c08661d65ce4&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`)
      .then(() => {
        fetchImages();
      });
  }

  function fetchImages (){
    const searchQuery = searchInput.value.trim();
    console.log(searchQuery);
        searchImages(searchQuery, page, perPage).then(({ data }) => {
            console.log(data.hits);
            console.log(data.hits.length);
            galleryMarkup(data.hits);

            if (data.hits.length !== 0) {
                Notify.success(`Hooray! We found ${data.totalHits} images.`);
                loadMoreBtn.classList.remove('is-hidden');
            } else if (data.hits.length === 0) {
                loadMoreBtn.classList.add('is-hidden');
                Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
            } else if (data.hits.length < 40 && data.hits.length !==0 ) {
                Notify.failure(`We're sorry, but you've reached the end of search results.`);
                loadMoreBtn.classList.add('is-hidden');
            }
        })
  }
    
searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener("click", onLoadMoreBtn);