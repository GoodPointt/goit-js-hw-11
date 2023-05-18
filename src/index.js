import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import refs from './refs';
import './css/styles.css';

const lightbox = new SimpleLightbox('.gallery a');
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '36517791-fe7b9367de166f0848dfc6a7d';
const PER_PAGE = '40';

let currentPage = 1;
let searchQuery = '';

async function getPictures(query, page) {
  const response = await fetch(
    `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safe_search=true&page=${page}&per_page=${PER_PAGE}`
  );
  const pictures = await response.json();
  return pictures;
}

refs.formRef.addEventListener('submit', onSubmit);
refs.loadMoreBtnRef.addEventListener('click', onLoadMore);

refs.loadMoreBtnRef.classList.add('is-hidden');
// refs.loadMoreBtnRef.scrollIntoView({ behavior: 'smooth' });

async function onSubmit(e) {
  e.preventDefault();
  currentPage = 1;
  clearSearch();
  refs.loadMoreBtnRef.classList.add('is-hidden');

  searchQuery = e.currentTarget.elements.searchQuery.value.trim().toLowerCase();

  if (searchQuery === '') {
    return Notify.info('U should enter picture name to search first!');
  }

  loading();

  const picsToRender = await getPictures(searchQuery, currentPage);
  const picsArr = picsToRender.hits;
  const picsMatch = picsToRender.totalHits;

  if (picsArr.length === 0) {
    loading();
    return Notify.failure('There is nothing found :(');
  }
  Notify.success(`We found ${picsMatch} ${searchQuery}s for you!`);

  renderGallery(picsArr);
  loading();

  if (Math.round(picsMatch / Number(PER_PAGE)) > currentPage) {
    refs.loadMoreBtnRef.classList.remove('is-hidden');
  }
}

async function onLoadMore() {
  currentPage += 1;
  loading();
  const picsToRender = await getPictures(searchQuery, currentPage);
  console.log(picsToRender);
  const picsArr = picsToRender.hits;
  const picsMatch = picsToRender.totalHits;
  if (Math.round(picsMatch / Number(PER_PAGE)) < currentPage) {
    refs.loadMoreBtnRef.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  renderGallery(picsArr);
  loading();

  smoothScroll();
}

function renderGallery(arr) {
  if (!arr) return;
  headerHightCalc();
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
    <a class="gallery-link" href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="300"/></a>
      <div class="info">
        <p class="info-item">
          <b>Likes ${likes}</b>
        </p>
        <p class="info-item">
          <b>Views ${views}</b>
        </p>
        <p class="info-item">
          <b>Comments ${comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads ${downloads}</b>
        </p>
      </div>
    </div>`;
      }
    )
    .join('');

  refs.galleryRef.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function clearSearch() {
  refs.galleryRef.innerHTML = '';
}

function loading() {
  refs.loadingImgRef.classList.toggle('is-hidden');
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
/////////////////////////////
function headerHightCalc(params) {
  const { height: pageHeaderHeight } = document
    .querySelector('.wrap')
    .getBoundingClientRect();
  let pageTopPadding = pageHeaderHeight + 10;

  document.body.style.paddingTop = `${pageTopPadding}px`;
}
