import { Notify } from 'notiflix';

import {
  renderGallery,
  smoothScroll,
  clearSearch,
  loading,
  loadMoreBtnHide,
  loadMoreBtnShow,
} from './ui';
import { PER_PAGE, getPictures } from './api';

import refs from './refs';
import './css/styles.css';

loadMoreBtnHide();

let currentPage = 1;
let searchQuery = '';

refs.formRef.addEventListener('submit', onSubmit);
refs.loadMoreBtnRef.addEventListener('click', onLoadMore);

async function onSubmit(e) {
  e.preventDefault();
  resetPage();
  clearSearch();
  loadMoreBtnHide();

  window.addEventListener('scroll', onScroll);

  searchQuery = e.currentTarget.elements.searchQuery.value.trim().toLowerCase();

  if (searchQuery === '') {
    return Notify.info('U should enter picture name to search first!');
  }

  loading();

  try {
    const { hits, totalHits } = await getPictures(searchQuery, currentPage);

    if (hits.length === 0) {
      loading();
      return Notify.failure('There is nothing found :(');
    }
    Notify.success(`We found ${totalHits} ${searchQuery}s for you!`);

    renderGallery(hits);
    loading();

    if (Math.round(totalHits / Number(PER_PAGE)) > currentPage) {
      loadMoreBtnShow();
    }
  } catch (error) {
    loading();
    Notify.warning(`OOPS! ${error.message}`);
  }
}

async function onLoadMore() {
  incrementPage();
  loading();

  try {
    const { hits, totalHits } = await getPictures(searchQuery, currentPage);

    if (Math.round(totalHits / Number(PER_PAGE)) < currentPage) {
      loadMoreBtnHide();
      window.removeEventListener('scroll', onScroll);

      Notify.info("We're sorry, but you've reached the end of search results.");
    }

    renderGallery(hits);
    loading();
    smoothScroll();
  } catch {
    loading();
    Notify.warning(`OOPS! ${error.message}`);
  }
}

function onScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    onLoadMore();
  }
}

function resetPage() {
  currentPage = 1;
}

function incrementPage() {
  currentPage += 1;
}
