/**
 * @param {Function} fun
 * @param {Number} [wait=0]  - milliseconds
 * @param {Number} [maxWait] - milliseconds
 * @returns {Function}       - throttled
 */

export default function throttle (fun, wait = 0, maxWait) {
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
