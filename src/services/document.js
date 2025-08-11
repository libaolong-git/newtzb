import { api } from './api'

/**
 * 文档生成相关API
 */
export const documentService = {
  /**
   * 发起新对话或在现有对话中发送消息
   * @param {Object} params - 请求参数
   * @param {string} params.conversation_id - 会话ID（可选）
   * @param {string} params.documenttype - 公文类型
   * @param {string} params.information - 公文基础信息
   * @param {string} params.requests - 用户提出的要求
   * @param {boolean} params.use_knowledge_base - 是否使用自定义知识库
   * @param {string} params.knowledge_base_id - 知识库ID（可选）
   * @param {Array} params.references - 引用文件列表（可选）
   * @param {Function} onMessage - 消息回调函数
   * @param {Function} onInterrupt - 中断回调函数
   * @param {Function} onEnd - 结束回调函数
   * @param {Function} onError - 错误回调函数
   * @returns {Promise} 流式响应处理
   */
  async chatCompletions(params, callbacks = {}) {
    const { onMessage, onInterrupt, onEnd, onError } = callbacks
    
    try {
      const response = await fetch('http://47.98.215.181:8010/llmcenter/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          conversation_id: params.conversation_id || '',
          documenttype: params.documenttype,
          information: params.information,
          requests: params.requests,
          use_knowledge_base: params.use_knowledge_base || false,
          knowledge_base_id: params.knowledge_base_id || '',
          references: params.references || []
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() // 保留最后一行（可能不完整）
        
        for (const line of lines) {
          if (line.trim() === '') continue
          
          try {
            if (line.startsWith('event: ')) {
              const eventType = line.substring(7).trim()
              continue
            }
            
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.substring(6))
              
              // 根据事件类型调用相应的回调函数
              if (data.chunk && onMessage) {
                onMessage(data.chunk)
              } else if (data.content_type === 'document_outline' && onInterrupt) {
                onInterrupt(data)
              } else if (data.conversation_id && data.message_id && onEnd) {
                onEnd(data)
              }
            }
          } catch (parseError) {
            console.warn('解析SSE数据失败:', parseError, line)
          }
        }
      }
      
      return { success: true }
    } catch (error) {
      console.error('聊天请求失败:', error)
      if (onError) {
        onError(error)
      }
      return { success: false, error: error.message }
    }
  },

  /**
   * 继续工作流程（发送用户编辑好的内容）
   * @param {Object} params - 请求参数
   * @param {string} params.conversation_id - 会话ID
   * @param {string} params.content - 用户编辑的完整内容
   * @param {string} params.template_id - 模板ID（可选）
   * @param {Function} onMessage - 消息回调函数
   * @param {Function} onEnd - 结束回调函数
   * @param {Function} onError - 错误回调函数
   * @returns {Promise} 流式响应处理
   */
  async resumeChat(params, callbacks = {}) {
    const { onMessage, onEnd, onError } = callbacks
    
    try {
      const response = await fetch('http://47.98.215.181:8010/llmcenter/v1/chat/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          conversation_id: params.conversation_id,
          content: params.content,
          template_id: params.template_id || ''
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let currentEventType = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() // 保留最后一行（可能不完整）
        
        for (const line of lines) {
          if (line.trim() === '') continue
          
          try {
            if (line.startsWith('event: ')) {
              currentEventType = line.substring(7).trim()
              continue
            }
            
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.substring(6))
              
              // 根据事件类型调用相应的回调函数
              if (currentEventType === 'message' && data.chunk && onMessage) {
                onMessage(data.chunk)
              } else if (currentEventType === 'end' && onEnd) {
                onEnd(data)
              }
            }
          } catch (parseError) {
            console.warn('解析SSE数据失败:', parseError, line)
          }
        }
      }
      
      return { success: true }
    } catch (error) {
      console.error('恢复聊天请求失败:', error)
      if (onError) {
        onError(error)
      }
      return { success: false, error: error.message }
    }
  },

  /**
   * 编辑文档
   * @param {Object} params - 请求参数
   * @param {string} params.conversation_id - 会话ID
   * @param {string} params.message_id - 消息ID
   * @param {string} params.prompt - 修改要求
   * @param {boolean} params.use_knowledge_base - 是否使用知识库
   * @param {string} params.knowledge_base_id - 知识库ID（可选）
   * @param {Function} onMessage - 消息回调函数
   * @param {Function} onEnd - 结束回调函数
   * @param {Function} onError - 错误回调函数
   * @returns {Promise} 流式响应处理
   */
  async editDocument(params, callbacks = {}) {
    const { onMessage, onEnd, onError } = callbacks
    
    try {
      const response = await fetch('http://47.98.215.181:8010/llmcenter/v1/chat/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          conversation_id: params.conversation_id,
          message_id: params.message_id,
          prompt: params.prompt,
          use_knowledge_base: params.use_knowledge_base || false,
          knowledge_base_id: params.knowledge_base_id || ''
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()
        
        for (const line of lines) {
          if (line.trim() === '') continue
          
          try {
            if (line.startsWith('event: ')) continue
            
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.substring(6))
              
              if (data.chunk && onMessage) {
                onMessage(data.chunk)
              } else if (data.conversation_id && data.message_id && onEnd) {
                onEnd(data)
              }
            }
          } catch (parseError) {
            console.warn('解析SSE数据失败:', parseError, line)
          }
        }
      }
      
      return { success: true }
    } catch (error) {
      console.error('编辑文档请求失败:', error)
      if (onError) {
        onError(error)
      }
      return { success: false, error: error.message }
    }
  },

  /**
   * 更新文档内容
   * @param {Object} params - 请求参数
   * @param {string} params.conversation_id - 会话ID
   * @param {string} params.message_id - 消息ID
   * @param {string} params.prompt - 修改后的文章内容
   * @returns {Promise} 更新响应
   */
  async updateDocument(params) {
    try {
      const response = await api.post('/llmcenter/v1/chat/update', {
        conversation_id: params.conversation_id,
        message_id: params.message_id,
        prompt: params.prompt
      })
      
      return {
        success: response.data.success || true,
        data: response.data
      }
    } catch (error) {
      console.error('更新文档失败:', error)
      return {
        success: false,
        message: error.response?.data?.error?.message || '更新文档失败'
      }
    }
  }
}

export default documentService