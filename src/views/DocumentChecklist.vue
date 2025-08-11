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
            <div class="flex items-center">
              <GovIcon size="sm" class="mr-3" />
              <h1 class="text-xl font-bold text-gray-800">文档信息清单</h1>
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
    <main class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- 页面标题卡片 -->
      <div class="mb-8 animate-fadeIn">
        <div class="gov-card">
          <div class="card-header">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">公文内容信息清单</h1>
                <p class="text-secondary mt-1">请填写完整的文档信息，确保生成的公文准确无误</p>
              </div>
              <GovIcon size="lg" />
            </div>
          </div>
        </div>
      </div>

      <!-- 表单卡片 -->
      <div class="gov-card animate-slideInFromBottom">
        <form @submit.prevent="confirmAndContinue">
          <div class="card-body space-y-8">
            <!-- 动态表单内容 -->
            <div v-if="checklistSections.length > 0" class="space-y-8">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <h2 class="text-lg font-bold text-primary">文档信息清单</h2>
                  <span class="text-sm text-secondary">({{ totalFieldsCount }} 个字段)</span>
                </div>
                <button 
                  @click="fetchChecklistFromBackend"
                  class="text-sm text-accent hover:text-primary transition-colors"
                  title="刷新数据"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </button>
              </div>

              <!-- 分组渲染字段 -->
              <div v-for="section in checklistSections" :key="section.title" class="space-y-6">
                <!-- 分组标题 -->
                <div class="border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent pl-6 py-4 rounded-r-lg">
                  <h3 class="text-xl font-bold text-primary flex items-center space-x-3">
                    <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                    <span>{{ section.title }}</span>
                  </h3>
                </div>
                
                <!-- 分组字段 -->
                <div class="grid grid-cols-1 gap-8 md:grid-cols-2 pl-4">
                  <div 
                  v-for="field in section.fields" 
                  :key="field.key"
                  :class="{
                    'md:col-span-2': field.type === 'textarea' || field.type === 'daterange' || field.label.includes('内容') || field.label.includes('说明') || field.label.includes('要求') || field.label.includes('期间') || field.label.includes('时段')
                  }"
                  class="field-container bg-white/50 rounded-lg p-4 border border-gray-100 hover:border-primary/30 transition-all duration-200"
                >
                    <label class="block text-sm font-semibold text-primary mb-3" :for="field.key">
                      <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z"/>
                        </svg>
                        <span>{{ field.type === 'daterange' ? field.label.replace(/开始时间|结束时间/, '时间段') : field.label }}</span>
                        <span v-if="field.required" class="text-error text-xs">*</span>
                      </div>
                    </label>
                    
                    <!-- 文本输入框 -->
                    <input 
                      v-if="field.type === 'text'"
                      v-model="formData[field.key]" 
                      class="gov-input w-full text-base px-4 py-3" 
                      :id="field.key" 
                      :placeholder="`请输入${field.label}`" 
                      type="text"
                      :required="field.required"
                    />
                    
                    <!-- 日期输入框 -->
                    <div v-else-if="field.type === 'date'" class="relative">
                      <input 
                        v-model="formData[field.key]" 
                        class="gov-input w-full text-base px-4 py-3" 
                        :id="field.key" 
                        type="text"
                        :placeholder="`请输入${field.label}（如：2025年9月10日）`"
                        :required="field.required"
                      />
                      <p class="text-xs text-gray-500 mt-1">格式：年/月/日 或 YYYY-MM-DD</p>
                    </div>
                    
                    <!-- 时间段输入框 -->
                    <div v-else-if="field.type === 'daterange'" class="space-y-3">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-xs text-gray-600 mb-1">开始时间</label>
                          <input 
                            v-model="formData[field.key + '_start']" 
                            class="gov-input w-full text-base px-4 py-3" 
                            :id="field.key + '_start'" 
                            type="datetime-local"
                            placeholder="选择开始时间"
                          />
                        </div>
                        <div>
                          <label class="block text-xs text-gray-600 mb-1">结束时间</label>
                          <input 
                            v-model="formData[field.key + '_end']" 
                            class="gov-input w-full text-base px-4 py-3" 
                            :id="field.key + '_end'" 
                            type="datetime-local"
                            placeholder="选择结束时间"
                          />
                        </div>
                      </div>
                      <p class="text-xs text-gray-500 mt-2">提示：请至少填写开始时间或结束时间中的一个</p>
                    </div>
                    
                    <!-- 时间输入框 -->
                    <div v-else-if="field.type === 'datetime'" class="relative">
                      <input 
                        v-model="formData[field.key]" 
                        class="gov-input w-full text-base px-4 py-3" 
                        :id="field.key" 
                        type="text"
                        :placeholder="`请输入${field.label}（如：2025年9月10日 上午8:00）`"
                        :required="field.required"
                      />
                      <p class="text-xs text-gray-500 mt-1">格式：年月日 时间 或 YYYY-MM-DD HH:MM</p>
                    </div>
                    
                    <!-- 文本域 -->
                    <textarea 
                      v-else-if="field.type === 'textarea'"
                      v-model="formData[field.key]" 
                      class="gov-textarea w-full min-h-[120px] text-base px-4 py-3 resize-none" 
                      :id="field.key" 
                      :placeholder="`请输入${field.label}`"
                      :required="field.required"
                      rows="3"
                      @input="autoResizeTextarea"
                      @focus="onTextareaFocus"
                      @blur="onTextareaBlur"
                      :style="getTextareaStyle(field.key)"
                    ></textarea>
                    <!-- 字符计数提示 -->
                    <div v-if="formData[field.key]" class="character-count">
                      <span>已输入 {{ formData[field.key].length }} 个字符</span>
                      <span v-if="formData[field.key].length > 100" class="rich-content-indicator">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        内容丰富
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 加载状态 -->
            <div v-else-if="isLoading" class="text-center py-8">
              <div class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                正在加载内容清单...
              </div>
            </div>
            
            <!-- 无数据状态 -->
            <div v-else class="text-center py-8 text-secondary">
              <p>未找到内容清单信息</p>
              <button 
                @click="goBack"
                class="mt-4 gov-button"
              >
                返回重新开始
              </button>
            </div>

          </div>

          <!-- 操作按钮 -->
          <div v-if="checklistSections.length > 0" class="card-footer">
            <div class="flex items-center justify-center">
              <div class="flex items-center space-x-4">
                <button
                  type="button"
                  @click="goBack"
                  :disabled="isLoading"
                  class="gov-button-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  <span>返回</span>
                </button>
                
                <button
                  type="submit"
                  :disabled="!isFormValid || isLoading"
                  class="gov-button flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                  <span>{{ isLoading ? '生成中...' : '确认并生成文档' }}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDocumentStore } from '@/store/document'
