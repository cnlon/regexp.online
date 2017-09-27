import {PARSE, ERROR, READY} from '../types'
import parse from './parse'

/* eslint-disable no-undef */
onmessage = function (event) {
    const data = event.data[1]
    const result = parse(data)
    const {error} = result
    if (error) {
        postMessage([ERROR, error])
    } else {
        postMessage([PARSE, result])
    }
}

postMessage([READY])
/* eslint-enable no-undef */
