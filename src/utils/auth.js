import Storage from './storage'
import SessionStorage from './sessionStorage'

const MANAGER = 'username'
const TOKEN = 'otatoken'

export default {
  name: 'auth',

  /**
   * 获取 auth，返回：管理员信息和 token
   * @return {Object}
   */
  get () {
    return {
      [MANAGER]: SessionStorage.get(MANAGER),
      [TOKEN]: SessionStorage.get(TOKEN)
    }
  },

  /**
   * 获取 token，返回：token
   * @return {string}
   */
  getToken () {
    return SessionStorage.get(TOKEN)
  },

  /**
   * 设置 token，返回：token
   * @return
   */
  setToken (token) {
    return SessionStorage.set(TOKEN, token)
  },

  /**
   * 登录
   * @param {string} manager 登录管理员
   * @param {string} token 登录 token
   */
  login (username, token) {
    SessionStorage.set(MANAGER, username)
    SessionStorage.set(TOKEN, token)
  },
/**
   * token登录
   * @param {string} manager 登录管理员
   * @param {string} token 登录 token
   */
  loginToken(token){
    SessionStorage.set(TOKEN, token)
  },
  /**
   * 登出
   */
  logout () {
    //Storage.remove(MANAGER)
    SessionStorage.remove(TOKEN)
    Storage.remove('deviceManageId');
    Storage.remove('deviceUpgradeId');
    Storage.remove('deviceConfigurationId');
  },

  /**
   * 修改密码
   */
  modifyPwd(){
    SessionStorage.set(TOKEN, "TEMP_TOKEN")
  },
  signOnPage(){
    SessionStorage.set(TOKEN, "TEMP_TOKEN")
  },
  /**
   * 是否已登录
   * @return {boolean}
   */
  loggedIn () {
    return !!Storage.get(MANAGER) && !!Storage.get(TOKEN)
  }
}