import { useAuthStore } from '@/store/auth'
import { documentService } from '@/services/document'
import GovIcon from '@/components/GovIcon.vue'

const router = useRouter()
const documentStore = useDocumentStore()
const authStore = useAuthStore()

const showUserMenu = ref(false)
const isLoading = ref(false)
const checklistSections = ref([])

// 动态表单数据
const formData = reactive({})

// 用户信息
const userInfo = computed(() => ({
  name: authStore.user?.name || authStore.user?.username || '用户',
  avatar: authStore.user?.avatar || ''
}))

// 解析内容清单为分组结构
const parseChecklistContent = (content) => {
  const sections = []
  
  if (typeof content === 'string') {
    const lines = content.split('\n')
    let currentSection = null
    
    lines.forEach(line => {
      const trimmedLine = line.trim()
      
      // 检查是否是标题行（以###开头或包含"："且后面为空）
      if (trimmedLine.startsWith('###') || trimmedLine.startsWith('##')) {
        // 新的分组标题
        const title = trimmedLine.replace(/^#+\s*/, '').replace(/：$/, '').trim()
        currentSection = {
          title: title,
          fields: []
        }
        sections.push(currentSection)
      } else if (trimmedLine.includes('：') && currentSection) {
        // 字段行
        const [label, value] = trimmedLine.split('：', 2)
        const cleanLabel = label.trim().replace(/^-\s*/, '') // 移除开头的-
        
        if (cleanLabel) {
          const fieldKey = generateFieldKey(cleanLabel, currentSection.title)
          const field = {
            key: fieldKey,
            label: cleanLabel,
            value: value ? value.trim() : '',
            type: determineFieldType(cleanLabel),
            required: isRequiredField(cleanLabel)
          }
          
          currentSection.fields.push(field)
          // 初始化表单数据
          if (field.type === 'daterange') {
            // 时间段字段需要初始化开始和结束时间
            formData[fieldKey + '_start'] = ''
            formData[fieldKey + '_end'] = ''
            formData[fieldKey] = value ? value.trim() : '' // 保留原始值用于显示
          } else {
            formData[fieldKey] = value ? value.trim() : ''
          }
        }
      } else if (trimmedLine.includes('（') && trimmedLine.includes('）') && currentSection && currentSection.fields.length > 0) {
        // 处理字段说明，添加到最后一个字段的label中
        const lastField = currentSection.fields[currentSection.fields.length - 1]
        if (!lastField.label.includes('（')) {
          lastField.label += trimmedLine
        }
      }
    })
  }
  
  // 如果没有解析到分组，创建一个默认分组
  if (sections.length === 0 && typeof content === 'string') {
    const defaultSection = {
      title: '文档信息',
      fields: []
    }
    
    const lines = content.split('\n')
    lines.forEach(line => {
      const trimmedLine = line.trim()
      if (trimmedLine && trimmedLine.includes('：')) {
        const [label, value] = trimmedLine.split('：', 2)
        const cleanLabel = label.trim().replace(/^-\s*/, '')
        
        if (cleanLabel) {
          const fieldKey = generateFieldKey(cleanLabel)
          const field = {
            key: fieldKey,
            label: cleanLabel,
            value: value ? value.trim() : '',
            type: determineFieldType(cleanLabel),
            required: isRequiredField(cleanLabel)
          }
          
          defaultSection.fields.push(field)
          // 初始化表单数据
          if (field.type === 'daterange') {
            // 时间段字段需要初始化开始和结束时间
            formData[fieldKey + '_start'] = ''
            formData[fieldKey + '_end'] = ''
            formData[fieldKey] = value ? value.trim() : '' // 保留原始值用于显示
          } else {
            formData[fieldKey] = value ? value.trim() : ''
          }
        }
      }
    })
    
    if (defaultSection.fields.length > 0) {
      sections.push(defaultSection)
    }
  }
  
  return sections
}

// 获取字段标签
const getFieldLabel = (key, prefix = '') => {
  const labelMap = {
    // 基本信息
    'title': '标题',
    'documentType': '文档类型',
    'documentNumber': '文号',
    'docNumber': '文号',
    
    // 单位信息
    'issuingUnit': '发文单位',
    'issuer': '发文机关',
    'recipientUnit': '主送单位',
    'recipient': '收文单位',
    'copyRecipients': '抄送单位',
    'copyTo': '抄送',
    
    // 内容信息
    'mainBody': '正文内容',
    'mainPoints': '主要内容',
    'content': '内容',
    'requirements': '要求',
    'information': '基础信息',
    
    // 时间信息
    'date': '日期',
    'printDate': '印发日期',
    'issueDate': '发文日期',
    
    // 其他信息
    'signer': '签发人',
    'contactPerson': '联系人',
    'remarks': '备注',
    'notes': '说明',
    'urgency': '紧急程度',
    'copies': '印发份数',
    'printOffice': '印发机关',
    
    // 特殊字段
    'hasAttachments': '是否有附件',
    'needsApproval': '是否需要审批',
    'isConfidential': '是否保密'
  }
  
  const label = labelMap[key] || key
  return prefix ? `${prefix}-${label}` : label
}

// 生成字段键名
const generateFieldKey = (label, sectionTitle = '') => {
  // 创建唯一的字段键，结合分组标题和字段标签
  const cleanLabel = label.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')
  const cleanSection = sectionTitle.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')
  
  return cleanSection ? `${cleanSection}_${cleanLabel}` : cleanLabel
}

// 确定字段类型 - 所有字段都使用textarea，通过CSS自动调整高度
const determineFieldType = (label) => {
  // 所有字段都使用textarea类型，通过自动高度调整来适配内容大小
  return 'textarea'
}

// 判断是否为必填字段
const isRequiredField = (label) => {
  const requiredFields = [
    '标题', '通知标题', '文档标题', '主题',
    '主要内容', '正文内容', '核心内容'
  ]
  
  // 检查标签是否包含必填字段的关键词
  return requiredFields.some(field => {
    return label.includes(field)
  })
}

// 计算总字段数
const totalFieldsCount = computed(() => {
  return checklistSections.value.reduce((total, section) => total + section.fields.length, 0)
})

// 表单验证
const isFormValid = computed(() => {
  const allFields = checklistSections.value.flatMap(section => section.fields)
  return allFields
    .filter(field => field.required)
    .every(field => {
      if (field.type === 'daterange') {
        // 时间段字段需要检查开始或结束时间至少有一个
        return (formData[field.key + '_start'] && formData[field.key + '_start'].trim()) ||
               (formData[field.key + '_end'] && formData[field.key + '_end'].trim())
      } else {
        return formData[field.key] && formData[field.key].trim()
      }
    })
})

// 初始化页面数据
const initializeData = async () => {
  try {
    // 优先使用checklistContent
    const checklistContent = documentStore.conversationInfo.checklistContent
    
    if (checklistContent) {
      // 如果有checklistContent，直接解析
      checklistSections.value = parseChecklistContent(checklistContent)
      // 应用预填充数据
      applyPrefilledData()
    } else {
      // 如果没有数据，显示提示信息
      console.warn('未找到内容清单信息，请返回重新生成')
      checklistSections.value = []
    }
  } catch (error) {
    console.error('初始化数据失败:', error)
    // 即使出错，也要尝试解析清单内容
    const checklistContent = documentStore.conversationInfo.checklistContent
    if (checklistContent) {
      checklistSections.value = parseChecklistContent(checklistContent)
    }
  }
}

// 从后端获取信息清单数据（可选实现）
const fetchChecklistFromBackend = async () => {
  try {
    isLoading.value = true
    // 这里可以调用API获取最新的信息清单结构
    // const response = await api.get('/llmcenter/v1/checklist/template')
    // if (response.data) {
    //   checklistFields.value = parseChecklistContent(response.data)
    // }
  } catch (error) {
    console.error('获取信息清单失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 转换中文日期格式为HTML日期格式
const convertChineseDateToHTML = (chineseDate) => {
  if (!chineseDate || typeof chineseDate !== 'string') {
    return null
  }
  
  // 匹配各种中文日期格式
  const patterns = [
    // 2025年9月10日
    /^(\d{4})年(\d{1,2})月(\d{1,2})日$/,
    // 2025-9-10
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    // 2025/9/10
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,
    // 2025.9.10
    /^(\d{4})\.(\d{1,2})\.(\d{1,2})$/
  ]
  
  for (const pattern of patterns) {
    const match = chineseDate.match(pattern)
    if (match) {
      const year = match[1]
      const month = match[2].padStart(2, '0')
      const day = match[3].padStart(2, '0')
      return `${year}-${month}-${day}`
    }
  }
  
  return null
}

// 从content中解析预填充数据
const parseContentForPrefill = (content) => {
  if (!content || typeof content !== 'string') {
    return {}
  }
  
  const parsedData = {}
  
  // 匹配格式如："开学日期（具体时间）：2023年9月1日"
  const fieldPattern = /([^：]+)：([^\n\r]+)/g
  let match
  
  while ((match = fieldPattern.exec(content)) !== null) {
    const fieldName = match[1].trim()
    const fieldValue = match[2].trim()
    
    if (fieldValue && fieldValue !== '' && !fieldValue.includes('：')) {
      // 清理字段名中的括号和特殊字符，用于匹配
      const cleanFieldName = fieldName.replace(/[（）()]/g, '').trim()
      parsedData[fieldName] = fieldValue
      parsedData[cleanFieldName] = fieldValue
      
      console.log(`解析到字段: ${fieldName} = ${fieldValue}`)
    }
  }
  
  return parsedData
}

// 应用预填充数据到表单字段
const applyPrefilledData = () => {
  // 首先尝试从conversationInfo中获取content进行解析
  let contentData = {}
  
  // 支持多种数据源格式
  let contentToProcess = null
  
  // 优先从conversationInfo.content获取（原有逻辑）
  if (documentStore.conversationInfo?.content) {
    contentToProcess = documentStore.conversationInfo.content
  }
  // 如果没有，尝试从conversationInfo.data.content获取（新的后端数据格式）
  else if (documentStore.conversationInfo?.data?.content) {
    contentToProcess = documentStore.conversationInfo.data.content
  }
  // 如果conversationInfo本身就是后端返回的data格式
  else if (documentStore.conversationInfo?.conversation_id && documentStore.conversationInfo?.content) {
    contentToProcess = documentStore.conversationInfo.content
  }
  
  if (contentToProcess) {
    contentData = parseContentForPrefill(contentToProcess)
  }
  
  console.log('当前conversationInfo:', documentStore.conversationInfo)
  console.log('解析的内容:', contentToProcess)
  console.log('解析出的数据:', contentData)
  
  if (Object.keys(contentData).length === 0) {
    console.log('没有预填充数据需要应用')
    return
  }
  
  console.log('开始应用预填充数据:', contentData)
  
  // 遍历所有字段，如果预填充数据中有对应的值，则填充到表单中
  checklistSections.value.forEach(section => {
    section.fields.forEach(field => {
      // 尝试多种匹配方式
      const possibleKeys = [
        field.key,
        field.label,
        field.label.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ''), // 清理特殊字符
        field.label.replace(/[（）()]/g, '').trim(), // 清理括号
        generateFieldKey(field.label), // 使用生成的键
        generateFieldKey(field.label, section.title) // 使用带分组的键
      ]
      
      // 查找匹配的预填充数据
      let prefilledValue = null
      for (const key of possibleKeys) {
        if (contentData[key] !== undefined && contentData[key] !== null && contentData[key] !== '') {
          prefilledValue = contentData[key]
          console.log(`字段 ${field.label} 匹配到预填充数据，使用键: ${key} = ${prefilledValue}`)
          break
        }
      }
      
      // 如果找到预填充值且当前字段为空，则填充
      if (prefilledValue !== null && (!formData[field.key] || formData[field.key].trim() === '')) {
        let finalValue = String(prefilledValue).trim()
        
        // 如果是日期字段，尝试转换中文日期格式为HTML日期格式
        if (field.type === 'date' && finalValue) {
          const convertedDate = convertChineseDateToHTML(finalValue)
          if (convertedDate) {
            finalValue = convertedDate
            console.log(`📅 日期格式转换: ${prefilledValue} -> ${finalValue}`)
          }
        }
        
        formData[field.key] = finalValue
        console.log(`✅ 字段 ${field.label} (${field.key}) 已预填充:`, finalValue)
      } else if (prefilledValue === null) {
        console.log(`❌ 字段 ${field.label} (${field.key}) 未找到匹配的预填充数据，尝试的键:`, possibleKeys)
      }
    })
  })
  
  console.log('预填充完成，当前表单数据:', formData)
}

// 更新信息清单数据（当接收到新的后端数据时调用）
const updateChecklistData = (newData) => {
  if (newData) {
    checklistSections.value = parseChecklistContent(newData)
    // 应用预填充数据
    applyPrefilledData()
    // 更新store中的数据
    documentStore.setChecklistInfo(formData)
  }
}



// 提交表单
const confirmAndContinue = async () => {
  if (!isFormValid.value) {
    alert('请填写所有必填项')
    return
  }
  
  const confirmed = confirm('确认提交文档信息并生成公文？')
  if (!confirmed) {
    return
  }
  
  isLoading.value = true
  
  try {
    // 构建提交内容
    const content = checklistSections.value
      .flatMap(section => section.fields)
      .map(field => {
        if (field.type === 'daterange') {
          // 时间段字段组合开始和结束时间
          const startTime = formData[field.key + '_start'] || ''
          const endTime = formData[field.key + '_end'] || ''
          const timeRange = startTime && endTime ? `${startTime} 至 ${endTime}` : (startTime || endTime || '')
          return `${field.label}：${timeRange}`
        } else {
          return `${field.label}：${formData[field.key] || ''}`
        }
      })
      .join('\n')
    
    const { conversationId } = documentStore.conversationInfo
    
    // 调用resume API继续生成文档
    let finalDocument = ''
    
    // 保存会话信息到store，用于生成页面继续处理
    documentStore.updateGenerationInfo({
      conversationId: conversationId,
      checklistContent: content,
      status: 'pending'
    })
    
    // 立即跳转到文档生成页面
    await router.push('/document/generation')
  } catch (error) {
    console.error('提交失败:', error)
    alert('提交失败，请重试：' + (error.message || error))
  } finally {
    isLoading.value = false
  }
}

// 返回上一页
const goBack = () => {
  router.push('/')
}

// 切换用户菜单
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// 处理点击外部关闭菜单
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showUserMenu.value = false
  }
}

// 退出登录
const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    authStore.logout()
    router.push('/login')
  }
}

