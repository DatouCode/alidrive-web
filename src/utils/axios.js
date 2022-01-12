import axios from 'axios';

export function get(url, params) {
  return axios.get(url, {params: params})
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err.data;
    })
}

export function post(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(response => {
      resolve(response.data);
    }).catch(err => {
      reject(err);
    });
  });
}