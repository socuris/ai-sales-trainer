// 云函数：接待总结
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { action, data } = event;
  
  try {
    switch (action) {
      case 'generate':
        // 调用AI生成总结（复用ai云函数）
        return await cloud.callFunction({
          name: 'ai',
          data: { 
            type: 'summary', 
            context: {
              customer_name: data.customer_name,
              需求: data.需求,
              budget: data.budget,
              is_deal: data.is_deal
            }
          }
        });
        
      case 'save':
        await db.collection('summaries').add({
          data: {
            customer_name: data.customer_name,
            需求: data.需求,
            budget: data.budget,
            is_deal: data.is_deal,
            result: data.result,
            createTime: db.serverDate()
          }
        });
        return { success: true };
        
      case 'list':
        const list = await db.collection('summaries').get();
        return { success: true, data: list.data };
        
      default:
        return { success: false, message: 'Unknown action' };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};
