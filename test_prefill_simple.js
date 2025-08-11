// 简单的预填充测试脚本
console.clear();
console.log('🔧 开始测试预填充功能...');

// 检查当前页面
if (window.location.pathname !== '/document/checklist') {
    console.log('⚠️ 请在信息清单页面执行此脚本');
    console.log('当前页面:', window.location.pathname);
} else {
    console.log('✅ 当前在信息清单页面');
    
    // 获取Vue应用
    const app = document.querySelector('#app').__vue_app__;
    if (!app) {
        console.error('❌ Vue应用未找到！');
    } else {
        console.log('✅ Vue应用找到');
        
        // 获取stores
        const stores = app.config.globalProperties.$pinia._s;
        const documentStore = stores.get('document');
        if (!documentStore) {
            console.error('❌ Document store未找到！');
            console.log('可用stores:', Array.from(stores.keys()));
        } else {
            console.log('✅ Document store找到');
            
            // 设置测试数据
            const testContent = `
### 开学通知基本信息：
   - 开学日期：2025年9月10日
   - 开学地点（如校区、教学楼等）：主校区教学楼
   - 具体报到/开学时间段：上午8:00-下午5:00
`;
            
            console.log('📝 设置测试数据...');
            documentStore.setConversationInfo({
                conversationId: 'TEST_ID_' + Date.now(),
                messageId: 'TEST_MSG_' + Date.now(), 
                checklistContent: testContent,
                content: testContent,
                data: { content: testContent }
            });
            
            console.log('✅ 测试数据设置完成');
            console.log('📋 conversationInfo:', documentStore.conversationInfo);
            
            // 等待一下然后刷新页面
            console.log('🔄 2秒后刷新页面以触发预填充...');
            setTimeout(() => {
                console.log('🔄 正在刷新页面...');
                window.location.reload();
            }, 2000);
        }
    }
}

console.log('⏰ 请观察控制台输出和页面变化...');