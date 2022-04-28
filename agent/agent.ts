import axios, { AxiosResponse } from 'axios';
import { PaginatedResult } from '../models/paginated-result';
import { SongType } from '../models/song';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

axios.defaults.baseURL = baseUrl! + '/api';

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body = {}) => axios.post(url, body).then(responseBody),
};

const Songs = {
  list: (query: string, page = 1): Promise<PaginatedResult<SongType[]>> =>
    requests.get(encodeURI(`/search?query=${query}&page=${page}`)),
  stream: (link: string, name: string) =>
    requests.post(`/stream`, { url: link, name }),
  getMainTracks: (): Promise<PaginatedResult<SongType[]>> =>
    requests.get('/search/main'),
};

const agent = {
  Songs,
};

export default agent;