// 生命周期
// 初始化所有textarea的高度
const initializeTextareaHeights = () => {
  setTimeout(() => {
    const textareas = document.querySelectorAll('.gov-textarea')
    textareas.forEach(textarea => {
      if (textarea.value && textarea.value.trim()) {
        // 模拟input事件来调整高度
        const event = { target: textarea }
        autoResizeTextarea(event)
      }
    })
  }, 100)
}

onMounted(async () => {
  await initializeData()
  document.addEventListener('click', handleClickOutside)
  
  // 为页面添加平滑滚动
  document.documentElement.classList.add('smooth-scroll')
  
  // 初始化textarea高度
  initializeTextareaHeights()
  
  // 开发模式下显示调试信息
  if (import.meta.env.DEV) {
    console.log('DocumentChecklist 组件已挂载')
    console.log('checklistSections:', checklistSections.value)
    console.log('formData:', formData)
    console.log('conversationInfo:', documentStore.conversationInfo)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Textarea自动调整高度相关方法
const textareaHeights = reactive({})
const focusedTextarea = ref(null)

// 自动调整textarea高度
const autoResizeTextarea = (event) => {
  const textarea = event.target
  const fieldKey = textarea.id
  const content = textarea.value || ''
  
  // 重置高度以获取正确的scrollHeight
  textarea.style.height = 'auto'
  
  // 根据内容长度智能设置最小高度
  let minHeight
  if (content.length === 0) {
    minHeight = 80  // 空内容时使用较小高度
  } else if (content.length < 50) {
    minHeight = 80  // 短内容
  } else if (content.length < 150) {
    minHeight = 120 // 中等内容
  } else {
    minHeight = 160 // 长内容
  }
  
  const maxHeight = 400
  const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
  
  // 设置新高度
  textarea.style.height = newHeight + 'px'
  textareaHeights[fieldKey] = newHeight
  
  // 如果内容超过最大高度，显示滚动条
  if (textarea.scrollHeight > maxHeight) {
    textarea.style.overflowY = 'auto'
  } else {
    textarea.style.overflowY = 'hidden'
  }
}

// 获取textarea样式
const getTextareaStyle = (fieldKey) => {
  // 如果没有设置高度，使用智能默认高度
  let defaultHeight = 80
  const content = formData[fieldKey] || ''
  if (content.length > 0) {
    if (content.length < 50) {
      defaultHeight = 80
    } else if (content.length < 150) {
      defaultHeight = 120
    } else {
      defaultHeight = 160
    }
  }
  
  const height = textareaHeights[fieldKey] || defaultHeight
  const isFocused = focusedTextarea.value === fieldKey
  
  return {
    height: height + 'px',
    transition: 'all 0.2s ease-in-out',
    boxShadow: isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
    transform: isFocused ? 'translateY(-1px)' : 'none'
  }
}

// textarea获得焦点
const onTextareaFocus = (event) => {
  const fieldKey = event.target.id
  focusedTextarea.value = fieldKey
  
  // 自动调整高度
  autoResizeTextarea(event)
  
  // 平滑滚动到当前字段
  setTimeout(() => {
    event.target.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }, 100)
}

// textarea失去焦点
const onTextareaBlur = (event) => {
  focusedTextarea.value = null
}

// 暴露方法供外部调用
defineExpose({
  updateChecklistData,
  fetchChecklistFromBackend,
  checklistSections,
  formData,
  autoResizeTextarea,
  getTextareaStyle
})
</script>

<style scoped>
/* 组件特定样式 */
.gov-input {
  transition: all 0.2s ease-in-out;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  background-color: #fafafa;
}

.gov-input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  background-color: #ffffff;
  transform: translateY(-1px);
}

.gov-textarea {
  transition: all 0.2s ease-in-out;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  background-color: #fafafa;
  line-height: 1.6;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', 'Arial', sans-serif;
  overflow-y: hidden;
  resize: none;
}

.gov-textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
  background-color: #ffffff;
  transform: translateY(-1px);
  outline: none;
}

.gov-textarea:hover:not(:focus) {
  border-color: #d1d5db;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 字符计数样式 */
.character-count {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.character-count .rich-content-indicator {
  color: #10b981;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* 平滑滚动动画 */
.smooth-scroll {
  scroll-behavior: smooth;
}

/* 字段容器增强样式 */
.field-container {
  transition: all 0.2s ease-in-out;
}

.field-container:hover {
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

/* 聚焦时的字段容器样式 */
.field-container:focus-within {
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.1);
  border-radius: 8px;
  transform: translateY(-1px);
}

/* 表单验证样式 */
.gov-input:invalid {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.gov-textarea:invalid {
  border-color: #ef4444;
  background-color: #fef2f2;
}

/* 时间段输入框样式 */
.gov-input[type="datetime-local"] {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 字段容器悬停效果 */
.bg-white\/50:hover {
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 标签样式增强 */
label {
  font-weight: 600;
  letter-spacing: 0.025em;
}

/* 必填标记样式 */
.text-error {
  color: #ef4444;
  font-weight: bold;
}
</style>