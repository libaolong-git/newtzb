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
              <!-- 政务智能助手图标 -->
              <div class="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h1 class="text-xl font-semibold text-primary">政务智能助手 - 公文结果</h1>
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
        <!-- 操作工具栏 -->
        <div class="mb-6 animate-fadeIn">
          <div class="gov-card">
            <div class="card-body">
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                    <span class="text-sm font-medium text-primary">文档已生成完成</span>
                  </div>
                  <div class="text-sm text-secondary">
                    生成时间：{{ formatDate(document.createdAt) }}
                  </div>
                </div>
                <!-- 工具栏现在为空，按钮已移动到文档内容区域 -->
                <div class="flex items-center space-x-3">
                  <!-- 下载按钮 -->
                  <div v-if="!isEditMode" class="relative">
                    <button
                      @click="toggleDownloadMenu"
                      class="gov-button flex items-center justify-center space-x-2 px-4 py-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span class="font-semibold">下载文档</span>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    
                    <!-- 下载菜单 -->
                    <div v-if="showDownloadMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border z-50">
                      <div class="py-2">
                        <button @click="downloadAs('pdf')" class="w-full text-left px-4 py-2 text-sm text-secondary hover:bg-bg-secondary hover:text-primary transition-colors">
                          <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                          </svg>
                          下载为 PDF
                        </button>
                        <button @click="downloadAs('docx')" class="w-full text-left px-4 py-2 text-sm text-secondary hover:bg-bg-secondary hover:text-primary transition-colors">
                          <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                          </svg>
                          下载为 Word
                        </button>
                        <button @click="downloadAs('txt')" class="w-full text-left px-4 py-2 text-sm text-secondary hover:bg-bg-secondary hover:text-primary transition-colors">
                          <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                          </svg>
                          下载为 TXT
                        </button>
                        <hr class="my-2 border-border">
                        <button @click="downloadAll()" class="w-full text-left px-4 py-2 text-sm text-primary hover:bg-bg-secondary font-medium transition-colors">
                          <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                          下载全部格式
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 主要内容网格 -->
        <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <!-- 文档预览/编辑区域 -->
          <div class="xl:col-span-3">
            <div class="gov-card animate-slideInFromLeft">
              <!-- 文档头部 -->
              <div class="card-header">
                <div class="flex items-center justify-between">
                  <div>
                    <h1 v-if="!isEditMode" class="text-2xl font-bold text-primary">{{ document.title }}</h1>
                    <input 
                      v-else
                      v-model="editableDocument.title"
                      @input="markAsChanged"
                      class="text-2xl font-bold text-primary bg-transparent border-none outline-none focus:bg-bg-secondary rounded px-2 py-1 w-full"
                      placeholder="请输入文档标题"
                    >

                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="badge badge-success">已完成</span>
                    <span class="text-sm text-secondary">{{ wordCount }} 字</span>
                  </div>
                </div>
              </div>

              <!-- 工具栏 -->
              <div class="toolbar">
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center space-x-4">
                    <!-- 编辑模式切换按钮 -->
                    <button
                      @click="toggleEditMode"
                      class="gov-button flex items-center justify-center space-x-2 px-4 py-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      <span class="font-semibold">{{ isEditMode ? '退出编辑' : '编辑文档' }}</span>
                    </button>
                    
                    <!-- 编辑模式下的保存和取消按钮 -->
                    <div v-if="isEditMode" class="flex items-center space-x-2">
                      <button
                        @click="saveDocument"
                        class="gov-button flex items-center justify-center space-x-2 px-4 py-2"
                        :disabled="isSaving || !hasChanges"
                      >
                        <svg v-if="isSaving" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                        </svg>
                        <span class="font-semibold">{{ isSaving ? '保存中...' : '保存修改' }}</span>
                      </button>

                    </div>
                  </div>

                </div>
              </div>
              
              <!-- 文档内容 -->
              <div class="card-body">
                <!-- 预览模式 -->
                <div v-if="!isEditMode" class="document-preview">
                  <!-- 文档正文 -->
                  <div class="prose prose-lg max-w-none text-secondary leading-relaxed bg-white rounded-lg p-6 border border-border">
                    <div v-html="document.content"></div>
                  </div>
                </div>

                <!-- 编辑模式 -->
                <div v-else class="document-editor">
                  <div class="prose prose-lg max-w-none text-secondary leading-relaxed mb-10 bg-white rounded-lg border border-border">
                    <div class="p-6">
                      <div class="space-y-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">文档标题</label>
                          <input v-model="editableDocument.title" @input="markAsChanged" class="edit-input w-full" placeholder="请输入文档标题">
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">文档内容</label>
                          <textarea v-model="editableContent" @input="markAsChanged" class="edit-textarea w-full" placeholder="请输入文档内容"></textarea>
                        </div>
                        <div class="edit-stats">
                          <span>字数统计: {{ editWordCount }} 字</span>
                          <span v-if="hasChanges" class="unsaved-indicator">未保存的更改</span>
                          <span v-if="document.updatedAt">{{ lastModifiedText }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 侧边栏 -->
          <div class="xl:col-span-1 space-y-6">
            <!-- 文档信息 -->
            <div class="gov-card animate-slideInFromRight">
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
                  <span class="text-sm text-secondary">状态</span>
                  <span class="badge badge-success">已完成</span>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDocumentStore } from '@/store/document'
