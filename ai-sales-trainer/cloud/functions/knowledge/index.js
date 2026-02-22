// 云函数：知识库管理
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { action, data } = event;
  
  try {
    switch (action) {
      case 'add':
        const doc = await db.collection('knowledge').add({
          data: {
            title: data.title,
            content: data.content,
            chunks: chunkText(data.content),
            createTime: db.serverDate()
          }
        });
        return { success: true, id: doc._id };
        
      case 'list':
        const list = await db.collection('knowledge').get();
        return { success: true, data: list.data };
        
      case 'search':
        const searchRes = await db.collection('knowledge').where({
          content: db.RegExp({ regexp: data.q, options: 'i' })
        }).limit(5).get();
        return { success: true, data: searchRes.data };
        
      default:
        return { success: false, message: 'Unknown action' };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

function chunkText(text, size = 200) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push({ id: chunks.length, content: text.slice(i, i + size) });
  }
  return chunks;
}
