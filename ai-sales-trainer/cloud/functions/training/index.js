// 云函数：训练系统
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { action, data } = event;
  
  try {
    switch (action) {
      case 'generate':
        // 调用AI生成题目（复用ai云函数）
        const cloudFunc = cloud.callFunction({
          name: 'ai',
          data: { type: 'training', question: '生成一道销售训练题目' }
        });
        return cloudFunc;
        
      case 'submit':
        await db.collection('training_records').add({
          data: {
            question_id: data.question_id,
            question: data.question,
            answer: data.answer,
            result: data.result,
            createTime: db.serverDate()
          }
        });
        return { success: true };
        
      case 'list':
        const list = await db.collection('training_records').get();
        return { success: true, data: list.data };
        
      default:
        return { success: false, message: 'Unknown action' };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};
