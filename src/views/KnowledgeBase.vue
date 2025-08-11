<template>
  <div class="min-h-screen bg-gradient-to-br from-bg-primary to-bg-secondary">
    <!-- 顶部导航栏 -->
    <nav class="gov-header">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center space-x-3">
              <GovIcon size="sm" />
              <h1 class="text-xl font-semibold text-primary">知识库管理</h1>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- 返回首页按钮 -->
            <button 
              @click="goToDashboard"
              class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-secondary hover:text-primary hover:bg-bg-secondary rounded-lg transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              返回首页
            </button>
            
            <!-- 用户头像 -->
            <UserAvatar @logout="logout" />
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 sm:px-0">
        <!-- 页面标题和操作按钮 -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-primary">知识库</h2>
            <p class="text-gray-600 mt-1">管理和查看政务文档知识库</p>
          </div>
          <div class="flex space-x-3">
            <input 
              ref="fileInput"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.md"
              @change="handleFileUpload"
              class="hidden"
            >
            <button 
              @click="$refs.fileInput.click()"
              class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-green to-accent-green text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              上传文档
            </button>
          </div>
        </div>

        <!-- 搜索和筛选区域 -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              搜索与筛选
            </h3>
          </div>
          <div class="p-6">
            <!-- 搜索框 -->
            <div class="mb-6">
              <div class="relative group">
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="  🔍 输入关键词搜索文档标题、内容或标签..."
                  class="w-full pl-8 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gradient-to-r from-gray-50 to-white focus:from-white focus:to-white text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md focus:shadow-lg"
                  @input="handleSearch"
                >
              </div>
            </div>
            
            <!-- 筛选按钮组 -->
            <div class="flex flex-wrap gap-4">
              <!-- 分类筛选 -->
              <div class="flex-1 min-w-[200px]">
                <select v-model="selectedCategory" @change="filterDocuments" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300 text-gray-700 font-medium">
                  <option value="">🗂️ 所有分类</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    📁 {{ category.name }}
                  </option>
                </select>
              </div>
              
              <!-- 排序方式 -->
              <div class="flex-1 min-w-[200px]">
                <select v-model="sortBy" @change="sortDocuments" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300 text-gray-700 font-medium">
                  <option value="updatedAt">🕒 按更新时间</option>
                  <option value="createdAt">📅 按创建时间</option>
                  <option value="name">🔤 按名称</option>
                  <option value="size">📊 按大小</option>
                </select>
              </div>
            </div>
          </div>
        </div>



        <!-- 文档列表 -->
        <div class="gov-card">
          <div class="card-body">
            <!-- 视图切换 -->
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900">文档列表</h3>
              <div class="flex items-center space-x-2">
                <button 
                  @click="viewMode = 'grid'"
                  :class="[
                    'p-2 rounded-lg transition-colors',
                    viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                  ]"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                  </svg>
                </button>
                <button 
                  @click="viewMode = 'list'"
                  :class="[
                    'p-2 rounded-lg transition-colors',
                    viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                  ]"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 网格视图 -->
            <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div 
                v-for="document in filteredDocuments" 
                :key="document.id"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                @click="previewDocumentHandler(document)"
              >
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="flex items-center space-x-1">
                    <button 
                      @click.stop="previewDocumentHandler(document)"
                      class="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300"
                      title="预览"
                    >
                      预览
                    </button>
                    <button 
                      @click.stop="deleteDocument(document)"
                      class="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300"
                      title="删除"
                    >
                      删除
                    </button>
                  </div>
                </div>
                
                <h4 class="font-medium text-gray-900 mb-2 line-clamp-2">{{ document.name }}</h4>
                <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ document.description || '暂无描述' }}</p>
                
                <div class="flex items-center justify-between text-xs text-gray-400">
                  <span>{{ formatFileSize(document.size) }}</span>
                  <span>{{ formatDate(document.updatedAt) }}</span>
                </div>
                
                <div class="mt-2">
                  <span 
                    v-if="document.category"
                    class="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                  >
                    {{ getCategoryName(document.categoryId) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 列表视图 -->
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">文档名称</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">大小</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">更新时间</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr 
                    v-for="document in filteredDocuments" 
                    :key="document.id"
                    class="hover:bg-gray-50 cursor-pointer"
                    @click="previewDocumentHandler(document)"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">{{ document.name }}</div>
                          <div class="text-sm text-gray-500">{{ document.description || '暂无描述' }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        v-if="document.categoryId"
                        class="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        {{ getCategoryName(document.categoryId) }}
                      </span>
                      <span v-else class="text-gray-400">未分类</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatFileSize(document.size) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(document.updatedAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex items-center space-x-3">
                        <button 
                          @click.stop="previewDocumentHandler(document)"
                          class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300 flex items-center gap-2"
                          title="预览"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                          预览
                        </button>
                        <button 
                          @click.stop="deleteDocument(document)"
                          class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300 flex items-center gap-2"
                          title="删除"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 空状态 -->
            <div v-if="filteredDocuments.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">暂无文档</h3>
              <p class="mt-1 text-sm text-gray-500">开始上传您的第一个文档</p>
              <div class="mt-6">
                <button 
                  @click="showUploadModal = true"
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  上传文档
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 上传文档模态框 -->
    <div v-if="showUploadModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showUploadModal = false"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-6 pt-6 pb-4 flex-1 overflow-y-auto">
            <div class="w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">上传文档</h3>
                
                <form @submit.prevent="uploadDocument" class="space-y-4">
                  <!-- 文件选择 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">选择文件</label>
                    <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                      <div class="space-y-1 text-center">
                        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <div class="flex text-sm text-gray-600">
                          <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>选择文件</span>
                            <input 
                              id="file-upload" 
                              name="file-upload" 
                              type="file" 
                              class="sr-only" 
                              @change="handleFileSelect"
                              accept=".pdf,.doc,.docx,.txt,.md"
                            >
                          </label>
                          <p class="pl-1">或拖拽到此处</p>
                        </div>
                        <p class="text-xs text-gray-500">支持 PDF, DOC, DOCX, TXT, MD 格式</p>
                      </div>
                    </div>
                    <div v-if="selectedFile" class="mt-2 text-sm text-gray-600">
                      已选择: {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
                    </div>
                  </div>
                  
                  <!-- 文档名称 -->
                  <div>
                    <label for="document-name" class="block text-sm font-medium text-gray-700">文档名称</label>
                    <input 
                      v-model="uploadForm.name"
                      type="text" 
                      id="document-name"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="输入文档名称"
                    >
                  </div>
                  
                  <!-- 文档描述 -->
                  <div>
                    <label for="document-description" class="block text-sm font-medium text-gray-700">文档描述</label>
                    <textarea 
                      v-model="uploadForm.description"
                      id="document-description"
                      rows="3"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="输入文档描述（可选）"
                    ></textarea>
                  </div>
                  
                  <!-- 分类选择 -->
                  <div>
                    <label for="document-category" class="block text-sm font-medium text-gray-700">文档分类</label>
                    <select 
                      v-model="uploadForm.categoryId"
                      id="document-category"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">选择分类</option>
                      <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                  
                  <!-- 标签 -->
                  <div>
                    <label for="document-tags" class="block text-sm font-medium text-gray-700">标签</label>
                    <input 
                      v-model="uploadForm.tags"
                      type="text" 
                      id="document-tags"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="输入标签，用逗号分隔"
                    >
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="uploadDocument"
              :disabled="!selectedFile || uploading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="uploading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ uploading ? '上传中...' : '上传' }}
            </button>
            <button 
              @click="showUploadModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类管理模态框 -->
    <div v-if="showCategoryModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showCategoryModal = false"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-6 pt-6 pb-4 flex-1 overflow-y-auto">
            <div class="w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">分类管理</h3>
                
                <!-- 添加新分类 -->
                <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-900 mb-3">添加新分类</h4>
                  <div class="flex space-x-3">
                    <input 
                      v-model="newCategory.name"
                      type="text" 
                      placeholder="分类名称"
                      class="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                    <input 
                      v-model="newCategory.description"
                      type="text" 
                      placeholder="分类描述（可选）"
                      class="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                    <button 
                      @click="addCategory"
                      :disabled="!newCategory.name.trim()"
                      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      添加
                    </button>
                  </div>
                </div>
                
                <!-- 分类列表 -->
                <div class="space-y-3">
                  <div 
                    v-for="category in categories" 
                    :key="category.id"
                    class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div class="flex-1">
                      <div v-if="editingCategory?.id === category.id" class="flex space-x-3">
                        <input 
                          v-model="editingCategory.name"
                          type="text" 
                          class="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                        <input 
                          v-model="editingCategory.description"
                          type="text" 
                          class="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                      </div>
                      <div v-else>
                        <h5 class="text-sm font-medium text-gray-900">{{ category.name }}</h5>
                        <p class="text-sm text-gray-500">{{ category.description || '暂无描述' }}</p>
                        <p class="text-xs text-gray-400 mt-1">{{ getDocumentCountByCategory(category.id) }} 个文档</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                      <div v-if="editingCategory?.id === category.id">
                        <button 
                          @click="saveCategory"
                          class="text-green-600 hover:text-green-900 text-sm"
                        >
                          保存
                        </button>
                        <button 
                          @click="cancelEditCategory"
                          class="ml-2 text-gray-600 hover:text-gray-900 text-sm"
                        >
                          取消
                        </button>
                      </div>
                      <div v-else>
                        <button 
                          @click="startEditCategory(category)"
                          class="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          编辑
                        </button>
                        <button 
                          @click="deleteCategory(category)"
                          class="ml-2 text-red-600 hover:text-red-900 text-sm"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 空状态 -->
                <div v-if="categories.length === 0" class="text-center py-8">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900">暂无分类</h3>
                  <p class="mt-1 text-sm text-gray-500">添加您的第一个文档分类</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="showCategoryModal = false"
              class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              关闭
            </button>
          </div>
        </div>
      </div>

    <!-- 文档预览模态框 -->
    <div v-if="showPreviewModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-4 text-center">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showPreviewModal = false"></div>
        
        <div class="relative inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-6xl max-h-[90vh] flex flex-col">
          <div class="bg-white px-6 pt-6 pb-4 flex-1 overflow-y-auto">
            <div class="w-full">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">{{ currentPreviewDocument?.name }}</h3>
                  <button 
                    @click="showPreviewModal = false"
                    class="text-gray-400 hover:text-gray-600"
                  >
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                
                <!-- 文档信息 -->
                <div class="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="font-medium text-gray-700">文件大小:</span>
                      <span class="ml-2 text-gray-600">{{ formatFileSize(currentPreviewDocument?.size) }}</span>
                    </div>
                    <div>
                      <span class="font-medium text-gray-700">分类:</span>
                      <span class="ml-2 text-gray-600">{{ getCategoryName(currentPreviewDocument?.categoryId) || '未分类' }}</span>
                    </div>
                    <div>
                      <span class="font-medium text-gray-700">创建时间:</span>
                      <span class="ml-2 text-gray-600">{{ formatDate(currentPreviewDocument?.createdAt) }}</span>
                    </div>
                    <div>
                      <span class="font-medium text-gray-700">更新时间:</span>
                      <span class="ml-2 text-gray-600">{{ formatDate(currentPreviewDocument?.updatedAt) }}</span>
                    </div>
                  </div>
                  <div v-if="currentPreviewDocument?.description" class="mt-3">
                    <span class="font-medium text-gray-700">描述:</span>
                    <p class="mt-1 text-gray-600">{{ currentPreviewDocument.description }}</p>
                  </div>
                  <div v-if="currentPreviewDocument?.tags?.length" class="mt-3">
                    <span class="font-medium text-gray-700">标签:</span>
                    <div class="mt-1 flex flex-wrap gap-2">
                      <span 
                        v-for="tag in currentPreviewDocument.tags" 
                        :key="tag"
                        class="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- 文档内容预览 -->
                <div class="border border-gray-200 rounded-lg p-6 bg-gray-50 min-h-[400px] flex items-center justify-center">
                  <div class="text-center text-gray-500">
                    <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p class="mt-4 text-lg font-medium">文档预览功能开发中...</p>
                    <p class="text-sm mt-2">请下载文档查看完整内容</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
            <button 
              @click="showPreviewModal = false"
              class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import GovIcon from '../components/GovIcon.vue'
import UserAvatar from '../components/UserAvatar.vue'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('updatedAt')
const viewMode = ref('grid')
const showUploadModal = ref(false)
const showCategoryModal = ref(false)
const showPreviewModal = ref(false)
const uploading = ref(false)
const selectedFile = ref(null)
const currentPreviewDocument = ref(null)

// 表单数据
const uploadForm = ref({
  name: '',
  description: '',
  categoryId: '',
  tags: ''
})

const newCategory = ref({
  name: '',
  description: ''
})

const editingCategory = ref(null)

// 模拟数据
const documents = ref([
  {
    id: 1,
    name: '政府工作报告模板.docx',
    description: '年度政府工作报告标准模板，包含各项工作总结和计划',
    size: 2048576,
    categoryId: 1,
    tags: ['工作报告', '年度总结', '模板'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:20:00Z',
    url: '/documents/gov-work-report.docx'
  },
  {
    id: 2,
    name: '会议纪要标准格式.pdf',
    description: '政府会议纪要的标准格式和写作要求',
    size: 1536000,
    categoryId: 2,
    tags: ['会议纪要', '格式规范'],
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    url: '/documents/meeting-minutes.pdf'
  },
  {
    id: 3,
    name: '公文写作指南.pdf',
    description: '详细的公文写作指南，包含各类公文的写作要点和注意事项',
    size: 3072000,
    categoryId: 3,
    tags: ['公文写作', '指南', '规范'],
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-25T13:30:00Z',
    url: '/documents/official-writing-guide.pdf'
  },
  {
    id: 4,
    name: '通知公告模板集.docx',
    description: '各类通知公告的标准模板集合',
    size: 1024000,
    categoryId: 1,
    tags: ['通知', '公告', '模板'],
    createdAt: '2024-01-12T15:20:00Z',
    updatedAt: '2024-01-22T10:10:00Z',
    url: '/documents/notice-templates.docx'
  },
  {
    id: 5,
    name: '法律法规汇编.pdf',
    description: '相关法律法规的汇编文档',
    size: 5120000,
    categoryId: 4,
    tags: ['法律法规', '汇编'],
    createdAt: '2024-01-08T08:45:00Z',
    updatedAt: '2024-01-28T17:00:00Z',
    url: '/documents/legal-compilation.pdf'
  }
])

const categories = ref([
  { id: 1, name: '模板文档', description: '各类公文模板' },
  { id: 2, name: '会议文档', description: '会议相关文档' },
  { id: 3, name: '指导文档', description: '写作指导和规范' },
  { id: 4, name: '法规文档', description: '法律法规相关' }
])

// 计算属性
const filteredDocuments = computed(() => {
  let filtered = documents.value
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(doc => 
      doc.name.toLowerCase().includes(query) ||
      doc.description?.toLowerCase().includes(query) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // 分类过滤
  if (selectedCategory.value) {
    filtered = filtered.filter(doc => doc.categoryId === parseInt(selectedCategory.value))
  }
  
  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'size':
        return b.size - a.size
      case 'createdAt':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'updatedAt':
      default:
        return new Date(b.updatedAt) - new Date(a.updatedAt)
    }
  })
  
  return filtered
})



// 方法
const goToDashboard = () => {
  router.push('/')
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

const filterDocuments = () => {
  // 过滤逻辑已在计算属性中处理
}

const sortDocuments = () => {
  // 排序逻辑已在计算属性中处理
}

const handleFileUpload = async (event) => {
  const files = event.target.files
  if (!files || files.length === 0) return
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    // 创建新文档对象
    const newDocument = {
      id: Date.now() + i,
      name: file.name,
      description: `上传的${file.type.includes('pdf') ? 'PDF' : file.type.includes('doc') ? 'Word' : '文本'}文档`,
      size: file.size,
      categoryId: 1, // 默认分类为模板文档
      tags: ['上传文档'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      url: `/documents/${file.name}`
    }
    
    documents.value.unshift(newDocument)
  }
  
  // 清空文件输入
  event.target.value = ''
  
  alert(`成功上传 ${files.length} 个文件！`)
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    if (!uploadForm.value.name) {
      uploadForm.value.name = file.name.replace(/\.[^/.]+$/, '')
    }
  }
}

const uploadDocument = async () => {
  if (!selectedFile.value) return
  
  uploading.value = true
  
  try {
    // 模拟上传过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 创建新文档对象
    const newDocument = {
      id: Date.now(),
      name: uploadForm.value.name || selectedFile.value.name,
      description: uploadForm.value.description,
      size: selectedFile.value.size,
      categoryId: uploadForm.value.categoryId ? parseInt(uploadForm.value.categoryId) : null,
      tags: uploadForm.value.tags ? uploadForm.value.tags.split(',').map(tag => tag.trim()) : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      url: `/documents/${selectedFile.value.name}`
    }
    
    documents.value.unshift(newDocument)
    
    // 重置表单
    uploadForm.value = {
      name: '',
      description: '',
      categoryId: '',
      tags: ''
    }
    selectedFile.value = null
    showUploadModal.value = false
    
    alert('文档上传成功！')
  } catch (error) {
    console.error('上传失败:', error)
    alert('上传失败，请重试')
  } finally {
    uploading.value = false
  }
}

const addCategory = () => {
  if (!newCategory.value.name.trim()) return
  
  const category = {
    id: Date.now(),
    name: newCategory.value.name.trim(),
    description: newCategory.value.description.trim()
  }
  
  categories.value.push(category)
  
  newCategory.value = {
    name: '',
    description: ''
  }
  
  alert('分类添加成功！')
}

const startEditCategory = (category) => {
  editingCategory.value = { ...category }
}

const saveCategory = () => {
  const index = categories.value.findIndex(cat => cat.id === editingCategory.value.id)
  if (index !== -1) {
    categories.value[index] = { ...editingCategory.value }
    editingCategory.value = null
    alert('分类更新成功！')
  }
}

const cancelEditCategory = () => {
  editingCategory.value = null
}

const deleteCategory = (category) => {
  if (confirm(`确定要删除分类 "${category.name}" 吗？`)) {
    const index = categories.value.findIndex(cat => cat.id === category.id)
    if (index !== -1) {
      categories.value.splice(index, 1)
      alert('分类删除成功！')
    }
  }
}

const previewDocumentHandler = (document) => {
  currentPreviewDocument.value = document
  showPreviewModal.value = true
}

// 下载和编辑功能已移除，专注于预览功能

const deleteDocument = (document) => {
  if (confirm(`确定要删除文档 "${document.name}" 吗？`)) {
    const index = documents.value.findIndex(doc => doc.id === document.id)
    if (index !== -1) {
      documents.value.splice(index, 1)
      alert('文档删除成功！')
    }
  }
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.name : ''
}

const getDocumentCountByCategory = (categoryId) => {
  return documents.value.filter(doc => doc.categoryId === categoryId).length
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 组件挂载时的初始化
onMounted(() => {
  // 可以在这里加载数据
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>