import axios from 'axios';

const KEY = '24421927-3704d5d5ee001c08661d65ce4';
const BASE_URL = 'https://pixabay.com/api';

export async function searchImages(userRequest, page, perPage) {
    return await axios.get(`${BASE_URL}/?key=${KEY}&q=${userRequest}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`,);
}