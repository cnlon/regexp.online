import MyWorker from './worker'


export default function makeWorker (callback) {
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
