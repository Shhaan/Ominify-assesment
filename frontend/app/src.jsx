import axios from "axios";
const base_url = "http://127.0.0.1:8000/";

const base_api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

export default base_api;
