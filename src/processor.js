require("dotenv").config();
const { 
  BOT_TOKEN
} = process.env;

const TelegramBot = require("node-telegram-bot-api");
const token = BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

module.exports = async (job, done) => {
  const { chatId, message } = job.data;  
  bot.sendMessage(chatId, message, {parse_mode: 'HTML', disable_web_page_preview: true});
  job.progress(100);
  done(null, 0);
}