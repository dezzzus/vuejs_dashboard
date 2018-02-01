import axios from 'axios'

export default axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {token}'
  }
})
