<template>
  <div class="min-h-screen bg-gradient-to-br from-bg-primary to-bg-secondary">
    <!-- 顶部导航栏 -->
    <nav class="gov-header">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center space-x-3">
              <!-- 政务智能助手图标 -->
              <GovIcon size="sm" />
              <h1 class="text-xl font-semibold text-primary">政务智能助手</h1>
            </div>
          </div>
        
           
          <div class="flex items-center space-x-4">
            <!-- 历史记录按钮 -->
            <button 
              @click="goToHistory"
              class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-secondary hover:text-primary hover:bg-bg-secondary rounded-lg transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              历史记录
            </button>
            
            <!-- 知识库按钮 -->
            <button 
              @click="goToKnowledgeBase"
              class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-secondary hover:text-primary hover:bg-bg-secondary rounded-lg transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              知识库
            </button>
            
            <!-- 用户头像下拉菜单 -->
            <UserAvatar 
              @logout="logout"
            />
          </div>
        </div>
      </div>
    </nav>

    <!-- 左侧历史记录面板 -->
    <div 
      v-if="showHistoryPanel"
      class="fixed inset-0 z-40 flex"
    >
      <!-- 背景遮罩 -->
      <div 
        @click="showHistoryPanel = false"
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      ></div>
      
      <!-- 侧边面板 -->
      <div class="relative flex flex-col w-80 bg-white shadow-xl">
        <!-- 面板头部 -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">历史记录</h2>
          <button 
            @click="showHistoryPanel = false"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- 新建公文按钮 -->
        <div class="p-4 border-b border-gray-200">
          <button 
            @click="createNewDocument"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            新建公文
          </button>
        </div>
        
        <!-- 历史记录列表 -->
        <div class="flex-1 overflow-y-auto p-4">
          <div class="space-y-3">
            <div 
              v-for="doc in recentDocuments" 
              :key="doc.id"
              class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              @click="openDocument(doc)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-gray-900 line-clamp-1">{{ doc.title }}</h3>
                  <p class="text-xs text-gray-500 mt-1">{{ doc.type }} · {{ formatDate(doc.createdAt) }}</p>
                  <div class="flex items-center mt-2">
                    <span 
                      :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        doc.status === '已完成' ? 'bg-green-100 text-green-800' :
                        doc.status === '草稿' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      ]"
                    >
                      {{ doc.status }}
                    </span>
                  </div>
                </div>
                <button 
                  @click.stop="deleteDocument(doc)"
                  class="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-if="recentDocuments.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">暂无历史记录</h3>
            <p class="mt-1 text-sm text-gray-500">开始创建您的第一个公文</p>
          </div>
        </div>
        
        <!-- 查看全部按钮 -->
        <div class="p-4 border-t border-gray-200">
          <button 
            @click="viewAllHistory"
            class="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            查看全部历史记录
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- 欢迎区域 -->
      <div class="px-4 py-6 sm:px-0">
        <div class="max-w-2xl mx-auto">
          <div class="gov-card animate-fadeIn">
            <div class="card-body">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h2 class="text-3xl font-bold text-primary mb-3">
                    创建您的公文
                  </h2>
                  <p class="text-gray-600 text-lg">
                    填写下方表单以生成您的正式公文，AI将为您提供专业的文档生成服务。
                  </p>
                </div>
                <div class="hidden md:block">
                  <GovIcon size="xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 表单区域 -->
      <div class="px-4 sm:px-0">
        <div class="max-w-2xl mx-auto">
          <div class="gov-card">
            <div class="card-body">
              <form @submit.prevent="generateDocument" class="space-y-8">
                <!-- 公文类型 -->
                <div>
                  <label class="block text-sm font-medium text-primary mb-2" for="document-type">公文类型</label>
                  <select 
                    v-model="formData.documentType" 
                    class="gov-input" 
                    id="document-type" 
                    name="document-type"
                  >
                    <option value="">选择公文类型</option>
                    <option value="通知">通知</option>
                    <option value="通报">通报</option>
                    <option value="公告">公告</option>
                    <option value="通告">通告</option>
                    <option value="决定">决定</option>
                    <option value="命令">命令</option>
                    <option value="意见">意见</option>
                    <option value="请示">请示</option>
                    <option value="报告">报告</option>
                    <option value="批复">批复</option>
                    <option value="议案">议案</option>
                    <option value="会议纪要">会议纪要</option>
                  </select>
                </div>

                <!-- 具体要求/说明 -->
                <div>
                  <label class="block text-sm font-medium text-primary mb-2" for="information">具体要求/说明</label>
                  <textarea 
                    v-model="formData.information" 
                    class="gov-textarea" 
                    id="information" 
                    name="information" 
                    placeholder="例如：'请帮我生成一篇会议纪要'，地点：上海分公司，时间：2025.10.12，主题：股东大会" 
                    rows="6"
                  ></textarea>
                </div>

                <!-- 特殊要求 -->
                <div>
                  <label class="block text-sm font-medium text-primary mb-2" for="requests">特殊要求</label>
                  <textarea 
                    v-model="formData.requests" 
                    class="gov-textarea" 
                    id="requests" 
                    name="requests" 
                    placeholder="例如：'语气严肃一点'、'使用正式用词'、'突出重点内容'、'自定义特定风格'、'字数限制'等等" 
                    rows="3"
                  ></textarea>
                </div>

                <!-- 现有信息/参考资料 -->
                <div>
                  <label class="block text-sm font-medium text-primary mb-2">现有信息/参考资料</label>
                  
                  <!-- 文件上传区域 -->
                  <div 
                    class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer"
                    :class="{
                      'border-primary bg-primary/10': isDragOver,
                      'border-gray-300': !isDragOver
                    }"
                    @click="$refs.fileInput.click()"
                    @dragover.prevent="isDragOver = true"
                    @dragleave.prevent="isDragOver = false"
                    @drop.prevent="handleFileDrop"
                  >
                    <input 
                      ref="fileInput"
                      type="file" 
                      class="hidden"
                      @change="handleFileSelect"
                      accept=".doc,.docx,.pdf,.txt,.md,.rtf,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                      multiple
                    >
                    
                    <div v-if="formData.uploadedFiles.length === 0" class="space-y-4">
                      <div class="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mx-auto">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                      </div>
                      <div>
                        <p class="text-lg font-semibold text-primary mb-2">点击上传或拖拽文件到此处</p>
                        <p class="text-sm text-secondary">支持 DOC, DOCX, PDF, TXT, MD, RTF, JPG, PNG, GIF 等格式</p>
                        <p class="text-xs text-gray-400 mt-1">最大文件大小: 50MB</p>
                      </div>
                      <button 
                        type="button"
                        class="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-accent text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        <span>选择文件</span>
                      </button>
                    </div>
                  </div>
                  
                  <!-- 已上传文件列表 -->
                  <div v-if="formData.uploadedFiles.length > 0" class="mt-4 space-y-3">
                    <div class="flex items-center justify-between text-sm text-secondary mb-2">
                      <span>已上传文件 ({{ formData.uploadedFiles.length }})</span>
                      <button 
                        type="button"
                        @click="$refs.fileInput.click()"
                        class="text-primary hover:text-accent transition-colors duration-200 font-medium"
                      >
                        + 添加更多文件
                      </button>
                    </div>
                    
                    <div 
                      v-for="file in formData.uploadedFiles" 
                      :key="file.id"
                      class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary/30 transition-all duration-200"
                    >
                      <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                          <span class="text-lg">{{ getFileIcon(file.type) }}</span>
                        </div>
                        <div>
                          <p class="font-medium text-primary text-sm">{{ file.name }}</p>
                          <p class="text-xs text-secondary">{{ formatFileSize(file.size) }}</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        @click="removeFile(file.id)"
                        class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="删除文件"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 生成按钮 -->
                <div class="flex justify-end pt-4">
                  <button 
                    type="button"
                    @click="goToNextStep"
                    :disabled="isLoading"
                    class="gov-button w-full sm:w-auto"
                  >
                    <span v-if="!isLoading">下一步</span>
                    <span v-else class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      处理中...
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="gov-footer mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-secondary text-sm">
        <p>© 2025 政务智能助手. 保留所有权利。</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDocumentStore } from '@/store/document'
