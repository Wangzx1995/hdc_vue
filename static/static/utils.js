const CHUNK_SIZE = 16 * 1024 * 1024

let _spark
let _readBlob
let _cutils
function makeCUtils() {
  return (_cutils = _cutils || makeWorker('/static/static/cutils.worker.js'))
}
function makeReadBlob() {
  return (_readBlob = _readBlob || makeWorker('/static/static/readBlob.worker.js'))
}
function makeSpark() {
  return (_spark = _spark || makeWorker('/static/static/spark.worker.js'))
}

// async function md5WasmFs(file) {
//   const cutils = makeCUtils()
//   return await cutils({ type: 'MD5_FS', payload: file })
// }

async function md5WasmMem(file) {
  const cutils = makeCUtils()
  return await cutils({ type: 'MD5_MEM', payload: file })
}

// async function md5Js(file) {
//   const spark = makeSpark()
//   return await spark(file)
// }

// async function libarchiveFs(file, onPathname) {
//   const cutils = makeCUtils()
//   await cutils({ type: 'LIBARCHIVE_FS', payload: file }, onPathname)
// }

// async function libarchiveMem(file, onPathname) {
//   const cutils = makeCUtils()
//   await cutils({ type: 'LIBARCHIVE_MEM', payload: file }, onPathname)
// }

async function* makeBlobIterator(blob, chunkSize = CHUNK_SIZE) {
  const readBlob = makeReadBlob()//固件上传后转化成的blob文件格式
  let nextChunk

  let currentOffset = 0
  while (true) {
    let currentChunk = nextChunk
    const nextOffset = currentOffset + chunkSize//已上次上传的结束点为下个上传开始的开始点
    const subBlob = blob.slice(currentOffset, nextOffset)//每次上传的长度
    if (subBlob.size === 0) {
      nextChunk = null
    } else {
      nextChunk = readBlob(subBlob)
      currentOffset = nextOffset
    }
    if (!currentChunk) {
      if (!nextChunk) {
        break
      } else {
        continue
      }
    }
    yield await currentChunk//直至读取完毕
  }
}

function makeWorker(uri) {
  const worker = new Worker(uri)
  const handlers = {}
  const callbacks = {}

  worker.addEventListener('message', e => {
    const { id, payload, progress } = e.data
    if (progress) {
      const callback = callbacks[id]
      if (callback) {
        callback(progress)
      }
    } else {
      const handler = handlers[id]
      if (handler) {
        handler.resolve(payload)
      }
      delete handlers[id]
      delete callbacks[id]
    }
  })

  return function call(payload, onProgress) {
    return new Promise((resolve, reject) => {
      const id = Math.random().toString()
      handlers[id] = { resolve, reject }
      callbacks[id] = onProgress
      worker.postMessage({ id, payload })
    })
  }
}

function listenFileInputChange($el, onChange) {
  $el.addEventListener('change', e => {
    const file = e.target.files[0]
    if (!file) return
    onChange(file)
    e.target.value = null
    return false
  })
}

function formatBytes(bytes, options = { decimals: 2 }) {
  if (bytes === 0) return '0B'
  const k = 1024
  const dm = options.decimals && options.decimals > 0 ? options.decimals : 0
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i]
}

function Measure(
  name = Math.random()
    .toString(16)
    .slice(-6)
) {
  const startMark = id => `${name}-start-${id}`
  const measureMark = id => `${name}-measure-${id}`

  function startMeasure(id) {
    performance.mark(startMark(id))
  }
  function endMeasure(id) {
    performance.measure(measureMark(id), startMark(id))
  }

  let count = 0
  return {
    run: fn => {
      const id = count++
      startMeasure(id)
      const result = fn()
      if (result instanceof Promise) {
        return result.then(v => {
          endMeasure(id)
          return v
        })
      } else {
        endMeasure(id)
        return result
      }
    },
    total: () => {
      let sum = 0
      for (let i = 0; i < count; i++) {
        const entry = performance.getEntriesByName(measureMark(i))[0]
        if (entry) {
          sum += entry.duration
        }
      }
      return sum
    },
  }
}
