import axios from 'axios'

const API_ENDPOINT = 'http://localhost:4000/api'
const API_KEY = 's3cr3t'

class Api {
  constructor (app) {
    this.request = axios.create({
      baseURL: API_ENDPOINT,
      headers: { 'Api-Key': API_KEY }
    })
  }

  getTopics (setIsLoading, setError, setTopics) {
    setIsLoading(true)
    this.request.get('topics')
      .then(result => {
        window.INITIAL_DATA.topics = result.data.data
        setTopics(result.data.data)
        setIsLoading(false)
      })
      .catch(error => {
        if (typeof error.response !== 'undefined') {
          setError(error.response.data.error)
        }
        setIsLoading(false)
      })
  }

  getTopic (setIsLoading, setError, setTopic, topicId) {
    setIsLoading(true)
    this.request.get(`topics/${topicId}`)
      .then(result => {
        window.INITIAL_DATA.topic = result.data.data
        setTopic(result.data.data)
        setIsLoading(false)
      })
      .catch(error => {
        if (typeof error.response !== 'undefined') {
          setError(error.response.data.error)
        }
        setIsLoading(false)
      })
  }

  postSignup (setOnSubmitting, setError, setMessage, values) {
    setOnSubmitting(true)
    this.request.post('signup', values)
      .then(result => {
        setMessage(result.data.data)
        setOnSubmitting(false)
      })
      .catch(error => {
        if (typeof error.response !== 'undefined') {
          setError(error.response.data.error)
        }
        setOnSubmitting(false)
      })
  }
}

export default Api
