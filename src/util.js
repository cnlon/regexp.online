/**
 * @param {Function} fun
 * @param {Number} [wait=0]  - milliseconds
 * @param {Number} [maxWait] - milliseconds
 * @returns {Function}       - throttled
 */

export function throttle (fun, wait = 0, maxWait) {
  let waitTimer, throttled, cancel, self
  let args = []
  if (maxWait && maxWait > wait) {
    let maxWaitTimer
    cancel = function cancel () {
      if (waitTimer) {
        clearTimeout(waitTimer)
        waitTimer = null
      }
      if (maxWaitTimer) {
        clearTimeout(maxWaitTimer)
        maxWaitTimer = null
      }
    }
    throttled = function throttled (...newArgs) {
      self = this
      args = newArgs
      if (waitTimer) {
        clearTimeout(waitTimer)
      } else {
        maxWaitTimer = setTimeout(function () {
          maxWaitTimer = null
          fun.apply(self, args)
          cancel()
        }, maxWait)
      }
      waitTimer = setTimeout(function () {
        waitTimer = null
        clearTimeout(maxWaitTimer)
        maxWaitTimer = null
        fun.apply(self, args)
      }, wait)
    }
  } else {
    cancel = function cancel () {
      if (waitTimer) {
        clearTimeout(waitTimer)
        waitTimer = null
      }
    }
    throttled = function throttled (...newArgs) {
      self = this
      args = newArgs
      if (waitTimer) {
        clearTimeout(waitTimer)
      }
      waitTimer = setTimeout(function () {
        waitTimer = null
        fun.apply(self, args)
      }, wait)
    }
  }
  throttled.cancel = cancel
  return throttled
}

/**
 * @param {String} str - string to encode
 * @returns {String}   - encoded string
 */

export function encode (str) {
  return replace.call(str, ENCODE_REPLACE_RE, ENCODE_REPLACER)
}
const replace = String.prototype.replace
const ENCODE_REPLACE_RE = /[\\|"]/g
const ENCODE_REPLACER = '\\$&'

/**
 * @param {String} str - string to decode
 * @returns {String}   - decoded string
 */

export function decode (str) {
  return replace.call(str, DECODE_REPLACE_RE, DECODE_REPLACER)
}
const DECODE_REPLACE_RE = /\\([\\|"])/g
const DECODE_REPLACER = '$1'
