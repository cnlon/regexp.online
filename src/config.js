import {MODE_LIST, MODE_REPLACE} from './types'
import regexps from './regexps.json'

export const defaultResolve = {
  [MODE_LIST]: '$&\\n',
  [MODE_REPLACE]: '[$&]',
}

export const defaultRegexp = {
  source: '',
  flags: 'g',
  input: '',
  resolve: defaultResolve[MODE_LIST],
  mode: MODE_LIST,
}

export const demoRegexp = Object.assign(
  {},
  defaultRegexp,
  Object.values(regexps)[0],
)

export const flags = [{
  value: 'g',
  title: '全局匹配',
}, {
  value: 'i',
  title: '忽略大小写',
}, {
  value: 'm',
  title: '多行模式',
}]
const check = function (flag) {
  try {
    RegExp('', flag)
    return true
  } catch (e) {
    return false
  }
}
if (check('u')) {
  flags.push({
    value: 'u',
    title: 'Unicode模式',
  })
}
if (check('y')) {
  flags.push({
    value: 'y',
    title: '粘连模式',
  })
}

export const modes = [{
  value: MODE_LIST,
  title: '列举',
}, {
  value: MODE_REPLACE,
  title: '替换',
}]

export const MIN_DELAY = 100
export const MAX_DELAY = 600
