import { userApi } from './api'

/**
 * 用户认证相关API
 */
export const authService = {
  /**
   * 用户登录
   * @param {Object} credentials - 登录凭据
   * @param {string} credentials.mobile - 手机号
   * @param {string} credentials.password - 密码
   * @returns {Promise} 登录响应
   */
  async login(credentials) {
    try {
      const response = await userApi.post('/usercenter/v1/user/login', {
        mobile: credentials.mobile,
        password: credentials.password
      })
      
      if (response.data.code === 0) {
        return {
          success: true,
          data: response.data.data
        }
      } else {
        return {
          success: false,
          message: response.data.msg || '登录失败'
        }
      }
    } catch (error) {
      console.error('登录请求失败:', error)
      return {
        success: false,
        message: error.response?.data?.msg || '登录失败，请重试'
      }
    }
  },

  /**
   * 用户注册
   * @param {Object} userData - 注册数据
   * @param {string} userData.mobile - 手机号
   * @param {string} userData.password - 密码
   * @returns {Promise} 注册响应
   */
  async register(userData) {
    try {
      const response = await userApi.post('/usercenter/v1/user/register', {
        mobile: userData.mobile,
        password: userData.password
      })
      
      if (response.data.code === 0) {
        return {
          success: true,
          data: response.data.data
        }
      } else {
        return {
          success: false,
          message: response.data.msg || '注册失败'
        }
      }
    } catch (error) {
      console.error('注册请求失败:', error)
      return {
        success: false,
        message: error.response?.data?.msg || '注册失败，请重试'
      }
    }
  },

  /**
   * 获取用户详情
   * @returns {Promise} 用户详情响应
   */
  async getUserDetail() {
    try {
      const response = await userApi.post('/usercenter/v1/user/detail')
      
      if (response.data.code === 0) {
        return {
          success: true,
          data: response.data.data.userInfo
        }
      } else {
        return {
          success: false,
          message: response.data.msg || '获取用户信息失败'
        }
      }
    } catch (error) {
      console.error('获取用户详情失败:', error)
      return {
        success: false,
        message: error.response?.data?.msg || '获取用户信息失败'
      }
    }
  }
}

export default authService