<template>
  <div class="min-h-screen bg-gradient-to-br from-bg-primary to-bg-secondary">
    <!-- 顶部导航栏 -->
    <nav class="gov-header">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <button
              @click="goBack"
              class="mr-4 p-2 text-secondary hover:text-primary transition-colors duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <div class="flex items-center space-x-3">
              <!-- 智能助手图标 -->
              <GovIcon size="sm" />
              <h1 class="text-xl font-semibold text-primary">智能助手 - 文档生成</h1>
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
                <router-link to="/settings" class="dropdown-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  个人设置
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
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 sm:px-0">
        <!-- 状态卡片 -->
        <div class="mb-8 animate-fadeIn">
          <div class="gov-card">
            <div class="card-body">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="statusIconClass">
                    <svg v-if="generationStatus === 'generating'" class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else-if="generationStatus === 'completed'" class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    <svg v-else class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-primary">{{ statusTitle }}</h2>
                    <p class="text-secondary">{{ statusDescription }}</p>
                  </div>
                </div>
                <div v-if="generationStatus === 'generating'" class="text-right">
                  <div class="text-2xl font-bold text-accent">{{ Math.round(progress) }}%</div>
                  <div class="text-sm text-secondary">{{ estimatedTime }}</div>
                </div>
                <!-- 下载按钮 - 仅在生成完成时显示 -->
                <div v-if="generationStatus === 'completed'" class="relative z-50">
                  <button ref="downloadButton" @click="toggleDownloadMenu" class="gov-button flex items-center justify-center space-x-2 px-4 py-2">
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    <span class="font-semibold">下载文档</span>
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  
                  <!-- 下载格式下拉菜单 -->
                  <div v-show="showDownloadMenu" class="absolute top-full right-0 mt-3 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden animate-fadeIn">
                    <div class="py-1">
                      <button @click="downloadDocument('pdf')" class="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center space-x-3 transition-all duration-200 group">
                        <div class="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                          <svg class="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                          </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">PDF 文档</span>
                      </button>
                      
                      <button @click="downloadDocument('docx')" class="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center space-x-3 transition-all duration-200 group">
                        <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <svg class="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                          </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">Word 文档</span>
                      </button>
                      
                      <button @click="downloadDocument('txt')" class="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-all duration-200 group">
                        <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                          <svg class="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                          </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors">纯文本</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 进度条 -->
              <div v-if="generationStatus === 'generating'" class="mt-6">
                <div class="w-full bg-border rounded-full h-3 overflow-hidden">
                  <div class="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-700 ease-out" :style="{ width: progress + '%' }"></div>
                </div>
                <div class="flex justify-between text-xs text-tertiary mt-2">
                  <span>开始生成</span>
                  <span>{{ generationSteps[Math.min(currentStep, generationSteps.length - 1)] }}</span>
                  <span>完成</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 主要内容网格 -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <!-- 文档预览 -->
          <div class="xl:col-span-2">
            <div class="gov-card animate-slideInFromLeft">
              <!-- 文档头部 -->
              <div class="card-header">
                <div class="flex items-center justify-between">
                  <div>
                    <h1 class="text-2xl font-bold text-primary">{{ documentTitle }}</h1>
                    <p class="text-sm text-secondary mt-1">创建于：{{ formatDate(new Date()) }}</p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="badge" :class="statusBadgeClass">
                      {{ statusBadgeText }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 文档内容 -->
              <div class="card-body relative" v-if="isGenerated">
                <!-- 编辑按钮 -->
                <div class="absolute top-4 right-4 z-10">
                  <button v-if="!isEditing" @click="startEdit" class="gov-button flex items-center justify-center space-x-2 px-4 py-2">
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.828-2.828z" />
                    </svg>
                    <span class="font-semibold">编辑文档</span>
                  </button>
                  <div v-else class="flex items-center space-x-2">
                    <button @click="saveEdit" class="gov-button flex items-center justify-center space-x-2 px-4 py-2">
                      <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      <span class="font-semibold">保存</span>
                    </button>
                    <button @click="cancelEdit" class="gov-button flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700">
                      <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                      <span class="font-semibold">取消</span>
                    </button>
                  </div>
                </div>


                <!-- 文档标题 -->
                <div class="text-center mb-10">
                  <h2 class="text-3xl font-bold text-primary leading-relaxed">{{ documentTitle }}</h2>
                </div>



                <!-- 文档正文 -->
                <div class="prose prose-lg max-w-none text-secondary leading-relaxed mb-10 bg-white rounded-lg border border-border">
                  
                  <!-- 文档内容区域 -->
                  <div class="p-6">
                    <!-- 预览模式 -->
                    <div v-if="!isEditing" v-html="formattedContent"></div>
                    
                    <!-- 编辑模式 -->
                    <div v-else class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">文档标题</label>
                        <input v-model="editableTitle" @input="onContentChange" class="edit-input w-full" placeholder="请输入文档标题">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">文档内容</label>
                        <textarea v-model="editableContent" @input="onContentChange" class="edit-textarea w-full" placeholder="请输入文档内容"></textarea>
                      </div>
                      <div class="edit-stats">
                        <span>字数统计: {{ editWordCount }} 字</span>
                        <span v-if="hasUnsavedChanges" class="unsaved-indicator">未保存的更改</span>
                        <span v-if="lastModified">{{ lastModifiedText }}</span>
                      </div>
                    </div>
                  </div>
                </div>


              </div>

              <!-- 生成占位符 -->
              <div v-else class="card-body text-center py-12">
                <div class="max-w-md mx-auto">
                  <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                    <svg class="h-12 w-12 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-primary mb-3">文档生成中...</h3>
                  <p class="text-secondary mb-6">我们正在使用AI技术为您生成专业的文档，请稍候片刻。</p>
                  <div class="flex items-center justify-center space-x-2 text-sm text-tertiary">
                    <div class="loading"></div>
                    <span>正在处理您的请求...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作侧边栏 -->
          <div class="xl:col-span-1 space-y-6">

            


            <!-- 文档信息 -->
            <div class="gov-card animate-slideInFromRight" style="animation-delay: 0.2s">
              <div class="card-header">
                <h3 class="text-lg font-bold text-primary flex items-center">
                  <svg class="h-5 w-5 mr-2 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  文档信息
                </h3>
              </div>
              <div class="card-body space-y-4">

                <div class="flex justify-between items-center">
                  <span class="text-sm text-secondary">字数统计</span>
                  <span class="text-sm font-medium text-primary">{{ wordCount }} 字</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-secondary">创建时间</span>
                  <span class="text-sm font-medium text-primary">{{ formatDate(new Date()) }}</span>
                </div>
                <div v-if="lastModified" class="flex justify-between items-center">
                  <span class="text-sm text-secondary">最后修改</span>
                  <span class="text-sm font-medium text-primary">{{ formatDate(lastModified) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-secondary">状态</span>
                  <span class="badge badge-success">{{ generationStatus === 'completed' ? '已完成' : '生成中' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth'
import { useDocumentStore } from '@/store/document'
import { documentService } from '@/services/document'
import GovIcon from '@/components/GovIcon.vue'

export default {
  name: 'DocumentGeneration',
  components: {
    GovIcon
  },
  setup() {
    const authStore = useAuthStore()
    const documentStore = useDocumentStore()
    return {
      authStore,
      documentStore
    }
  },
  data() {
    return {
      showUserMenu: false,
      showDownloadMenu: false,
      generationStatus: 'idle', // 'idle', 'generating', 'completed', 'error'
      progress: 0,
      currentStep: 0,
      estimatedTime: '预计还需 2 分钟',
      startTime: null,
      lastUpdateTime: null,
      totalExpectedLength: 2000,
      progressTimer: null,
      
      // 编辑功能相关
      isEditing: false,
      editableTitle: '',
      editableContent: '',
      lastModified: null,
      hasUnsavedChanges: false,

      documentTitle: '',
      checklistInfo: {
        date: new Date()
      },
      generationSteps: [
        '分析需求',
        '收集资料',
        '生成大纲',
        '撰写内容',
        '格式优化',
        '质量检查'
      ],
      generatedContent: '' // 初始为空，只显示后端返回的真实数据
    }
  },
  computed: {
    userInfo() {
      return {
        name: this.authStore.user?.name || '用户',
        avatar: this.authStore.user?.avatar || ''
      }
    },
    isGenerated() {
      return this.generationStatus === 'completed'
    },
    statusTitle() {
      switch (this.generationStatus) {
        case 'generating':
          return '正在生成文档'
        case 'completed':
          return '文档生成完成'
        case 'error':
          return '生成失败'
        default:
          return '准备生成'
      }
    },
    statusDescription() {
      switch (this.generationStatus) {
        case 'generating':
          return 'AI正在为您生成专业的文档'
        case 'completed':
          return '文档已成功生成，您可以预览和下载'
        case 'error':
          return '文档生成过程中出现错误，请重试'
        default:
          return '点击开始按钮生成文档'
      }
    },
    statusIconClass() {
      switch (this.generationStatus) {
        case 'generating':
          return 'bg-gradient-to-r from-primary to-accent'
        case 'completed':
          return 'bg-gradient-to-r from-success to-info'
        case 'error':
          return 'bg-gradient-to-r from-error to-warning'
        default:
          return 'bg-gradient-to-r from-secondary to-tertiary'
      }
    },
    statusBadgeClass() {
      switch (this.generationStatus) {
        case 'generating':
          return 'badge-warning'
        case 'completed':
          return 'badge-success'
        case 'error':
          return 'badge-error'
        default:
          return 'badge-secondary'
      }
    },
    statusBadgeText() {
      switch (this.generationStatus) {
        case 'generating':
          return '生成中'
        case 'completed':
          return '已完成'
        case 'error':
          return '生成失败'
        default:
          return '待生成'
      }
    },
    formattedContent() {
      if (!this.generatedContent) return ''
      
      // 获取去除标题后的内容
      let content = this.getContentWithoutTitle()
      
      // 如果内容已经是HTML格式，先转换为纯文本
      if (content.includes('<')) {
        content = content.replace(/<[^>]*>/g, '')
      }
      
      // 按段落分割内容
      const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim())
      
      let formattedHtml = ''
      
      paragraphs.forEach((paragraph, index) => {
        const trimmed = paragraph.trim()
        if (!trimmed) return
        
        // 处理一级标题（一、二、三等）
        if (/^[一二三四五六七八九十]+、/.test(trimmed)) {
          formattedHtml += `<h2 class="section-title">${trimmed}</h2>`
        }
        // 处理二级标题（（一）（二）等）
        else if (/^[（(][一二三四五六七八九十]+[）)]/.test(trimmed)) {
          formattedHtml += `<h3 class="subsection-title">${trimmed}</h3>`
        }
        // 处理三级标题（1. 2. 等）
        else if (/^\d+[.、]/.test(trimmed)) {
          formattedHtml += `<h4 class="item-title">${trimmed}</h4>`
        }
        // 处理普通段落
        else {
          // 将段落内的换行转换为<br>
          const formattedParagraph = trimmed.replace(/\n/g, '<br>')
          formattedHtml += `<p class="document-paragraph">${formattedParagraph}</p>`
        }
      })
      
      return formattedHtml
    },
    wordCount() {
      if (this.isEditing) {
        return this.editableContent.length
      }
      // 使用去除标题后的内容计算字数
      const text = this.getContentWithoutTitle().replace(/<[^>]*>/g, '')
      return text.length
    },
    editWordCount() {
      return this.editableContent.length
    },
    lastModifiedText() {
      if (!this.lastModified) return ''
      return `最后修改：${this.formatDate(this.lastModified)}`
    }
  },
  mounted() {
    // 检查是否有从store传递过来的生成内容
    if (this.documentStore.result && this.documentStore.result.content) {
      // 如果有内容，直接显示为已完成状态
      this.generatedContent = this.documentStore.result.content
      // 如果store中有单独保存的标题，直接使用
      if (this.documentStore.result.title) {
        this.documentTitle = this.documentStore.result.title
      }
      this.generationStatus = 'completed'
      this.progress = 100
      this.currentStep = this.generationSteps.length - 1
      
      // 解析文档信息（如果还没有标题的话）
      if (!this.documentTitle) {
        this.parseDocumentInfo()
      }
    } else if (this.documentStore.conversationInfo && this.documentStore.conversationInfo.status === 'pending') {
      // 如果有待处理的生成任务，开始实际生成过程
      this.startRealGeneration()
    }
    // 移除模拟生成逻辑，只处理真实的后端数据
    
    // 添加点击外部关闭菜单的事件监听器
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    // 移除事件监听器
    document.removeEventListener('click', this.handleClickOutside)
    
    // 清除进度定时器
    if (this.progressTimer) {
      clearInterval(this.progressTimer)
      this.progressTimer = null
    }
  },
  methods: {

    
    // 开始实际生成过程
    async startRealGeneration() {
      this.generationStatus = 'generating'
      this.progress = 0
      this.currentStep = 0
      this.generatedContent = ''
      this.startTime = Date.now()
      this.lastUpdateTime = Date.now()
      this.totalExpectedLength = 2000 // 预期文档长度
      
      // 启动进度更新定时器
      this.progressTimer = setInterval(() => {
        if (this.generationStatus === 'generating') {
          this.updateRealProgress()
        }
      }, 1000) // 每秒更新一次
      
      const conversationInfo = this.documentStore.conversationInfo
      
      try {
        await documentService.resumeChat({
          conversation_id: conversationInfo.conversationId,
          content: conversationInfo.checklistContent
        }, {
          onMessage: (chunk) => {
            // 实时更新生成内容
            this.generatedContent += chunk
            
            // 尝试解析文档信息（当有足够内容时）
            if (this.generatedContent.length > 100) {
              this.parseDocumentInfo()
            }
            
            // 更真实的进度计算
            this.updateRealProgress()
          },
          onEnd: (data) => {
            // 清除定时器
            if (this.progressTimer) {
              clearInterval(this.progressTimer)
              this.progressTimer = null
            }
            
            // 生成完成
            this.progress = 100
            this.generationStatus = 'completed'
            this.currentStep = this.generationSteps.length - 1
            this.estimatedTime = '生成完成'
            
            // 最终解析文档信息
            this.parseDocumentInfo()
            
            // 保存最终文档到store
            this.documentStore.updateResult({
              content: this.getContentWithoutTitle(), // 保存去除标题后的内容
              title: this.documentTitle, // 单独保存标题
              conversationId: data.conversation_id,
              messageId: data.message_id,
              generatedAt: new Date().toISOString()
            })
            
            // 清除待处理状态
            this.documentStore.updateGenerationInfo({ status: 'completed' })
            
            // 移除自动跳转逻辑，保持在当前页面
          },
          onError: (error) => {
            // 清除定时器
            if (this.progressTimer) {
              clearInterval(this.progressTimer)
              this.progressTimer = null
            }
            
            console.error('生成文档失败:', error)
            this.generationStatus = 'error'
            this.estimatedTime = '生成失败'
            alert('文档生成失败，请重试：' + (error.message || error))
          }
        })
      } catch (error) {
        // 清除定时器
        if (this.progressTimer) {
          clearInterval(this.progressTimer)
          this.progressTimer = null
        }
        
        console.error('启动生成失败:', error)
        this.generationStatus = 'error'
        this.estimatedTime = '生成失败'
        alert('启动生成失败，请重试：' + (error.message || error))
      }
    },
    
    // 更真实的进度计算
    updateRealProgress() {
      const currentTime = Date.now()
      const elapsedTime = currentTime - this.startTime // 已用时间（毫秒）
      const timeSinceLastUpdate = currentTime - this.lastUpdateTime
      
      // 基于内容长度的基础进度（0-70%）
      const contentProgress = Math.min(70, (this.generatedContent.length / this.totalExpectedLength) * 70)
      
      // 基于时间的进度增量（确保进度持续增长）
      const timeProgress = Math.min(20, elapsedTime / 120000 * 20) // 2分钟内增长20%
      
      // 组合进度，确保不超过90%（留10%给最终处理）
      this.progress = Math.min(90, contentProgress + timeProgress)
      
      // 更新当前步骤
      this.currentStep = Math.floor((this.progress / 100) * this.generationSteps.length)
      
      // 基于实际生成速度计算预计时间
      if (this.generatedContent.length > 50 && elapsedTime > 5000) { // 至少5秒后开始预测
        const generationSpeed = this.generatedContent.length / (elapsedTime / 1000) // 字符/秒
        const remainingChars = Math.max(0, this.totalExpectedLength - this.generatedContent.length)
        const estimatedSeconds = remainingChars / Math.max(generationSpeed, 10) // 最小速度10字符/秒
        
        if (estimatedSeconds > 60) {
          const minutes = Math.ceil(estimatedSeconds / 60)
          this.estimatedTime = `预计还需 ${minutes} 分钟`
        } else if (estimatedSeconds > 10) {
          this.estimatedTime = `预计还需 ${Math.ceil(estimatedSeconds)} 秒`
        } else {
          this.estimatedTime = '即将完成'
        }
      } else {
        // 初始阶段使用固定预估
        const remaining = 100 - this.progress
        if (remaining > 50) {
          this.estimatedTime = '预计还需 2-3 分钟'
        } else if (remaining > 20) {
          this.estimatedTime = '预计还需 1-2 分钟'
        } else if (remaining > 5) {
          this.estimatedTime = '预计还需 30 秒'
        } else {
          this.estimatedTime = '即将完成'
        }
      }
      
      this.lastUpdateTime = currentTime
    },
    
    // 解析文档信息
    parseDocumentInfo() {
      try {
        // 从后端返回的内容中提取标题
        if (this.generatedContent) {
          const extractedTitle = this.extractTitleFromContent(this.generatedContent)
          if (extractedTitle) {
            this.documentTitle = extractedTitle
            return
          }
        }
        
        // 简化逻辑：优先从store获取信息，否则使用默认值
        if (this.documentStore.conversationInfo && this.documentStore.conversationInfo.checklistContent) {
          try {
            const checklistData = JSON.parse(this.documentStore.conversationInfo.checklistContent)
            if (checklistData) {
              this.documentTitle = checklistData.documentTitle || '文档标题'
              return
            }
          } catch (e) {
            console.log('解析清单数据失败，使用默认值')
          }
        }
        
        // 从store中的checklistInfo获取基本信息
        if (this.documentStore.checklistInfo) {
          const storeInfo = this.documentStore.checklistInfo
          this.documentTitle = storeInfo.documentTitle || '文档标题'
        } else {
          // 使用默认值
          this.documentTitle = '文档标题'
        }
      } catch (error) {
        console.error('解析文档信息失败:', error)
      }
    },
    
    // 获取去除标题后的内容
     getContentWithoutTitle() {
       if (!this.generatedContent) return ''
       
       const content = this.generatedContent
       const extractedTitle = this.extractTitleFromContent(content)
       
       if (!extractedTitle) return content
       
       // 移除标题行
       const lines = content.split('\n')
       let contentWithoutTitle = ''
       let titleFound = false
       
       for (let i = 0; i < lines.length; i++) {
         const line = lines[i].trim()
         
         // 如果还没找到标题，检查当前行是否是标题
         if (!titleFound) {
           // 检查是否匹配提取到的标题
           if (line === extractedTitle || 
               line.includes(extractedTitle) || 
               extractedTitle.includes(line)) {
             titleFound = true
             continue // 跳过标题行
           }
           
           // 检查是否是标题格式
           const titlePatterns = [
             /^\s*#{1,6}\s*(.+?)\s*$/,
             /^\s*【(.+?)】/,
             /^\s*《(.+?)》/,
             /^\s*"(.+?)"/,
             /^\s*'(.+?)'/
           ]
           
           let isTitle = false
           for (const pattern of titlePatterns) {
             if (pattern.test(line)) {
               isTitle = true
               break
             }
           }
           
           if (isTitle) {
             titleFound = true
             continue // 跳过标题行
           }
         }
         
         // 如果已经找到标题，或者当前行不是标题，则添加到内容中
         if (titleFound || line.length > 0) {
           contentWithoutTitle += lines[i] + '\n'
         }
       }
       
       return contentWithoutTitle.trim()
     },
     
     // 从内容中提取标题
     extractTitleFromContent(content) {
      if (!content) return null
      
      // 尝试匹配常见的标题格式
      const titlePatterns = [
        /^\s*#{1,6}\s*(.+?)\s*$/m, // Markdown标题
        /^\s*(.+?)\s*$/m, // 第一行作为标题
        /^\s*【(.+?)】/m, // 【标题】格式
        /^\s*《(.+?)》/m, // 《标题》格式
        /^\s*"(.+?)"/m, // "标题"格式
        /^\s*'(.+?)'/m, // '标题'格式
      ]
      
      for (const pattern of titlePatterns) {
        const match = content.match(pattern)
        if (match && match[1] && match[1].trim().length > 0 && match[1].trim().length < 100) {
          return match[1].trim()
        }
      }
      
      // 如果没有匹配到，取第一行非空内容作为标题
      const lines = content.split('\n')
      for (const line of lines) {
        const trimmedLine = line.trim()
        if (trimmedLine && trimmedLine.length < 100) {
          return trimmedLine
        }
      }
      
      return null
    },
    
    // 从内容中提取标题

    
    goBack() {
      this.$router.push('/')
    },
    logout() {
      this.authStore.logout()
      this.$router.push('/login')
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.showUserMenu = false
        this.showDownloadMenu = false
      }
    },
   






    toggleDownloadMenu() {
      this.showDownloadMenu = !this.showDownloadMenu
    },
    downloadDocument(format) {
      this.showDownloadMenu = false
      
      // 获取去除标题后的文档内容
      const documentContent = this.getContentWithoutTitle().replace(/<[^>]*>/g, '') || '暂无文档内容'
      const fileName = `${this.documentTitle || '文档'}_${new Date().toISOString().slice(0, 10)}`
      
      try {
        if (format === 'txt') {
          // 下载纯文本格式
          this.downloadAsText(documentContent, `${fileName}.txt`)
        } else if (format === 'pdf') {
          // 下载PDF格式
          this.downloadAsPDF(documentContent, `${fileName}.pdf`)
        } else if (format === 'docx') {
          // 下载Word格式
          this.downloadAsWord(documentContent, `${fileName}.docx`)
        }
        
        // 显示成功提示
        this.$message.success(`${format.toUpperCase()} 文档下载成功！`)
      } catch (error) {
        console.error('下载失败:', error)
        this.$message.error('下载失败，请重试')
      }
    },
    
    // 下载纯文本文件
    downloadAsText(content, filename) {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      this.triggerDownload(blob, filename)
    },
    
    // 下载PDF文件（需要引入jsPDF库）
    downloadAsPDF(content, filename) {
      // 创建一个简单的HTML内容用于PDF生成
      const htmlContent = `
        <div style="font-family: 'Microsoft YaHei', sans-serif; padding: 40px; line-height: 1.8; color: #333;">
          <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px;">
            <h1 style="color: #1f2937; font-size: 24px; margin: 0;">${this.documentTitle || '文档标题'}</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 14px;">生成日期：${new Date().toLocaleDateString('zh-CN')}</p>
          </div>
          <div style="white-space: pre-wrap; font-size: 14px;">${content}</div>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>本文档由智能助手系统自动生成</p>
          </div>
        </div>
      `
      
      // 使用window.print()方式生成PDF
      const printWindow = window.open('', '_blank')
      printWindow.document.write(`
        <html>
          <head>
            <title>${filename}</title>
            <style>
              @media print {
                body { margin: 0; }
                @page { margin: 1cm; }
              }
            </style>
          </head>
          <body>${htmlContent}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    },
    
    // 下载Word文件（简化版本，生成HTML格式但以.docx扩展名）
    downloadAsWord(content, filename) {
      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
          <head>
            <meta charset='utf-8'>
            <title>${this.documentTitle || '文档标题'}</title>
            <style>
              body { font-family: '宋体', SimSun, serif; font-size: 12pt; line-height: 1.5; margin: 2cm; }
              h1 { text-align: center; font-size: 18pt; font-weight: bold; margin-bottom: 20pt; }
              .header { text-align: center; margin-bottom: 30pt; border-bottom: 2pt solid #000; padding-bottom: 10pt; }
              .content { white-space: pre-wrap; text-align: justify; }
              .footer { margin-top: 30pt; padding-top: 10pt; border-top: 1pt solid #ccc; text-align: center; font-size: 10pt; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${this.documentTitle || '文档标题'}</h1>
              <p>生成日期：${new Date().toLocaleDateString('zh-CN')}</p>
            </div>
            <div class="content">${content}</div>
            <div class="footer">
              <p>本文档由智能助手系统自动生成</p>
            </div>
          </body>
        </html>
      `
      
      const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' })
      this.triggerDownload(blob, filename)
    },
    
    // 触发文件下载
    triggerDownload(blob, filename) {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
    formatDate(date) {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    

    
    // 编辑功能相关方法
    startEdit() {
      this.isEditing = true
      this.editableTitle = this.documentTitle
      // 使用去除标题后的内容进行编辑
      this.editableContent = this.getContentWithoutTitle().replace(/<[^>]*>/g, '') // 移除HTML标签
      this.hasUnsavedChanges = false
    },
    
    saveEdit() {
      if (!this.editableTitle.trim()) {
        this.$message.warning('文档标题不能为空')
        return
      }
      
      if (!this.editableContent.trim()) {
        this.$message.warning('文档内容不能为空')
        return
      }
      
      // 保存编辑内容
      this.documentTitle = this.editableTitle.trim()
      // 将纯文本转换为HTML格式
      this.generatedContent = this.formatTextToHtml(this.editableContent.trim())
      this.lastModified = new Date()
      this.isEditing = false
      this.hasUnsavedChanges = false
      
      this.$message.success('文档保存成功！')
    },
    
    cancelEdit() {
      if (this.hasUnsavedChanges) {
        this.$confirm('您有未保存的更改，确定要取消编辑吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '继续编辑',
          type: 'warning'
        }).then(() => {
          this.isEditing = false
          this.hasUnsavedChanges = false
          this.editableTitle = ''
          this.editableContent = ''
        })
      } else {
        this.isEditing = false
        this.editableTitle = ''
        this.editableContent = ''
      }
    },
    
    onContentChange() {
      this.hasUnsavedChanges = true
    },
    
    formatTextToHtml(text) {
      // 简单的文本到HTML转换
      return text
        .split('\n\n')
        .map(paragraph => {
          if (paragraph.trim().startsWith('一、') || 
              paragraph.trim().startsWith('二、') || 
              paragraph.trim().startsWith('三、') ||
              paragraph.trim().startsWith('四、') ||
              paragraph.trim().startsWith('五、')) {
            return `<h3>${paragraph.trim()}</h3>`
          }
          return `<p>${paragraph.trim()}</p>`
        })
        .join('\n')
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
.prose h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #3b82f6;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose p {
  margin-bottom: 1rem;
  color: #6b7280;
  line-height: 1.625;
}

/* 政务公文样式 */
.document-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  color: #1f2937;
  margin: 2rem 0 1.5rem 0;
  line-height: 1.4;
  font-family: 'Microsoft YaHei', '微软雅黑', sans-serif;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin: 1.5rem 0 0.75rem 0;
  text-indent: 0;
  line-height: 1.5;
}

.subsection-title {
  font-size: 1rem;
  font-weight: 500;
  color: #4b5563;
  margin: 1rem 0 0.5rem 1rem;
  line-height: 1.5;
}

.item-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0.75rem 0 0.25rem 2rem;
  line-height: 1.5;
}

.document-info {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0.5rem 0;
  text-align: right;
  line-height: 1.5;
}

.document-date {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 1rem 0;
  text-align: right;
  line-height: 1.5;
}

.document-paragraph {
  font-size: 1rem;
  color: #374151;
  line-height: 1.8;
  margin: 1rem 0;
  text-indent: 2em;
  text-align: justify;
  word-break: break-word;
  hyphens: auto;
}

/* 确保文档内容区域有合适的内边距和背景 */
.prose {
  max-width: none;
  padding: 2rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.animate-slideInFromTop {
  animation: slideInFromTop 0.2s ease-out;
}

@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 下拉菜单动画 */
.animate-fadeIn {
  animation: fadeInDown 0.3s ease-out;
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 悬停效果增强 */
.group:hover .group-hover\:shadow-red-200 {
  box-shadow: 0 10px 25px -3px rgba(239, 68, 68, 0.3), 0 4px 6px -2px rgba(239, 68, 68, 0.05);
}

.group:hover .group-hover\:shadow-blue-200 {
  box-shadow: 0 10px 25px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.05);
}

.group:hover .group-hover\:shadow-gray-200 {
  box-shadow: 0 10px 25px -3px rgba(107, 114, 128, 0.3), 0 4px 6px -2px rgba(107, 114, 128, 0.05);
}

/* 背景模糊效果 */
.backdrop-blur-xl {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* 编辑模式样式 */
.edit-toolbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.edit-input {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
}

.edit-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
}

.edit-input::selection {
  background: rgba(102, 126, 234, 0.2);
  text-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.edit-input::-moz-selection {
  background: rgba(102, 126, 234, 0.2);
  text-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.edit-textarea {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  min-height: 400px;
  font-family: 'Microsoft YaHei', sans-serif;
  transition: all 0.3s ease;
  background: white;
}

.edit-textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
}

.edit-textarea::selection {
  background: rgba(102, 126, 234, 0.2);
  text-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.edit-textarea::-moz-selection {
  background: rgba(102, 126, 234, 0.2);
  text-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.edit-stats {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #64748b;
}

.btn-edit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-save {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.btn-save:hover {
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.btn-cancel {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.btn-cancel:hover {
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

.unsaved-indicator {
  color: #f59e0b;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.unsaved-indicator::before {
  content: '●';
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 自定义阴影 */
.shadow-\[0_20px_25px_-5px_rgba\(0\,0\,0\,0\.1\)\,0_10px_10px_-5px_rgba\(0\,0\,0\,0\.04\)\] {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>