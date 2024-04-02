import axios from "axios";
import { toast } from 'react-toastify';

let store

export const injectStore = _store => {
  store = _store
}

// axiosInstance.interceptors.request.use(config => {
//   config.headers.accessToken = store.getState().user.accessToken
//   config.headers.refreshToken = store.getState().user.refreshToken
//   return config
// })

axios.interceptors.response.use(null, error => {
    const expectedError = 
    error.response &&
    error.response >= 400 &&
    error.response < 500;

    if(expectedError){
        toast.error(error.response?.data?.message);
    }
    else{
        toast.error("An unexpected error occured!")
        
    }

    return Promise.reject(error)
})

export default {
    get: axios.get,
    put: axios.put,
    post: axios.post,
    delete: axios.delete
}