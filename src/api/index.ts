import axios from 'axios'

const env = 'dev'

const apiHost = {
  dev: 'http://localhost:8080'
}[env]

export const api = axios.create({
  baseURL: apiHost
})



