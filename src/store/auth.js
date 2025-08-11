import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isAuthenticated = ref(!!token.value)

  // 登录
  const login = async (credentials) => {
    try {
      // 调用实际的登录API
      const { authService } = await import('@/services/auth')
      const response = await authService.login({
         mobile: credentials.mobile,
         password: credentials.password
       })
      
      if (response.success) {
        const userData = response.data
        const mockUser = {
           id: userData.userId || 1,
           mobile: credentials.mobile,
           name: userData.name || '用户',
           department: userData.department || '政府部门',
           role: userData.role || '工作人员'
         }
        
        user.value = mockUser
        token.value = userData.accessToken
        isAuthenticated.value = true
        
        localStorage.setItem('token', userData.accessToken)
        localStorage.setItem('user', JSON.stringify(mockUser))
        
        return { success: true, user: mockUser }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('登录失败:', error)
      return { success: false, message: '登录失败，请检查用户名和密码' }
    }
  }

  // 注册
  const register = async (userInfo) => {
    try {
      // 调用实际的注册API
      const { authService } = await import('@/services/auth')
      const response = await authService.register({
         mobile: userInfo.mobile,
         password: userInfo.password
       })
      
      if (response.success) {
        return { success: true, message: '注册成功，请登录' }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('注册失败:', error)
      return { success: false, message: '注册失败，请稍后重试' }
    }
  }

  // 登出
  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // 更新用户头像
  const updateUserAvatar = (avatarData) => {
    if (user.value) {
      user.value.avatar = avatarData
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  // 更新用户信息
  const updateUserInfo = (userInfo) => {
    if (user.value) {
      user.value = { ...user.value, ...userInfo }
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  // 获取用户头像
  const getUserAvatar = () => {
    return user.value?.avatar || null
  }

  // 初始化用户信息
  const initializeAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser && token.value) {
      try {
        user.value = JSON.parse(savedUser)
        isAuthenticated.value = true
      } catch (error) {
        console.error('解析用户信息失败:', error)
        logout()
      }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    initializeAuth,
    updateUserAvatar,
    updateUserInfo,
    getUserAvatar
  }
})