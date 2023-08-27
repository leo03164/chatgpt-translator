import axios from 'axios';
import { config } from 'dotenv';

config();

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
};

// Chinese | Japanese | Unknown
function detectLanguage(text) {
  let countCn = 0;
  let countJp = 0;

  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);

    if((code >= 0x4E00 && code <= 0x9FFF)){
      continue;
    }

    if (
          (code >= 0x3400 && code <= 0x4DBF) // CJK Unified Ideographs Extension A
          || (code >= 0x20000 && code <= 0x2A6DF) // CJK Unified Ideographs Extension B
          || (code >= 0x2A700 && code <= 0x2B73F) // CJK Unified Ideographs Extension C
          || (code >= 0x2B740 && code <= 0x2B81F) // CJK Unified Ideographs Extension D
          || (code >= 0x2B820 && code <= 0x2CEAF) // CJK Unified Ideographs Extension E
          || (code >= 0x2CEB0 && code <= 0x2EBEF) // CJK Unified Ideographs Extension F
          || (code >= 0xF900 && code <= 0xFAFF) // CJK Compatibility Ideographs
    ) {
      countCn += 1;
      continue;
    }

    if (
          (code >= 0x3040 && code <= 0x309F) // Hiragana
          || (code >= 0x30A0 && code <= 0x30FF) // Katakana
          || (code >= 0x31F0 && code <= 0x31FF) // Katakana
      ) {
      countJp += 1;
      continue;
    }
  }

  if (countCn > countJp) {
    return 'Chinese';
  } 
  
  if (countJp > countCn) {
    return 'Japanese';
  } 
  
  return 'Unknown';
}

export async function aiReply(text) {
  const translateTarget = {
    Chinese: '日文',
    Japanese: '繁體中文',
  };

  const sourceLang = detectLanguage(text);
  if (!translateTarget[sourceLang]) {
    return '';
  }

  const rules = [
    { role: 'system', content: `請將以下內容翻譯成${translateTarget[sourceLang]}` },
  ];

  const chatGptConfig = {
    model: 'gpt-3.5-turbo',
    temperature: 0.3,
    messages: [...rules, { role: 'user', content: text }],
  };

  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await axios.post(process.env.CHATGPT_API_URL, chatGptConfig, { headers });
      let aiReplyMsg = response.data.choices[0].message.content;
      console.log('來自AI的回答:', aiReplyMsg);
      aiReplyMsg = aiReplyMsg.trim();
      return aiReplyMsg;
    } catch (error) {
      console.error('發生錯誤:', error);
      retries += 1;
      console.log(`重試中，第 ${retries} 次`);
    }
  }

  throw new Error('Fail');
}
