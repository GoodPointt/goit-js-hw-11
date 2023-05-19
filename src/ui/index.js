import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import refs from '../refs';

const lightbox = new SimpleLightbox('.gallery a');

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

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function headerHightCalc() {
  const { height: pageHeaderHeight } = document
    .querySelector('.wrap')
    .getBoundingClientRect();
  let pageTopPadding = pageHeaderHeight + 10;

  document.body.style.paddingTop = `${pageTopPadding}px`;
}

function clearSearch() {
  refs.galleryRef.innerHTML = '';
}

function loading() {
  refs.loadingImgRef.classList.toggle('is-hidden');
}

function loadMoreBtnHide() {
  refs.loadMoreBtnRef.classList.add('is-hidden');
}

function loadMoreBtnShow() {
  refs.loadMoreBtnRef.classList.remove('is-hidden');
}

export {
  renderGallery,
  smoothScroll,
  clearSearch,
  loading,
  loadMoreBtnHide,
  loadMoreBtnShow,
};
