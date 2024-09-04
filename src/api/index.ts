import axios from 'axios'

const env = 'dev'

const apiHost = {
  dev: 'http://localhost:3000'
}[env]

export const api = axios.create({
  baseURL: apiHost
})




export const batchCheckFileIncluded = (path: string) => {

}