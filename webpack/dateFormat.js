/**
 * http://codepen.io/lon/pen/bZRLOd?editors=0010#0
 *
 * @param {Number} timestamp
 * @param {String} format
 * @return {String}
 */

module.exports = function dateFormat (timestamp, format) {
  const date = new Date(timestamp)
  const output = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    Math.floor(date.getMonth() / 3 + 1),
    date.getMilliseconds(),
  ]
  let result = ''
  if (RE_LIST[0].test(format)) {
    result = RegExp[SYMBOL_LEFT] + output[0].toString().substr(4 - RegExp[SYMBOL_CURRENT].length)
    format = RegExp[SYMBOL_RIGHT]
  }
  for (let i = 1; format && i < LENGTH; i++) {
    if (RE_LIST[i].test(format)) {
      result += RegExp[SYMBOL_LEFT]
              + (output[i] >= 10 || RegExp[SYMBOL_CURRENT].length === 1
                ? output[i]
                : '0' + output[i])
      format = RegExp[SYMBOL_RIGHT]
    }
  }
  result += format
  return result
}
const RE_LIST = [/y+/, /M+/, /d+/, /h+/, /m+/, /s+/, /q+/, /S/]
const LENGTH = RE_LIST.length
const SYMBOL_LEFT = '$`'
const SYMBOL_CURRENT = '$&'
const SYMBOL_RIGHT = '$\''
