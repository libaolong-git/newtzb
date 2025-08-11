<template>
  <div class="min-h-screen bg-gradient-to-br from-bg-primary to-bg-secondary">
    <!-- 顶部导航栏 -->
    <nav class="gov-header">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <button
              @click="$router.go(-1)"
              class="mr-4 p-2 text-secondary hover:text-primary transition-colors duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <div class="flex items-center space-x-3">
              <!-- 政务智能助手图标 -->
              <GovIcon size="sm" />
              <h1 class="text-xl font-semibold text-primary">政务智能助手 - 个人设置</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <!-- 用户头像下拉菜单 -->
            <div 
              @click="toggleUserMenu"
              class="relative"
            >
              <img 
                v-if="userInfo.avatar" 
                :src="userInfo.avatar" 
                :alt="userInfo.name"
                class="user-avatar"
              />
              <div 
                v-else
                class="avatar-placeholder"
              >
                {{ userInfo.name ? userInfo.name.charAt(0) : 'U' }}
              </div>
              
              <!-- 下拉菜单 -->
              <div 
                :class="['dropdown-menu', { 'show': showUserMenu }]"
              >
                <router-link to="/" class="dropdown-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  返回主页
                </router-link>
                <a href="#" @click="logout" class="dropdown-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  退出登录
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 sm:px-0">
        <!-- 页面标题 -->
        <div class="mb-8 animate-fadeIn">
          <div class="gov-card">
            <div class="card-body">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-primary mb-2 block">
                    系统设置
                  </h2>
                  <p class="text-secondary">
                    管理您的个人信息和安全配置
                  </p>
                </div>
                <div class="md:block">
                  <GovIcon size="lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 设置选项卡 -->
        <div class="mb-8">
          <div class="gov-card">
            <div class="card-body">
              <nav class="flex space-x-8">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    activeTab === tab.id
                      ? 'border-accent text-accent bg-bg-secondary'
                      : 'border-transparent text-secondary hover:text-primary hover:border-border',
                    'whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200'
                  ]"
                >
                  <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="tab.id === 'profile'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    <path v-else-if="tab.id === 'security'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                  </svg>
                  {{ tab.name }}
                </button>
              </nav>
            </div>
          </div>
        </div>

        <!-- 个人信息设置 -->
        <div v-if="activeTab === 'profile'" class="gov-card animate-slideInFromLeft">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-primary flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              个人信息
            </h3>
            <p class="text-sm text-secondary mt-1">管理您的基本信息</p>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateProfile" class="space-y-6">
              <!-- 头像设置 -->
              <div class="flex items-center space-x-6">
                <div class="flex-shrink-0">
                  <img 
                    v-if="profileForm.avatar" 
                    :src="profileForm.avatar" 
                    :alt="profileForm.name"
                    class="user-avatar w-20 h-20"
                  />
                  <div 
                    v-else
                    class="avatar-placeholder w-20 h-20 text-2xl"
                  >
                    {{ profileForm.name ? profileForm.name.charAt(0) : 'U' }}
                  </div>
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-medium text-primary mb-2">头像</label>
                  <div class="flex items-center space-x-4">
                    <input
                      type="file"
                      ref="avatarInput"
                      @change="handleAvatarChange"
                      accept="image/*"
                      class="hidden"
                    />
                    <button
                      type="button"
                      @click="$refs.avatarInput.click()"
                      class="gov-button-secondary"
                    >
                      选择头像
                    </button>
                    <button
                      v-if="profileForm.avatar"
                      type="button"
                      @click="removeAvatar"
                      class="text-sm text-error hover:text-error/80"
                    >
                      移除头像
                    </button>
                  </div>
                  <p class="text-xs text-secondary mt-1">支持 JPG、PNG 格式，文件大小不超过 2MB</p>
                </div>
              </div>
              
              <!-- 基本信息 -->
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="name" class="block text-sm font-medium text-primary mb-2">
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    姓名
                  </label>
                  <input
                    type="text"
                    id="name"
                    v-model="profileForm.name"
                    class="gov-input w-full"
                    placeholder="请输入您的姓名"
                    required
                  />
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-primary mb-2">
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    手机号
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    v-model="profileForm.phone"
                    class="gov-input w-full"
                    placeholder="请输入您的手机号"
                  />
                </div>
                <div>
                  <label for="company" class="block text-sm font-medium text-primary mb-2">
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                    公司/组织
                  </label>
                  <input
                    type="text"
                    id="company"
                    v-model="profileForm.company"
                    class="gov-input w-full"
                    placeholder="请输入您的公司或组织名称"
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-primary mb-2">
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    邮箱
                  </label>
                  <input
                    type="email"
                    id="email"
                    v-model="profileForm.email"
                    class="gov-input w-full"
                    placeholder="请输入您的邮箱地址"
                  />
                </div>
              </div>
              <div class="flex justify-end pt-4">
                <button
                  type="submit"
                  :disabled="loading"
                  class="gov-button flex items-center gap-2"
                >
                  <span v-if="loading" class="loading"></span>
                  <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  {{ loading ? '保存中...' : '保存更改' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- 安全设置 -->
        <div v-if="activeTab === 'security'" class="gov-card animate-slideInFromRight">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-primary flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              安全设置
            </h3>
            <p class="text-sm text-secondary mt-1">修改您的登录密码和安全配置</p>
          </div>
          <div class="card-body">
            <form @submit.prevent="updatePassword" class="space-y-6">
              <div>
                <label for="current-password" class="block text-sm font-medium text-primary mb-2">
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  当前密码
                </label>
                <input
                  type="password"
                  id="current-password"
                  v-model="passwordForm.currentPassword"
                  class="gov-input w-full"
                  placeholder="请输入当前密码"
                />
              </div>
              <div>
                <label for="new-password" class="block text-sm font-medium text-primary mb-2">
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                  </svg>
                  新密码
                </label>
                <input
                  type="password"
                  id="new-password"
                  v-model="passwordForm.newPassword"
                  class="gov-input w-full"
                  placeholder="请输入新密码（至少6位）"
                />
              </div>
              <div>
                <label for="confirm-password" class="block text-sm font-medium text-primary mb-2">
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  确认新密码
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  v-model="passwordForm.confirmPassword"
                  class="gov-input w-full"
                  placeholder="请再次输入新密码"
                />
              </div>
              
              <div class="flex justify-end pt-4">
                <button
                  type="submit"
                  :disabled="loading"
                  class="gov-button flex items-center gap-2"
                >
                  <span v-if="loading" class="loading"></span>
                  <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  {{ loading ? '更新中...' : '更新密码' }}
                </button>
              </div>
            </form>
          </div>
        </div>


      </div>
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth'
import GovIcon from '@/components/GovIcon.vue'

export default {
  name: 'Settings',
  components: {
    GovIcon
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      activeTab: 'profile',
      loading: false,
      showUserMenu: false,
      userInfo: {
        name: '张三',
        email: 'zhangsan@gov.cn',
        department: '市政府办公室',
        role: '科员'
      },
      profileForm: {
        name: '',
        email: '',
        phone: '',
        company: '',
        avatar: ''
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },

      tabs: [
        { id: 'profile', name: '个人信息' },
        { id: 'security', name: '安全设置' }
      ]
    }
  },
  mounted() {
    this.loadUserInfo()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    loadUserInfo() {
      // 从全局状态加载用户信息
      if (this.authStore.user) {
        this.userInfo = { ...this.authStore.user }
        this.profileForm = { ...this.authStore.user }
      } else {
        // 如果全局状态没有，尝试从localStorage加载
        const savedUserInfo = localStorage.getItem('userInfo')
        if (savedUserInfo) {
          this.userInfo = JSON.parse(savedUserInfo)
          this.profileForm = { ...this.userInfo }
        }
      }
    },

    handleAvatarChange(event) {
      const file = event.target.files[0]
      if (!file) return
      
      // 检查文件大小（2MB限制）
      if (file.size > 2 * 1024 * 1024) {
        alert('头像文件大小不能超过2MB')
        return
      }
      
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }
      
      // 读取文件并转换为base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const avatarData = e.target.result
        this.profileForm.avatar = avatarData
        // 更新全局状态
        this.authStore.updateUserAvatar(avatarData)
        alert('头像上传成功！')
      }
      reader.readAsDataURL(file)
    },
    removeAvatar() {
      this.profileForm.avatar = ''
      // 更新全局状态
      this.authStore.updateUserAvatar('')
      // 清空文件输入
      if (this.$refs.avatarInput) {
        this.$refs.avatarInput.value = ''
      }
      alert('头像已移除！')
    },

    async updateProfile() {
      this.loading = true
      
      // 更新全局状态
      this.authStore.updateUserInfo({
        name: this.profileForm.name,
        email: this.profileForm.email,
        phone: this.profileForm.phone,
        company: this.profileForm.company,
        avatar: this.profileForm.avatar
      })
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 更新用户信息
        this.userInfo = { ...this.profileForm }
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
        
        this.$message.success('个人信息更新成功')
      } catch (error) {
        this.$message.error('更新失败，请重试')
      } finally {
        this.loading = false
      }
    },
    async updatePassword() {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.$message.error('两次输入的密码不一致')
        return
      }
      
      if (this.passwordForm.newPassword.length < 6) {
        this.$message.error('密码长度至少为6位')
        return
      }
      
      this.loading = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.$message.success('密码更新成功')
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      } catch (error) {
        this.$message.error('密码更新失败，请重试')
      } finally {
        this.loading = false
      }
    },

    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
    },
    handleClickOutside(event) {
      if (!event.target.closest('.relative')) {
        this.showUserMenu = false
      }
    },
    logout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style scoped>
/* 组件特定样式 */
.loading {
  width: 1rem;
  height: 1rem;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>