import * as dotenv from 'dotenv';
import { aiReply } from './module/service/chatgptService';
import LINE_CHAT_BOT_CONFIG from './config/lineChatBot';

dotenv.config();
const express = require('express');
const linebot = require('linebot');

const app = express();
const bot = linebot(LINE_CHAT_BOT_CONFIG);

bot.on('message', async (event) => {
  try {
    const msg = event.message.text;
    if (!msg) return;
    const aiReplyMsg = await aiReply(msg);
    if (!aiReplyMsg) return;
    event.reply(aiReplyMsg);
  } catch (err) {
    event.reply('我出了點問題，請聯繫 leo 他會修好我');
  }
});

app.post('/', bot.parser());
app.listen(process.env.PORT || 32003, () => {
  console.log('App is running on port', process.env.PORT || 32003);
});
