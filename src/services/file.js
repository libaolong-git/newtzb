import { api } from './api'

/**
 * 文件上传和历史记录相关API
 */
export const fileService = {
  /**
   * 上传文件
   * @param {File} file - 要上传的文件
   * @param {Function} onProgress - 上传进度回调函数
   * @returns {Promise} 上传响应
   */
  async uploadFile(file, onProgress) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/llmcenter/v1/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(progress)
          }
        }
      })
      
      return {
        success: true,
        data: {
          file_id: response.data.file_id,
          file_name: response.data.file_name,
          url: response.data.url,
          message: response.data.message
        }
      }
    } catch (error) {
      console.error('文件上传失败:', error)
      return {
        success: false,
        message: error.response?.data?.error?.message || '文件上传失败'
      }
    }
  },

  /**
   * 批量上传文件
   * @param {FileList|Array} files - 要上传的文件列表
   * @param {Function} onProgress - 上传进度回调函数
   * @param {Function} onFileComplete - 单个文件完成回调函数
   * @returns {Promise} 批量上传响应
   */
  async uploadFiles(files, onProgress, onFileComplete) {
    const results = []
    const totalFiles = files.length
    let completedFiles = 0
    
    for (const file of files) {
      try {
        const result = await this.uploadFile(file, (fileProgress) => {
          const totalProgress = Math.round(
            ((completedFiles + fileProgress / 100) / totalFiles) * 100
          )
          if (onProgress) {
            onProgress(totalProgress, file.name)
          }
        })
        
        results.push({
          file: file,
          result: result
        })
        
        if (onFileComplete) {
          onFileComplete(file, result)
        }
        
        completedFiles++
      } catch (error) {
        results.push({
          file: file,
          result: {
            success: false,
            message: '上传失败'
          }
        })
        completedFiles++
      }
    }
    
    const successCount = results.filter(r => r.result.success).length
    
    return {
      success: successCount > 0,
      results: results,
      summary: {
        total: totalFiles,
        success: successCount,
        failed: totalFiles - successCount
      }
    }
  },

  /**
   * 获取文件
   * @param {string} filePath - 文件路径
   * @returns {Promise} 文件响应
   */
  async getFile(filePath) {
    try {
      const response = await api.get(`/llmcenter/v1/files/${filePath}`, {
        responseType: 'blob'
      })
      
      return {
        success: true,
        data: response.data,
        contentType: response.headers['content-type']
      }
    } catch (error) {
      console.error('获取文件失败:', error)
      return {
        success: false,
        message: error.response?.data?.error?.message || '获取文件失败'
      }
    }
  }
}

/**
 * 历史记录相关API
 */
export const historyService = {
  /**
   * 获取会话列表
   * @returns {Promise} 会话列表响应
   */
  async getConversations() {
    try {
      const response = await api.get('/llmcenter/v1/conversations')
      
      return {
        success: true,
        data: response.data.data || []
      }
    } catch (error) {
      console.error('获取会话列表失败:', error)
      return {
        success: false,
        message: error.response?.data?.error?.message || '获取会话列表失败',
        data: []
      }
    }
  },

  /**
   * 获取指定会话的历史消息
   * @param {string} conversationId - 会话ID
   * @returns {Promise} 历史消息响应
   */
  async getConversationHistory(conversationId) {
    try {
      const response = await api.get(`/llmcenter/v1/conversations/${conversationId}`)
      
      if (response.data.code === 0) {
        return {
          success: true,
          data: response.data.data
        }
      } else {
        return {
          success: false,
          message: response.data.msg || '获取历史消息失败'
        }
      }
    } catch (error) {
      console.error('获取历史消息失败:', error)
      return {
        success: false,
        message: error.response?.data?.error?.message || '获取历史消息失败'
      }
    }
  },

  /**
   * 获取指定会话的文档
   * @param {string} conversationId - 会话ID
   * @returns {Promise} 文档响应
   */
  async getConversationDocuments(conversationId) {
    try {
      const response = await api.get(`/llmcenter/v1/documents/${conversationId}`)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('获取会话文档失败:', error)
      return {
        success: false,
        message: error.response?.data?.error?.message || '获取会话文档失败'
      }
    }
  },

  /**
   * 获取指定会话的基本信息
   * @param {string} conversationId - 会话ID
   * @returns {Promise} 基本信息响应
   */
  async getConversationData(conversationId) {
    try {
      const response = await api.get(`/llmcenter/v1/historydatas/${conversationId}`)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('获取会话基本信息失败:', error)
      return {
        success: false,
        message: error.response?.data?.error?.message || '获取会话基本信息失败'
      }
    }
  }
}

export default { fileService, historyService }