import { useAuthStore } from '@/store/auth'
import { documentService } from '@/services/document'
import html2pdf from 'html2pdf.js'

const router = useRouter()
const documentStore = useDocumentStore()
const authStore = useAuthStore()

const showUserMenu = ref(false)
const showDownloadMenu = ref(false)
const isEditMode = ref(false)
const isSaving = ref(false)
const hasChanges = ref(false)
const editableContent = ref('')

// 可编辑的文档数据
const editableDocument = reactive({
  title: '',
  content: ''
})

// 文档数据
const document = computed(() => {
  const result = documentStore.result
  if (result && result.content) {
    return {
      id: result.conversationId || 'doc-001',
      title: extractTitleFromContent(result.content) || '文档标题',
      content: formatContentForDisplay(result.content),
      createdAt: new Date(result.generatedAt || Date.now()),
      updatedAt: null
    }
  }
  
  // 默认文档数据
  return {
    id: 'doc-001',
    title: '疫情防控工作说明',
    content: getDefaultContent(),
    createdAt: new Date(),
    updatedAt: null
  }
})

// 用户信息
const userInfo = computed(() => ({
  name: authStore.user?.name || authStore.user?.username || '用户',
  avatar: authStore.user?.avatar || ''
}))

// 字数统计
const wordCount = computed(() => {
  const content = isEditMode.value ? editableContent.value : document.value.content
  const text = content ? content.replace(/<[^>]*>/g, '') : ''
  return text.length
})

// 编辑模式字数统计
const editWordCount = computed(() => {
  return editableContent.value ? editableContent.value.length : 0
})

// 最后修改时间文本
const lastModifiedText = computed(() => {
  if (document.value.updatedAt) {
    return `最后修改：${formatDate(document.value.updatedAt)}`
  }
  return ''
})

// 从内容中提取标题
const extractTitleFromContent = (content) => {
  if (!content) return ''
  
  // 尝试匹配常见的标题格式
  const titlePatterns = [
    /关于(.+?)的通知/,
    /关于(.+?)的通告/,
    /关于(.+?)的公告/,
    /(.+?)通知/,
    /(.+?)公告/,
    /(.+?)通告/
  ]
  
  for (const pattern of titlePatterns) {
    const match = content.match(pattern)
    if (match) {
      return match[0]
    }
  }
  
  // 如果没有匹配到，取第一行作为标题
  const firstLine = content.split('\n')[0].trim()
  return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine
}



// 格式化内容用于显示
const formatContentForDisplay = (content) => {
  if (!content) return ''
  
  // 移除可能的元数据行
  const lines = content.split('\n')
  const filteredLines = lines.filter(line => {
    const trimmed = line.trim()
    return !trimmed.startsWith('收文单位：') && 
           !trimmed.startsWith('发文单位：') && 
           !trimmed.startsWith('主送单位：') &&
           !trimmed.startsWith('发文机关：') &&
           !trimmed.startsWith('签发人：') &&
           !trimmed.startsWith('此致') &&
           !trimmed.includes('电子签名') &&
           !trimmed.includes('政务部门')
  })
  
  return formatTextToHtml(filteredLines.join('\n'))
}



// 初始化页面数据
const initializeData = () => {
  // 检查是否有生成的文档
  if (!documentStore.result || !documentStore.result.content) {
    // 如果没有文档内容，返回首页
    alert('未找到生成的文档，请重新开始')
    router.push('/')
    return
  }
  
  initializeEditableDocument()
}

// 初始化可编辑文档
const initializeEditableDocument = () => {
  editableDocument.title = document.value.title
  editableContent.value = document.value.content ? document.value.content.replace(/<[^>]*>/g, '') : ''
}

