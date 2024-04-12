import axios from "axios";
import { toast } from "react-toastify";

let store;

export const injectStore = (_store) => {
  store = _store;
};

axios.interceptors.request.use((config) => {
  config.baseURL = 'http://localhost:4751/'
  config.headers.accessToken = 'Bearer '+store.getState().user.accessToken;
  config.headers.refreshToken = 'Bearer '+store.getState().user.refreshToken;
  console.log(config.headers);
  return config;
});

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  console.log(error);

  if (expectedError && error.response.data?.message) {
    toast.error(error.response.data?.message);
    if (error.response.status === 401) {
      store.dispatch({ type: "LOGOUT" });
    }
  } else {
    toast.error("An unexpected error occured!");
  }

  return Promise.reject(error);
});

export default {
  get: axios.get,
  put: axios.put,
  post: axios.post,
  delete: axios.delete,
};
