import axios from 'axios';

const BASE_URL = 'https://bingo-game-by-nahom-a5271bb57d5f.herokuapp.com/';

const api = axios.create({ baseURL: BASE_URL });

export default api;
