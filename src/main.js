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
    {command: "active_tasks", description: "Показать активные задачи"}
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

// bot.command("active_tasks", async (ctx) => {
//     try {
//         const tasks = await db.tasks.findAll({where: {status: 1}})

//         if (tasks.length == 0) {
//             ctx.reply("Нет активных задач")
//             return
//         }

//         const activeTasks = [];

//         tasks.forEach(task => {
//             activeTasks.push([Markup.button.callback(task.name, `task_${task.id}`)])
//         })

//         console.log(activeTasks)
//         ctx.reply('Меню:', Markup.inlineKeyboard(
//             activeTasks
//         ))

//     } catch(e) {
//         console.log(e)
//         ctx.reply("Ошибка")
//     }
// })


// bot.hears("task", (ctx) => {
//     ctx.reply(
//         'Выберите день:',
//         Markup.inlineKeyboard([
//         [Markup.button.callback('Суббота 06 декабря', 'day_2025-12-06')],
//         [Markup.button.callback('Пятница 05 декабря', 'day_2025-12-05')],
//         [Markup.button.callback('Четверг 04 декабря', 'day_2025-12-04')],
//         [Markup.button.callback('Назад', 'back')]
//         ])
//     );
// });

bot.on(message('text'), (ctx) => {
    ctx.reply("Неизвестный текст")
})

bot.launch()