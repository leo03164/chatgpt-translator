import * as dotenv from 'dotenv';

dotenv.config();

const LINE_CHAT_BOT_CONFIG = {
  channelId: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  httpConfig: {
    timeout: 30000,
  },
};

export default LINE_CHAT_BOT_CONFIG;
