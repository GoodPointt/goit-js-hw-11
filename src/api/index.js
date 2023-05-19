import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '36517791-fe7b9367de166f0848dfc6a7d';
const PER_PAGE = '40';

async function getPictures(query, page) {
  const { data } = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safe_search=true&page=${page}&per_page=${PER_PAGE}`
  );
  const { hits, totalHits } = data;
  return { hits, totalHits };
}

export { PER_PAGE, getPictures };
