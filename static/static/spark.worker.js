importScripts('/static/utils.js')
importScripts('https://unpkg.com/spark-md5@3.0.0/spark-md5.js')

const START_MARK = 'spark-start'
const END_MARK = 'spark-end'
const MEASURE_MARK = 'spark-measure'

self.addEventListener('message', async e => {
  const start = performance.now()
  const measure = new Measure()
  const { payload: blob, id } = e.data
  const spark = measure.run(() => new SparkMD5.ArrayBuffer())
  for await (const chunk of makeBlobIterator(blob)) {
    measure.run(() => spark.append(chunk))
  }
  const md5 = measure.run(() => spark.end())
  self.postMessage({
    payload: {
      md5,
      duration: measure.total(),
      total: performance.now() - start,
    },
    id,
  })
})
