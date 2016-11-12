import {PARSE, RESIZE, ERROR, READY} from '../types'
import Regexp from './Regexp'

const regexp = new Regexp({})

/* eslint-disable no-undef */
onmessage = function (event) {
  const [method, data] = event.data
  switch (method) {
    case PARSE:
      const result = regexp.parse(data)
      const {error} = result
      if (error) {
        postMessage([ERROR, error])
      } else {
        postMessage([PARSE, result])
      }
      break
    case RESIZE:
      regexp.resize(data)
      break
  }
}

postMessage([READY])
/* eslint-enable no-undef */
