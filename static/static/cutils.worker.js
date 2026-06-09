importScripts('/static/static/utils.js')
importScripts('/static/lib/build/cutils.js')

const PTR_SIZE = 4
const MD5_SIZE = 128 / 8 // MD5 共 128 bit，需要 8 Byte 内存空间
const MOUNT_DIR = '/working'
const ARCHIVE_CHUNK_SIZE = 10240
const ARCHIVE_OK = 0
const ARCHIVE_EOF = 1
const SEEK_SET = 0
const SEEK_CUR = 1
const SEEK_END = 2

let _resolve
const modulePromise = new Promise(resolve => {
  _resolve = resolve
})
const Module = CUtils({
  locateFile: path => {
    return /cutils\.wasm$/.test(path) ? '/static/lib/build/cutils.wasm' : path
  },
  onRuntimeInitialized: () => {
    Module.FS.mkdir(MOUNT_DIR)
    _resolve(Module)
  },
})
// https://github.com/emscripten-core/emscripten/issues/5820
// emscripten Module 的 then 返回了 Module 自己，导致这里会有死循环
delete Module.then

self.addEventListener('message', async e => {
  const { id, payload: action } = e.data
  await modulePromise
  const { FS } = Module
  switch (action.type) {
    // case 'MD5_FS': {
    //   const start = performance.now()
    //   const file = action.payload
    //   const pMd5 = c.malloc(MD5_SIZE)
    //   const path = mount(file)

    //   const duration = c.md5(path, pMd5)
    //   self.postMessage({
    //     id,
    //     payload: {
    //       md5: getMd5String(Module, pMd5),
    //       duration,
    //       total: performance.now() - start,
    //     },
    //   })

    //   unmount(file)
    //   c.free(pMd5)
    //   break
    // }
    case 'MD5_MEM': {
      const start = performance.now()
      const MD5_CTX_SIZE = 152 // 见 md5.h
      const BUFFER_SIZE = 16 * 1024 * 1024

      const pCtx = c.malloc(MD5_CTX_SIZE)
      const pMd5 = c.malloc(MD5_SIZE)
      const pBuff = c.malloc(BUFFER_SIZE)

      const measure = new Measure()

      measure.run(() => c.md5_init(pCtx))
      for await (const chunk of makeBlobIterator(action.payload, BUFFER_SIZE)) {
        Module.HEAP8.set(new Int8Array(chunk), pBuff)
        measure.run(() => c.md5_update(pCtx, pBuff, chunk.byteLength))
      }
      measure.run(() => c.md5_final(pMd5, pCtx))

      self.postMessage({
        id,
        payload: {
          md5: getMd5String(Module, pMd5),
          duration: measure.total(),
          total: performance.now() - start,
        },
      })

      c.free(pCtx)
      c.free(pMd5)
      c.free(pBuff)
      break
    }
    // case 'LIBARCHIVE_FS': {
    //   const { payload: file } = action
    //   const measure = new Measure()
    //   const archivePath = mount(file)
    //   let error = ''

    //   const handleProgress = Module.addFunction(pStr => {
    //     self.postMessage({ id, progress: Module.UTF8ToString(pStr) })
    //   }, 'vi')
    //   const handleError = Module.addFunction(pStr => {
    //     error = Module.UTF8ToString(pStr)
    //   }, 'vi')

    //   const r = c.extract(archivePath, handleProgress, handleError)
    //   self.postMessage({
    //     id,
    //     progress: r === ARCHIVE_OK ? '[done]' : `[error] ${error}`,
    //   })

    //   Module.removeFunction(handleProgress)
    //   Module.removeFunction(handleError)
    //   unmount(file)
    //   self.postMessage({ id })
    //   break
    // }
    // case 'LIBARCHIVE_MEM': {
    //   const file = action.payload
    //   const reader = new FileReaderSync()
    //   const pBuff = c.malloc(ARCHIVE_CHUNK_SIZE)
    //   const pCallbacks = c.malloc(PTR_SIZE * 4)

    //   let offset = 0
    //   const readCallback = Module.addFunction(ppBuff => {
    //     const nextOffset = offset + ARCHIVE_CHUNK_SIZE
    //     const ab = reader.readAsArrayBuffer(file.slice(offset, nextOffset))
    //     Module.HEAP8.set(new Int8Array(ab), pBuff)
    //     Module.setValue(ppBuff, pBuff, '*')
    //     offset = nextOffset
    //     return ab.byteLength
    //   }, 'ii')
    //   const skipCallback = Module.addFunction((pRequest, pResult) => {
    //     const request = getInt64(Module, pRequest)
    //     const result =
    //       offset + request >= file.size ? file.size - offset : request
    //     offset += result
    //     setInt64(Module, pResult, result)
    //   }, 'iii')
    //   const seekCallback = Module.addFunction((pOffset, whence, pResult) => {
    //     const request = getInt64(Module, pOffset)
    //     switch (whence) {
    //       case SEEK_SET:
    //         offset = request
    //         break
    //       case SEEK_CUR:
    //         offset = offset + request
    //         break
    //       case SEEK_END:
    //         offset = file.size + request
    //         break
    //       default:
    //     }
    //     setInt64(Module, pResult, offset)
    //   }, 'viii')
    //   const closeCallback = Module.addFunction(() => {
    //     c.free(pBuff)
    //     c.free(pCallbacks)
    //     Module.removeFunction(readCallback)
    //     Module.removeFunction(skipCallback)
    //     Module.removeFunction(seekCallback)
    //     Module.removeFunction(closeCallback)
    //     return ARCHIVE_OK
    //   }, 'v')

    //   Module.setValue(pCallbacks + PTR_SIZE * 0, readCallback, '*')
    //   Module.setValue(pCallbacks + PTR_SIZE * 1, skipCallback, '*')
    //   Module.setValue(pCallbacks + PTR_SIZE * 2, seekCallback, '*')
    //   Module.setValue(pCallbacks + PTR_SIZE * 3, closeCallback, '*')

    //   const pArchive = c.archive_read_new()
    //   const ppEntry = c.malloc(PTR_SIZE)
    //   c.archive_prepare(pArchive, pCallbacks)
    //   c.archive_read_open1(pArchive)

    //   let r
    //   while (true) {
    //     r = c.archive_read_next_header(pArchive, ppEntry)
    //     if (r !== ARCHIVE_OK) {
    //       break
    //     }
    //     const pEntry = Module.getValue(ppEntry, '*')
    //     self.postMessage({ id, progress: c.archive_entry_pathname(pEntry) })
    //   }
    //   if (r !== ARCHIVE_OK && r !== ARCHIVE_EOF) {
    //     self.postMessage({
    //       id,
    //       progress: `[error] ${c.archive_error_string(pArchive)}`,
    //     })
    //   } else {
    //     self.postMessage({ id, progress: '[done]' })
    //   }
    //   self.postMessage({ id })
    //   c.archive_read_free(pArchive)
    //   c.free(ppEntry)
    //   break
    // }

    default:
  }
})