import { useAuthStore } from '@/store/auth'
import { fileService, historyService } from '@/services/file'
import { documentService } from '@/services/document'
import UserAvatar from '@/components/UserAvatar.vue'
import GovIcon from '@/components/GovIcon.vue'

const router = useRouter()
const documentStore = useDocumentStore()
const authStore = useAuthStore()

const isLoading = ref(false)
const showUserMenu = ref(false)
const showHistoryPanel = ref(false)

// 用户信息
const userInfo = computed(() => ({
  name: authStore.user?.name || authStore.user?.username || '用户',
  title: authStore.user?.role || authStore.user?.department || '职位',
  avatar: authStore.user?.avatar || ''
}))

// 生成随机头像颜色
const generateAvatarColor = () => {
  const colors = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#8B5CF6', // violet-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#06B6D4', // cyan-500
    '#84CC16', // lime-500
    '#F97316', // orange-500
    '#EC4899', // pink-500
    '#6366F1'  // indigo-500
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

const avatarColor = ref(generateAvatarColor())

// 最近的文档记录
const recentDocuments = ref([
  {
    id: 1,
    title: '关于加强疫情防控工作的通知',
    type: '通知',
    status: '已完成',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    title: '2024年度工作计划报告',
    type: '报告',
    status: '草稿',
    createdAt: new Date('2024-01-10')
  },
  {
    id: 3,
    title: '关于召开年度工作会议的函',
    type: '函',
    status: '已发布',
    createdAt: new Date('2024-01-08')
  }
])

const formData = reactive({
  documentType: '',
  instructions: '',
  requests: '', // 新增要求字段
  information: '',
  uploadedFiles: [],
  uploadingFiles: new Map(), // 正在上传的文件状态
  useKnowledgeBase: false,
  knowledgeBaseId: ''
})

// 文件上传相关
const fileInput = ref(null)
const isDragOver = ref(false)

const generateDocument = async () => {
  if (!formData.documentType) {
    alert('请选择公文类型')
    return
  }
  
  if (!formData.information.trim()) {
    alert('请填写具体要求/说明')
    return
  }

  isLoading.value = true
  
  try {
    // 保存表单数据到store
    documentStore.setBasicInfo({
      documentType: formData.documentType,
      instructions: formData.information,
      existingInfo: formData.existingInfo
    })
    
    // 跳转到信息清单页面
    await router.push('/document/checklist')
  } catch (error) {
    console.error('生成公文失败:', error)
    alert('生成公文失败，请重试')
  } finally {
    isLoading.value = false
  }
}

// 文件上传处理方法
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
}