// 监听文档变化
watch(() => documentStore.result, (newResult) => {
  if (newResult && newResult.content) {
    initializeEditableDocument()
  }
}, { immediate: true })
// 切换编辑模式
const toggleEditMode = () => {
  if (isEditMode.value && hasChanges.value) {
    if (confirm('您有未保存的修改，是否要保存？')) {
      saveDocument()
    } else {
      initializeEditableDocument()
      hasChanges.value = false
    }
  } else if (!isEditMode.value) {
    initializeEditableDocument()
  }
  isEditMode.value = !isEditMode.value
}

// 取消编辑
const cancelEdit = () => {
  if (hasChanges.value) {
    if (confirm('您有未保存的修改，确定要取消编辑吗？')) {
      initializeEditableDocument()
      hasChanges.value = false
      isEditMode.value = false
    }
  } else {
    isEditMode.value = false
  }
}

// 标记有更改
const markAsChanged = () => {
  hasChanges.value = true
}

// 保存文档
const saveDocument = async () => {
  if (!editableDocument.title || !editableDocument.title.trim()) {
    alert('文档标题不能为空')
    return
  }
  
  if (!editableContent.value || !editableContent.value.trim()) {
    alert('文档内容不能为空')
    return
  }
  
  isSaving.value = true
  try {
    // 如果有conversationId和messageId，调用编辑API
    if (documentStore.conversationInfo.conversationId && documentStore.conversationInfo.messageId) {
      const editPrompt = `请根据以下修改要求更新文档：\n标题：${editableDocument.title}\n内容：${editableContent.value}`
      
      await documentService.editDocument(
        documentStore.conversationInfo.conversationId,
        documentStore.conversationInfo.messageId,
        editPrompt
      )
    }
    
    // 更新本地文档数据
    documentStore.setResult({
      ...documentStore.result,
      content: formatTextToHtml(editableContent.value),
      title: editableDocument.title,
      updatedAt: new Date().toISOString()
    })
    
    hasChanges.value = false
    isEditMode.value = false
    alert('文档保存成功！')
  } catch (error) {
    console.error('保存文档失败:', error)
    alert('保存失败，请重试')
  } finally {
    isSaving.value = false
  }
}

// 切换下载菜单
const toggleDownloadMenu = () => {
  showDownloadMenu.value = !showDownloadMenu.value
}
    
// 下载文档
const downloadAs = async (format) => {
  showDownloadMenu.value = false
  
  try {
    const fileName = document.value.title || '政务文档'
    
    // 获取文档内容，确保不为空
    let documentContent = document.value.content || getDefaultContent()
    
    if (format === 'txt') {
      // TXT格式使用纯文本
      const plainTextContent = getPlainTextContent()
      downloadAsText(plainTextContent, `${fileName}.txt`)
    } else if (format === 'pdf') {
      // PDF格式保持HTML格式
      console.log('准备生成PDF，内容长度:', documentContent.length)
      downloadAsPDF(documentContent, `${fileName}.pdf`)
    } else if (format === 'docx') {
      // Word格式保持HTML格式
      downloadAsWord(documentContent, `${fileName}.docx`)
    }
    
    alert(`${format.toUpperCase()} 文档下载成功！`)
  } catch (error) {
    console.error('下载失败:', error)
    alert('下载失败，请重试')
  }
}

// 下载全部格式
const downloadAll = async () => {
  showDownloadMenu.value = false
  
  const formats = ['pdf', 'docx', 'txt']
  for (let i = 0; i < formats.length; i++) {
    setTimeout(() => {
      downloadAs(formats[i])
    }, i * 500)
  }
  
  alert('正在下载全部格式文档...')
}
    
// 获取纯文本内容（去除HTML标签）
const getPlainTextContent = () => {
  // 获取文档内容，如果为空则使用默认内容
  const content = document.value.content || getDefaultContent()
  
  if (!content) return '暂无内容'
  
  // 创建临时DOM元素来解析HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = content
  
  // 获取纯文本内容
  let textContent = tempDiv.textContent || tempDiv.innerText || ''
  
  // 清理多余的空白字符并保持段落结构
  textContent = textContent.replace(/\s+/g, ' ').trim()
  
  // 如果仍然为空，返回默认文本
  if (!textContent) {
    return '本文档由政务助手系统生成，包含重要的政务信息和通知内容。'
  }
  
  return textContent
}

// 下载纯文本文件
const downloadAsText = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  triggerDownload(blob, filename)
}
    
