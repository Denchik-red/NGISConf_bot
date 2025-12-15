import { Telegraf, Markup } from "telegraf";
import config from 'config';
import db from '../models/index.cjs';
import { message } from "telegraf/filters";

const userState = new Map();

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"), {
    handlerTimeout: Infinity,
})

bot.telegram.setMyCommands([
    {command: "start", description: "Перезапустить бота"},
    {command: "tasks", description: "Показать все задачи"},
])

bot.command("start", (ctx) => {
    ctx.reply("hello")
})

bot.command("tasks", async (ctx) => {
    try {

        ctx.reply("Список видов работ", Markup.inlineKeyboard([
            [Markup.button.callback("Задание1", "task_1")],
            [Markup.button.callback("Задание2", "task_2")],
            [Markup.button.callback("Задание3", "task_3")],
            [Markup.button.callback("Задание4", "task_4")],
            [Markup.button.callback("Задание5", "task_5")]
        ]))

    } catch (e) {
        console.log(e)
        ctx.reply("Не удалось получить список задач")
    }
})

bot.action(/^task_/, (ctx) => {
    const userId = ctx.from.id;
    console.log("userid: ", userId)
    const taskTypeId = ctx.callbackQuery.data.split('_')[1];
    ctx.answerCbQuery();
    ctx.editMessageText(`Вы выбрали тип задачи: ${taskTypeId}`);
    ctx.reply("Теперь введите id выполненной задачи.");
    userState.set(userId, { expecting: 'complite_task_id', taskTypeId });
});

bot.on(message('text'), async (ctx, next) => {
    const userId = ctx.from.id;
    console.log("userid: ", userId)
    const state = userState.get(userId);

    if (state?.expecting === 'complite_task_id') {
        const taskId = ctx.message.text;
        const { taskTypeId } = state;

        if (/^[0-9]+$/.test(taskId) === false) { // делаем валидацию по длине id
            ctx.reply("Направельный формат id задачи")
            return
        }
        
        try {
            // если все норм то обновляем статус
        } catch(e) {
            console.log(e)
            ctx.reply("Неудалось обновить статус задачи")
            return
        }

        await ctx.reply(`Задача "${taskId}" выполнена.`);

        userState.delete(userId);
        return;
    }
    return next();
});

bot.on(message('text'), (ctx) => {
    ctx.reply("Неизвестный текст")
})

bot.launch()