const handleFileDrop = (event) => {
  isDragOver.value = false
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

const processFiles = async (files) => {
  const allowedTypes = ['.doc', '.docx', '.pdf', '.txt', '.md', '.rtf', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
  const maxSize = 50 * 1024 * 1024 // 50MB
  
  for (const file of files) {
    // 检查文件类型
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    if (!allowedTypes.includes(fileExtension)) {
      alert(`不支持的文件类型：${file.name}。支持的格式：${allowedTypes.join(', ')}`)
      continue
    }
    
    // 检查文件大小
    if (file.size > maxSize) {
      alert(`文件 ${file.name} 超过50MB大小限制`)
      continue
    }
    
    // 检查是否已存在
    if (formData.uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
      alert(`文件 ${file.name} 已存在`)
      continue
    }
    
    // 开始上传文件
    const fileId = Date.now() + Math.random()
    
    // 添加到上传中状态
    formData.uploadingFiles.set(fileId, {
      name: file.name,
      progress: 0,
      status: 'uploading'
    })
    
    try {
      const result = await fileService.uploadFile(file, (progress) => {
        const uploadingFile = formData.uploadingFiles.get(fileId)
        if (uploadingFile) {
          uploadingFile.progress = progress
        }
      })
      
      if (result.success) {
        // 上传成功，添加到已上传文件列表
        formData.uploadedFiles.push({
          id: fileId,
          file: file,
          name: file.name,
          size: file.size,
          type: fileExtension,
          file_id: `data/static/${result.data.url}`, // 构建完整的相对路径
          url: result.data.url,
          original_file_id: result.data.file_id // 保留原始的file_id用于其他用途
        })
        
        // 从上传中状态移除
        formData.uploadingFiles.delete(fileId)
      } else {
        // 上传失败
        alert(`文件 ${file.name} 上传失败：${result.message}`)
        formData.uploadingFiles.delete(fileId)
      }
    } catch (error) {
      console.error('文件上传错误:', error)
      alert(`文件 ${file.name} 上传失败`)
      formData.uploadingFiles.delete(fileId)
    }
  }
  
  // 清空文件输入
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const validateAndAddFiles = processFiles

const removeFile = (fileId) => {
  const index = formData.uploadedFiles.findIndex(f => f.id === fileId)
  if (index > -1) {
    formData.uploadedFiles.splice(index, 1)
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const getFileIcon = (type) => {
  const icons = {
    '.pdf': '📄',
    '.doc': '📝',
    '.docx': '📝',
    '.txt': '📄',
    '.md': '📄',
    '.rtf': '📝',
    '.jpg': '🖼️',
    '.jpeg': '🖼️',
    '.png': '🖼️',
    '.gif': '🖼️',
    '.bmp': '🖼️',
    '.webp': '🖼️'
  }
  return icons[type] || '📄'
}

const goToNextStep = async () => {
   if (!formData.documentType) {
     alert('请选择公文类型')
     return
   }
   
   if (!formData.information.trim()) {
     alert('请填写具体要求/说明')
     return
   }

   // 检查是否有文件正在上传
   if (formData.uploadingFiles.size > 0) {
     alert('请等待文件上传完成后再提交')
     return
   }
 
   isLoading.value = true
   
   try {
     // 准备API请求参数
     const requestParams = {
       documenttype: formData.documentType,
       information: formData.information || '',
       requests: formData.requests || '', // 使用新的特殊要求字段
       use_knowledge_base: formData.useKnowledgeBase,
       knowledge_base_id: formData.knowledgeBaseId,
       references: formData.uploadedFiles.map(file => ({
         type: 'file',
         file_id: file.file_id
       }))
     }
     
     console.log('API请求参数:', requestParams)
     
     // 保存基本信息到store
     documentStore.updateBasicInfo({
       documentType: formData.documentType,
       requirements: formData.information, // 使用information作为主要需求描述
       requests: formData.requests, // 保存特殊要求
       information: formData.information,
       uploadedFiles: formData.uploadedFiles,
       useKnowledgeBase: formData.useKnowledgeBase,
       knowledgeBaseId: formData.knowledgeBaseId
     })
     
     // 调用API获取内容清单
     let checklistContent = ''
     let conversationId = ''
     let messageId = ''
     let hasReceivedData = false
     
     const result = await documentService.chatCompletions(requestParams, {
       onMessage: (chunk) => {
         // 处理流式消息
         console.log('收到消息片段:', chunk)
         hasReceivedData = true
       },
       onInterrupt: (data) => {
         // 处理中断事件，获取内容清单
         console.log('收到内容清单:', data)
         checklistContent = data.content
         conversationId = data.conversation_id
         messageId = data.message_id
         hasReceivedData = true
         
         // 保存会话信息到store
         documentStore.setConversationInfo({
           conversationId,
           messageId,
           checklistContent
         })
       },
       onEnd: (data) => {
         console.log('对话结束:', data)
         if (data.conversation_id) {
           conversationId = data.conversation_id
           messageId = data.message_id
         }
         hasReceivedData = true
       },
       onError: (error) => {
         console.error('API调用错误:', error)
         throw error
       }
     })
     
     if (result.success && hasReceivedData) {
       // 跳转到信息清单页面
       await router.push('/document/checklist')
     } else {
       throw new Error(result.error || '未收到服务器响应，请重试')
     }
   } catch (error) {
     console.error('处理失败:', error)
     alert('处理失败，请重试：' + (error.message || error))
   } finally {
     isLoading.value = false
   }
 }

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleHistoryPanel = () => {
  showHistoryPanel.value = !showHistoryPanel.value
}

const goToHistory = async () => {
  try {
    await router.push('/history')
  } catch (error) {
    console.error('跳转到历史记录页面失败:', error)
  }
}

const goToKnowledgeBase = async () => {
  try {
    await router.push('/knowledge-base')
  } catch (error) {
    console.error('跳转到知识库页面失败:', error)
  }
}

const openSettings = async () => {
  showUserMenu.value = false
  try {
    await router.push('/settings')
  } catch (error) {
    console.error('跳转到设置页面失败:', error)
  }
}

const logout = async () => {
  showUserMenu.value = false
  if (confirm('确定要退出登录吗？')) {
    try {
      // 清除所有用户相关的本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('userName')
      localStorage.removeItem('userPosition')
      localStorage.removeItem('userAvatar')
      
      // 强制跳转到登录页面
      window.location.href = '/login'
    } catch (error) {
      console.error('退出登录失败:', error)
      // 如果路由跳转失败，直接刷新页面到登录页
      window.location.href = '/login'
    }
  }
}

const createNewDocument = () => {
  showHistoryPanel.value = false
  router.push('/document/checklist')
}

const openDocument = (doc) => {
  showHistoryPanel.value = false
  // 根据文档状态跳转到不同页面
  if (doc.status === '草稿') {
    router.push('/document/checklist')
  } else {
    router.push('/document/generation')
  }
}

const deleteDocument = (doc) => {
  if (confirm(`确定要删除文档"${doc.title}"吗？`)) {
    const index = recentDocuments.value.findIndex(d => d.id === doc.id)
    if (index > -1) {
      recentDocuments.value.splice(index, 1)
      alert('文档删除成功！')
    }
  }
}

const viewAllHistory = () => {
  showHistoryPanel.value = false
  router.push('/history')
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit'
  })
}

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  authStore.initializeAuth()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 自定义样式已通过Tailwind CSS类实现 */
</style>