const reader = new FileReaderSync()

self.addEventListener('message', e => {
  const { payload: blob, id } = e.data
  const ab = reader.readAsArrayBuffer(blob)
  self.postMessage({ payload: ab, id }, [ab])
})
