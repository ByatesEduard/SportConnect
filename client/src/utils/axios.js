import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3001/api',
  validateStatus: () => true,
})

let getToken = () => null

export const setAxiosTokenGetter = (fn) => {
  getToken = fn
}

instance.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

export default instance
