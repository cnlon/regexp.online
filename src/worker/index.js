const MyWorker = require(
    process.env.NODE_ENV === 'production'
        ? 'worker-loader?name=worker.[chunkhash:6].js!./worker.js'
        : 'worker-loader?name=worker.js!./worker.js'
)

module.exports = function makeWorker (callback) {
    const worker = new MyWorker()
    worker.onmessage = function (event) {
        const [method, data] = event.data
        callback(method, data)
    }
    worker.post = function (method, data) {
        worker.postMessage([method, data])
    }
    return worker
}
