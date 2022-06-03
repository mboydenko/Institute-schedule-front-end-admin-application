import axios from 'axios'

export default axios.create({
    baseUrl:process.env.baseUrl
})