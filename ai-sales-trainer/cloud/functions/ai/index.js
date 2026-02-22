// 云函数：AI统一接口
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const axios = require('axios');

// 统一调用大模型
async function callLLM(prompt, provider = 'qwen') {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  
  const response = await axios.post(
    'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    {
      model: 'qwen-turbo',
      input: { messages: [{ role: 'user', content: prompt }] },
      parameters: { result_format: 'message' }
    },
    {
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      timeout: 30000
    }
  );
  return response.data.output.choices[0].message.content;
}

async function callLLMJSON(prompt) {
  const content = await callLLM(prompt + '\n\n请以JSON格式返回。');
  const match = content.match(/\{[\s\S]*\}/);
  if (match) return JSON.parse(match[0]);
  throw new Error('No JSON found');
}

exports.main = async (event, context) => {
  const { type, question, context: ctx = {} } = event;
  
  try {
    let result;
    switch (type) {
      case 'qa':
        result = await callLLMJSON(`你是一个专业销售顾问。客户问题：${question}。请以JSON一句话版本":"...返回：{"","详细解释":"...","引导问题":["..."],"行动建议":"..."}`);
        break;
      case 'training':
        if (ctx.user_answer) {
          result = await callLLMJSON(`评测销售回答。题目：${question}，回答：${ctx.user_answer}。请以JSON返回：{"得分":0-100,"差距分析":"...","优化建议":["..."]}`);
        } else {
          result = await callLLMJSON(`生成销售训练题目。请以JSON返回：{"题目":"...","考察点":"..."}`);
        }
        break;
      case 'summary':
        result = await callLLMJSON(`生成接待总结。客户：${ctx.customer_name}，需求：${ctx.需求}，预算：${ctx.budget}，成交：${ctx.is_deal}。请以JSON返回：{"客户画像":"...","核心需求":"...","成交概率":"高/中/低","下一步建议":"...","微信草稿":"..."}`);
        break;
      default:
        result = await callLLM(question);
    }
    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