const c = {
  malloc: Module.cwrap('malloc', 'number', ['number']),
  free: Module.cwrap('free', null, ['number']),
  md5: Module.cwrap('md5', 'number', ['string', 'number']),
  md5_init: Module.cwrap('MD5_Init', 'number', ['number']),
  md5_update: Module.cwrap('MD5_Update', null, ['number', 'number', 'number']),
  md5_final: Module.cwrap('MD5_Final', null, ['number', 'number']),
  extract: Module.cwrap('extract', 'number', ['string', 'number', 'number']),
  archive_read_new: Module.cwrap('archive_read_new', null, []),
  archive_prepare: Module.cwrap('archive_prepare', null, ['number', 'number']),
  archive_read_open1: Module.cwrap('archive_read_open1', 'number', ['number']),
  archive_read_next_header: Module.cwrap('archive_read_next_header', 'number', [
    'number',
    'number',
  ]),
  archive_entry_pathname: Module.cwrap('archive_entry_pathname', 'string', [
    'number',
  ]),
  archive_error_string: Module.cwrap('archive_error_string', 'string', [
    'number',
  ]),
  archive_read_free: Module.cwrap('archive_read_free', 'string', ['number']),
}

function mount(file) {
  Module.FS.mount(Module.FS.filesystems.WORKERFS, { files: [file] }, MOUNT_DIR)
  return `${MOUNT_DIR}/${file.name}`
}
function unmount() {
  Module.FS.unmount(MOUNT_DIR)
}

function getMd5String(instance, p) {
  let md5 = ''
  for (let i = 0; i < MD5_SIZE; i++) {
    const value = instance.HEAPU8[p + i]
    md5 += '00'.concat(value.toString(16)).slice(-2)
  }
  return md5
}

function getInt64(instance, ptr) {
  const bytes = instance.HEAPU8.slice(ptr, ptr + 8)
  const isNegative = (bytes[7] & 1) === 1
  const sum = bytes
    .map(x => (isNegative ? ~x : x))
    .reduce((sum, x, index) => sum + (x === 0 ? 0 : x * (2 ** 8) ** index), 0)
  return isNegative ? -(sum + 1) : sum
}

function setInt64(instance, ptr, num) {
  let bytes = new Uint8Array(8)
  const BASE = 256
  const isNegative = num < 0
  let n = isNegative ? -num : num
  for (let i = 0; i < 7; i++) {
    bytes[i] = n % BASE
    n = Math.floor(n / BASE)
  }
  if (isNegative) {
    bytes = bytes.map(x => ~x)
    for (let i = 0; i < 7; i++) {
      bytes[i] += 1
      if (bytes[i] !== 0) {
        break
      }
    }
  }
  instance.HEAPU8.set(bytes, ptr)
  return bytes
}