// 下载PDF文件
const downloadAsPDF = (content, filename) => {
  // 确保content不为空，如果为空则使用完整的文档内容
  if (!content || content.trim() === '') {
    console.warn('传入的内容为空，使用文档的完整内容')
    content = document.value.content || getDefaultContent()
  }
  
  console.log('PDF内容:', content) // 调试日志
  
  // 创建完整的HTML文档结构
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${document.value.title || '文档'}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Microsoft YaHei', 'SimSun', sans-serif; background: white; }
        .container { padding: 40px; max-width: 800px; margin: 0 auto; background: white; }
        .title { text-align: center; margin-bottom: 40px; }
        .title h1 { font-size: 28px; font-weight: bold; color: #333; line-height: 1.4; margin: 0; }
        .content { background: white; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 40px; font-size: 16px; line-height: 1.8; }
        .content h3 { color: #3b82f6; font-size: 18px; margin: 20px 0 10px 0; font-weight: 600; }
        .content p { margin: 12px 0; color: #374151; text-align: justify; }
        .system-info p { margin: 4px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- 文档标题 -->
        <div class="title">
          <h1>${document.value.title || '文档'}</h1>
        </div>
        
        <!-- 文档正文 -->
        <div class="content">
          ${content || '<p>暂无内容</p>'}
        </div>
      </div>
    </body>
    </html>
  `
  
  // 使用html2pdf.js生成PDF
  const options = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      allowTaint: true
    },
    jsPDF: { 
      unit: 'in', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    }
  }
  
  // 创建临时DOM元素
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent
  tempDiv.style.position = 'absolute'
  tempDiv.style.left = '-9999px'
  tempDiv.style.top = '-9999px'
  tempDiv.style.width = '800px'
  tempDiv.style.background = 'white'
  document.body.appendChild(tempDiv)
  
  // 等待一下让DOM渲染完成，然后生成PDF
  setTimeout(() => {
    html2pdf().set(options).from(tempDiv).save().then(() => {
      console.log('PDF生成成功')
      document.body.removeChild(tempDiv)
    }).catch((error) => {
      console.error('PDF生成失败:', error)
      document.body.removeChild(tempDiv)
      alert('PDF生成失败，请重试')
    })
  }, 100)
}
    
// 下载Word文件
const downloadAsWord = (content, filename) => {
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head>
        <meta charset='utf-8'>
        <title>${document.value.title || '文档'}</title>
        <style>
          body { font-family: '宋体', SimSun, serif; font-size: 12pt; line-height: 1.8; margin: 2cm; color: #333; }
          h1 { text-align: center; font-size: 18pt; font-weight: bold; margin: 0 0 20pt 0; color: #333; }
          h2 { font-size: 16pt; font-weight: bold; margin: 16pt 0 8pt 0; }
          h3 { font-size: 14pt; font-weight: bold; margin: 14pt 0 7pt 0; }
          p { margin: 8pt 0; text-align: justify; }
          .content { background-color: white; padding: 20pt; border: 1pt solid #e5e7eb; margin-bottom: 30pt; }
        </style>
      </head>
      <body>
        <h1>${document.value.title || '文档'}</h1>
        
        <!-- 文档正文 -->
        <div class="content">
          ${content}
        </div>
      </body>
    </html>
  `
  
  const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' })
  triggerDownload(blob, filename)
}
    
// 触发文件下载
const triggerDownload = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
    
const formatText = (command) => {
  const contentEditor = document.querySelector('#contentEditor')
  if (contentEditor) {
    const start = contentEditor.selectionStart
    const end = contentEditor.selectionEnd
    const selectedText = contentEditor.value.substring(start, end)
    
    let formattedText = selectedText
    if (command === 'bold') {
      formattedText = `**${selectedText}**`
    } else if (command === 'italic') {
      formattedText = `*${selectedText}*`
    }
    
    const newContent = contentEditor.value.substring(0, start) + formattedText + contentEditor.value.substring(end)
    editableDocument.value.content = newContent
    markAsChanged()
  }
}

const insertHeading = () => {
  const contentEditor = document.querySelector('#contentEditor')
  if (contentEditor) {
    const start = contentEditor.selectionStart
    const newContent = contentEditor.value.substring(0, start) + '\n### 标题\n' + contentEditor.value.substring(start)
    editableDocument.value.content = newContent
    markAsChanged()
  }
}

const insertList = () => {
  const contentEditor = document.querySelector('#contentEditor')
  if (contentEditor) {
    const start = contentEditor.selectionStart
    const newContent = contentEditor.value.substring(0, start) + '\n1. 列表项\n2. 列表项\n' + contentEditor.value.substring(start)
    editableDocument.value.content = newContent
    markAsChanged()
  }
}
    
const restoreVersion = (version) => {
  if (confirm(`确定要恢复到版本 ${version.version} 吗？当前未保存的修改将丢失。`)) {
    // 这里应该从服务器获取版本内容
    alert(`已恢复到版本 ${version.version}`)
  }
}

const duplicateDocument = () => {
  alert('文档已复制，正在跳转到新文档...')
  // 这里应该创建新文档并跳转
}

const shareDocument = () => {
  // 复制分享链接到剪贴板
  const shareUrl = `${window.location.origin}/document/share/${document.value.id}`
  navigator.clipboard.writeText(shareUrl).then(() => {
    alert('分享链接已复制到剪贴板')
  })
}

const exportToPrint = () => {
  window.print()
}

const deleteDocument = () => {
  if (confirm('确定要删除这个文档吗？此操作不可恢复。')) {
    alert('文档已删除')
    router.push('/history')
  }
}
    
const goBack = () => {
  if (hasChanges.value) {
    if (confirm('您有未保存的修改，确定要离开吗？')) {
      router.go(-1)
    }
  } else {
    router.go(-1)
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleClickOutside = (event) => {
  const el = document.querySelector('.document-result')
  if (el && !el.contains(event.target)) {
    showUserMenu.value = false
    showDownloadMenu.value = false
  }
}
    
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const formatTextToHtml = (text) => {
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
}
    
// 获取默认内容
const getDefaultContent = () => {
  return `
    <p>为进一步做好新冠肺炎疫情防控工作，确保人民群众生命安全和身体健康，现就有关事项说明如下：</p>
    
    <h3>一、提高思想认识</h3>
    <p>要充分认识当前疫情防控形势的复杂性和严峻性，始终把人民群众生命安全和身体健康放在第一位，坚决克服麻痹思想、厌战情绪、侥幸心理、松劲心态。</p>
    
    <h3>二、强化防控措施</h3>
    <p>1. 严格落实"四早"要求，即早发现、早报告、早隔离、早治疗；</p>
    <p>2. 加强重点场所管控，对商场、超市、餐厅等人员密集场所实施限流措施；</p>
    <p>3. 做好个人防护，坚持佩戴口罩、勤洗手、保持社交距离。</p>
    
    <h3>三、加强组织领导</h3>
    <p>要切实履行责任，建立健全疫情防控工作机制，确保各项防控措施落实到位。</p>
  `
}

const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    router.push('/login')
  }
}

// 在script setup中，所有的响应式数据和函数都会自动暴露给模板
// 不需要显式的return语句
</script>

<style scoped>
/* 文档预览样式 */
.document-preview .prose h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #3b82f6;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.document-preview .prose p {
  margin-bottom: 1rem;
  color: #6b7280;
  line-height: 1.625;
}

/* 编辑模式样式 */
.document-editor textarea {
  font-family: inherit;
  line-height: 1.6;
}

.document-editor textarea:focus {
  outline: none;
}

.edit-input {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.edit-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
}

.edit-textarea {
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.6;
  min-height: 400px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.edit-textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
}

.edit-textarea::selection {
  background-color: rgba(99, 102, 241, 0.2);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
}

.edit-textarea::-moz-selection {
  background-color: rgba(99, 102, 241, 0.2);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
}

.edit-input::selection {
  background-color: rgba(99, 102, 241, 0.2);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
}

.edit-input::-moz-selection {
  background-color: rgba(99, 102, 241, 0.2);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
}

.edit-stats {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 12px 0;
  font-size: 14px;
  color: #6b7280;
  border-top: 1px solid #e5e7eb;
  margin-top: 16px;
}

.unsaved-indicator {
  color: #f59e0b;
  font-weight: 500;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 编辑模式容器样式 */
.document-editor {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* 动画效果 */
.animate-slideInFromTop {
  animation: slideInFromTop 0.3s ease-out;
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

/* 按钮激活状态 */
.gov-button-secondary.active {
  background: var(--primary-600);
  color: white;
}

/* 下拉菜单样式 */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
  z-index: 9999;
  min-width: 200px;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  border-bottom: 1px solid var(--bg-secondary);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.dropdown-item svg {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

/* 打印样式 */
@media print {
  .gov-header,
  .xl\:col-span-1,
  .card-header {
    display: none !important;
  }
  
  .document-preview {
    box-shadow: none !important;
    border: none !important;
  }
}
</style>