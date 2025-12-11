import { Telegraf } from "telegraf";
import config from 'config';

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"), {
    handlerTimeout: Infinity,
})

bot.command("start", (ctx) => {
    ctx.reply("hello")
})

bot.launch()