class WorkerMock {
    constructor() {}
    postMessage() {}
    terminate() {}
    set onmessage(_fn) {}
    set onerror(_fn) {}
}

global.Worker = WorkerMock
