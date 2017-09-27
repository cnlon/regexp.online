import {MODE_LIST} from '../types'

function escapeLinebreak (str) {
    return str.replace(LINEBREAK_RE, LINEBREAK)
}
const LINEBREAK_RE = /\\n/g
const LINEBREAK = '\n'

const SPECIAL_SEPARATOR_RE = /\$[&0-9]/g

export default function parse (params) {
    const result = {
        matches: [],
        output: '',
        error: null,
    }
    const {source, input, flags, mode} = params
    if (!source || !input) {
        return result
    }
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
    if (!mode) {
        const {matches} = exec(regexp, input)
        result.matches = matches
        return result
    }
    const resolve = escapeLinebreak(params.resolve || '')
    if (mode === MODE_LIST) {
        const m = resolve.match(SPECIAL_SEPARATOR_RE)
        if (!m || m.length < 1) {
            // list with join
            const {matches, output} = execAndJoinList(regexp, input, resolve)
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
        const {matches, output} = execAndReplaceList(regexp, input, resolve, resolvers)
        result.matches = matches
        result.output = output
        return result
    } else {
        // replace
        const {matches, output} = execAndReplace(regexp, input, resolve)
        result.matches = matches
        result.output = output
        return result
    }
}

function exec (regexp, input) {
    const matches = []
    const result = {matches}
    if (regexp.global) {
        let match, value
        while (true) {
            match = regexp.exec(input)
            if (match === null) {
                break
            }
            value = match[0]
            if (!value) {
                break
            }
            matches.push({
                value,
                subs: match.slice(1),
                index: match.index,
                length: value.length
            })
        }
        return result
    }

    const match = regexp.exec(input)
    if (!match) {
        return result
    }
    const value = match[0]
    if (!value) {
        return result
    }
    matches.push({
        value,
        subs: match.slice(1),
        index: match.index,
        length: value.length
    })
    return result
}

function execAndJoinList (regexp, input, resolve) {
    const matches = []
    let output = ''
    let match, value
    while (true) {
        match = regexp.exec(input)
        if (!match) {
            break
        }
        value = match[0]
        if (!value) {
            break
        }
        matches.push({
            value,
            subs: match.slice(1),
            index: match.index,
            length: value.length
        })
        output += value + resolve
    }
    return {matches, output}
}

function execAndReplaceList (regexp, input, resolve, resolvers) {
    const matches = []
    let output = ''
    let match, value, _output
    while (true) {
        match = regexp.exec(input)
        if (!match) {
            break
        }
        value = match[0]
        if (!value) {
            break
        }
        matches.push({
            value,
            subs: match.slice(1),
            index: match.index,
            length: value.length
        })
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

function execAndReplace (regexp, input, resolve) {
    const matches = []
    let match, value
    while (true) {
        match = regexp.exec(input)
        if (!match) {
            break
        }
        value = match[0]
        if (!value) {
            break
        }
        matches.push({
            value,
            subs: match.slice(1),
            index: match.index,
            length: value.length
        })
    }
    const output = input.replace(regexp, resolve)
    return {matches, output}
}
