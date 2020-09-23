import Api from './Api'
import aboutImg from './about.png'
import './App.css'
import React, { useState, useEffect, useRef } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  useParams
} from 'react-router-dom'

const api = new Api()
window.INITIAL_DATA = isObjectEmpty(window.INITIAL_DATA) ? {} : window.INITIAL_DATA

function isObjectEmpty (obj) {
  return (typeof obj === 'undefined') || (Object.keys(obj).length === 0)
}

function App () {
  return (
    <HelmetProvider>
      <Router>
        <div>
          <ul className='header'>
            <li>
              <NavLink to='/' activeClassName='active' exact>Home</NavLink>
            </li>
            <li>
              <NavLink to='/about' activeClassName='active'>About</NavLink>
            </li>
            <li>
              <NavLink to='/signup' activeClassName='active'>Sign Up</NavLink>
            </li>
          </ul>
          <hr />
          <div className='container'>
            <Switch>
              <Route path='/signup'>
                <SignUp />
              </Route>
              <Route path='/about'>
                <About />
              </Route>
              <Route path='/topics/:topicId'>
                <Topics />
              </Route>
              <Route path='/'>
                <Home />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </HelmetProvider>
  )
}

function Loading () {
  return (
    <div className='spinner'>
      <div className='rect1' />
      <div className='rect2' />
      <div className='rect3' />
      <div className='rect4' />
      <div className='rect5' />
    </div>
  )
}

function Error ({ error }) {
  return (
    <div id='error'><pre>{error}</pre></div>
  )
}

function SignUp () {
  const initialValues = { email: '', password: '' }
  const [error, setError] = useState()
  const [message, setMessage] = useState()
  const [values, setValues] = useState(initialValues)
  const [onSubmitting, setOnSubmitting] = useState(false)
  const formRendered = useRef(false) // Using useRef And now the same retuned object for the full lifetime of the component

  useEffect(() => {
    if (!formRendered.current) {
      setValues(initialValues)
      setError('')
      setMessage('')
      setOnSubmitting(false)
      formRendered.current = true
    }
  }, [initialValues])

  const handleChange = (event) => {
    const { target } = event
    const { name, value } = target
    event.persist()
    setValues({ ...values, [name]: value })
  }

  const handleSubmit = (event) => {
    if (event) event.preventDefault()
    if (onSubmitting) return
    formRendered.current = false
    api.postSignup(setOnSubmitting, setError, setMessage, values)
  }

  return (
    <div id='signup'>
      <Helmet>
        <title>Sign Up</title>
        <meta name='description' content='Sign Up' />
      </Helmet>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <h3>Fill your account information</h3>
        {error && <div className='error'>{error}</div>}
        {message && <div className='message'>{message}</div>}
        <label>Email</label>
        <input type='text' name='email' onChange={handleChange} value={values.email} />
        <br />
        <label>Password</label>
        <input type='password' name='password' autoComplete='on' onChange={handleChange} value={values.password} />
        <br />
        <button type='submit'>Sign Up</button>
      </form>
    </div>
  )
}

function About () {
  return (
    <div id='about'>
      <Helmet>
        <title>About</title>
        <meta name='description' content='About' />
      </Helmet>
      <h2>About</h2>
      <p>In this guide, we will examine the building blocks of React apps.</p>
      <p><img src={aboutImg} alt='About' className='responsive' /></p>
    </div>
  )
}

function Home () {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [topics, setTopics] = useState([])

  useEffect(() => {
    if (!isObjectEmpty(window.INITIAL_DATA.topics)) return setTopics(window.INITIAL_DATA.topics)
    api.getTopics(setIsLoading, setError, setTopics)
  }, [])

  const TopicList = ({ topics, topicsRef }) => {
    if (topics.length === 0) return (<p id='empty-topics'>Topics is empty</p>)
    return (
      <ul id='topics'>
        {topics.map((topic) =>
          <li key={topic.id}>
            <Link to={`/topics/${topic.id}`}>{topic.title}</Link>
          </li>
        )}
      </ul>
    )
  }

  return (
    <div>
      <Helmet>
        <title>Home</title>
        <meta name='description' content='Hot News' />
      </Helmet>
      <h2>Hot Topics</h2>
      {error ? <Error error={error} /> : <div suppressHydrationWarning>{isLoading ? <Loading /> : <TopicList topics={topics} />}</div>}
    </div>
  )
}

function Topics () {
  const { topicId } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [topic, setTopic] = useState([])

  useEffect(() => {
    if (!isObjectEmpty(window.INITIAL_DATA.topic) && (window.INITIAL_DATA.topic.id === +topicId)) return setTopic(window.INITIAL_DATA.topic)
    api.getTopic(setIsLoading, setError, setTopic, topicId)
  }, [topicId])

  const TopicDetail = ({ topic }) => {
    return (
      <div id='topic'>
        <h3 suppressHydrationWarning>{topic.title}</h3>
        <p suppressHydrationWarning>{topic.created_at}</p>
        <p suppressHydrationWarning>{topic.content}</p>
      </div>
    )
  }

  return (
    <div>
      <Helmet>
        <title>{`Topics: ${topic.title}`}</title>
        <meta name='description' content={`Hot Topics - ${topic.title}`} />
      </Helmet>
      <h2>Topic</h2>
      {error ? <Error error={error} /> : <div>{isLoading ? <Loading /> : <TopicDetail topic={topic} />}</div>}
    </div>
  )
}

export default App
