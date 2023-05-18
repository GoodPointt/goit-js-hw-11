import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

import refs from './refs';
import './css/styles.css';

const BASE_URL = 'https://pixabay.com/api/';

const API_KEY = '36517791-fe7b9367de166f0848dfc6a7d';
const q = 'cat';

async function getPictures(query) {
  const response = await fetch(
    `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safe_search=true&page=1&per_page=40`
  );
  const pictures = await response.json();
  return pictures;
}

refs.formRef.addEventListener('submit', onSubmit);
refs.loadMoreBtnRef.addEventListener('click', onLoadMore);

async function onSubmit(e) {
  e.preventDefault();
  clearSearch();
  const searchQuery = e.currentTarget.elements.searchQuery.value
    .trim()
    .toLowerCase();
  if (searchQuery === '')
    return Notify.info('U should enter picture name to search first!');
  loading();
  const picsToRender = await getPictures(searchQuery);
  loading();
  picsArr = picsToRender.hits;
  if (picsArr.length === 0) return Notify.failure('There is nothing found :(');
  renderPictures(picsArr);
}

async function onLoadMore() {}

function renderPictures(arr) {
  if (!arr) return;

  return arr.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      refs.galleryRef.insertAdjacentHTML(
        'beforeend',
        `<div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300"/>
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
    </div>`
      );
    }
  );
}

function clearSearch() {
  refs.galleryRef.innerHTML = '';
}

function loading() {
  refs.loadingImgRef.classList.toggle('is-hidden');
}
