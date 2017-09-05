import {MODE_LIST} from '../types'
import Coordinates from './Coordinates'

function escapeLinebreak (str) {
    return str.replace(LINEBREAK_RE, LINEBREAK)
}
const LINEBREAK_RE = /\\n/g
const LINEBREAK = '\n'

const SPECIAL_SEPARATOR_RE = /\$[&0-9]/g

export default class Regexp {
    constructor (params) {
        this.coordinates = new Coordinates(params)
        this._lastParams = null
        this._lastExec = null
    }

    resize (params) {
        this.coordinates.resize(params)
    }

    parse (params) {
        const result = {
            matches: [],
            output: '',
            error: null,
        }
        let {source, flags} = params
        if (!source) return result
        let regexp = null
        try {
            regexp = new RegExp(source, flags)
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.warn(error)
            }
            result.error = error.message
            return result
        }
        if (!regexp) return result
        let {input} = params
        if (!input) return result
        const {mode} = params
        if (!mode) {
            const {matches} = this._exec(regexp, input)
            result.matches = matches
            return result
        }
        const resolve = escapeLinebreak(params.resolve || '')
        if (mode === MODE_LIST) {
            const m = resolve.match(SPECIAL_SEPARATOR_RE)
            if (!m || m.length < 1) {
                // list with join
                const {matches, output} = this._execAndJoinList(regexp, input, resolve)
                result.matches = matches
                result.output = output
                return result
            }
            const resolvers = []
            for (let i = 0, l = m.length, o, p, q; i < l; i++) {
                o = m[i]
                p = o.substr(1, 1)
                q = p === '&' ? 0 : Number(p)
                resolvers[q] = o
            }
            // list with replace
            const {matches, output} = this._execAndReplaceList(regexp, input, resolve, resolvers)
            result.matches = matches
            result.output = output
            return result
        } else {
            // replace
            const {matches, output} = this._execAndReplace(regexp, input, resolve)
            result.matches = matches
            result.output = output
            return result
        }
    }

    _exec (regexp, input) {
        this.coordinates.hold(input)
        const matches = []
        if (regexp.global) {
            let match, point, value
            while (true) {
                match = regexp.exec(input)
                value = match && match[0]
                if (!value) break
                point = this.coordinates.compute(match.index, value.length)
                matches.push(
                    Object.assign({
                        value,
                        subs: match.slice(1),
                    }, point)
                )
            }
        } else {
            const match = regexp.exec(input)
            const value = match && match[0]
            if (value) {
                const point = this.coordinates.compute(match.index, value.length)
                matches.push(
                    Object.assign({
                        value,
                        subs: match.slice(1),
                    }, point)
                )
            }
        }
        return {matches}
    }

    _execAndJoinList (regexp, input, resolve) {
        this.coordinates.hold(input)
        const matches = []
        let output = ''
        let match, point, value
        while (true) {
            match = regexp.exec(input)
            value = match && match[0]
            if (!value) break
            point = this.coordinates.compute(match.index, value.length)
            matches.push(
                Object.assign({
                    value,
                    subs: match.slice(1),
                }, point)
            )
            output += value + resolve
        }
        return {matches, output}
    }

    _execAndReplaceList (regexp, input, resolve, resolvers) {
        this.coordinates.hold(input)
        const matches = []
        let output = ''
        let match, point, value, _output
        while (true) {
            match = regexp.exec(input)
            if (!match || !match[0]) break
            value = match[0]
            point = this.coordinates.compute(match.index, value.length)
            matches.push(
                Object.assign({
                    value,
                    subs: match.slice(1),
                }, point)
            )
            _output = resolve
            resolvers.forEach((resolver, index) => {
                if (match[index] !== undefined) {
                    _output = _output.replace(resolver, match[index])
                }
            })
            output += _output
        }
        return {matches, output}
    }

    _execAndReplace (regexp, input, resolve) {
        this.coordinates.hold(input)
        const matches = []
        let match, point, value
        while (true) {
            match = regexp.exec(input)
            value = match && match[0]
            if (!value) break
            point = this.coordinates.compute(match.index, value.length)
            matches.push(
                Object.assign({
                    value,
                    subs: match.slice(1),
                }, point)
            )
        }
        const output = input.replace(regexp, resolve)
        return {matches, output}
    }
}
