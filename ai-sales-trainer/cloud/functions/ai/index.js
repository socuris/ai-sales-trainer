// 云函数：AI统一接口
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const axios = require('axios');
const crypto = require('crypto');

// 腾讯混元大模型调用
async function callTencent(prompt) {
  const secretId = process.env.TENCENT_SECRET_ID;
  const secretKey = process.env.TENCENT_SECRET_KEY;
  const region = 'ap-guangzhou';
  const endpoint = 'huan.tencentcloudapi.com';
  const timestamp = Math.floor(Date.now() / 1000);
  const date = new Date(timestamp * 1000).toISOString().split('T')[0];
  
  // 签名
  const canonicalUri = '/';
  const canonicalQueryString = `Action=ChatCompletions&Version=2023-09-01&Prompt=${encodeURIComponent(prompt)}&Model=huan-Standard`;
  const canonicalHeaders = `content-type:application/json\nhost:${endpoint}\n`;
  const signedHeaders = 'content-type;host';
  const payload = JSON.stringify({ Prompt: prompt, Model: 'huan-Standard' });
  
  const hashedPayload = crypto.createHash('sha256').update(payload).digest('hex');
  const canonicalRequest = `POST\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${hashedPayload}`;
  
  const algorithm = 'TC3-HMAC-SHA256';
  const credentialScope = `${date}/${endpoint}/tc3_request`;
  const hashedCanonicalRequest = crypto.createHash('sha256').update(canonicalRequest).digest('hex');
  const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${hashedCanonicalRequest}`;
  
  const secretDate = crypto.createHmac('sha256', 'TC3' + secretKey).update(date).digest();
  const secretSigning = crypto.createHmac('sha256', secretDate).update(endpoint).digest();
  const signature = crypto.createHmac('sha256', secretSigning).update(stringToSign).digest('hex');
  
  const authorization = `${algorithm} Credential=${secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  
  const response = await axios.post(
    `https://${endpoint}?Action=ChatCompletions&Version=2023-09-01`,
    { Prompt: prompt, Model: 'huan-Standard' },
    {
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
        'X-TC-Action': 'ChatCompletions',
        'X-TC-Version': '2023-09-01',
        'X-TC-Timestamp': timestamp.toString(),
        'X-TC-Region': region
      },
      timeout: 30000
    }
  );
  
  return response.data.Response.Choices[0].Message.Content;
}

async function callLLM(prompt) {
  // 默认使用腾讯混元
  return await callTencent(prompt);
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
        result = await callLLMJSON(`你是一个专业销售顾问。客户问题：${question}。请以JSON返回：{"一句话版本":"...","详细解释":"...","引导问题":["..."],"行动建议":"..."}`);
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
