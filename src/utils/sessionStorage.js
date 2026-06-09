const sessionStorage = window.sessionStorage

export default {
  name: 'sessionStorage',

  /**
   * 设置 sessionStorage
   * @param {string} key 键
   * @param {Object} value 值
   */
  set (key, value) {
    sessionStorage.setItem(key, JSON.stringify(value))
  },

  /**
   * 获取 sessionStorage
   * @param {string} key 键
   * @return {Object}
   */
  get (key) {
    return JSON.parse(sessionStorage.getItem(key)) || null
  },

  /**
   * 移除 sessionStorage
   * @param {string} key 键
   */
  remove (key) {
    sessionStorage.removeItem(key)
  },

  /**
   * 清除 sessionStorage
   */
  clear () {
    sessionStorage.clear()
  }
}
