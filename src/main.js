import { Telegraf } from "telegraf";
import config from 'config';
import db from '../models/index.cjs';


const bot = new Telegraf(config.get("TELEGRAM_TOKEN"), {
    handlerTimeout: Infinity,
})

bot.telegram.setMyCommands([
    {command: "/start", description: "Перезапустить бота"},
    {command: "/tasks", description: "Показать доступные задачи"}
])

bot.command("start", (ctx) => {
    ctx.reply("hello")
})

bot.command("tasks", async (ctx) => {
    const tasks = await db.tasks.findAll()
    console.log(tasks)
})

bot.launch()