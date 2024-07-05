// api/send-telegram.ts
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "6916562215:AAGlHgtBpzEXBFqdDnHrErtNUFHRhSTTjYk";
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") || "-1002105118803";

const router = new Router();

router.post("/api/send-telegram", async (ctx) => {
  const body = await ctx.request.body().value;
  const { pair, timeframe, strategy, entryPrice, stopLoss, takeProfit, notes } = body;

  const message = `
🚀 توصية جديدة! 🚀

🔸 الزوج: ${pair}
⏱️ الإطار الزمني: ${timeframe}
📊 الاستراتيجية: ${strategy}

💹 سعر الدخول: ${entryPrice}
🛑 وقف الخسارة: ${stopLoss}
🎯 هدف الربح: ${takeProfit}

📝 ملاحظات:
${notes}

⚠️ تذكير: هذه التوصية للأغراض التعليمية فقط. يرجى إجراء البحث الخاص بك قبل اتخاذ أي قرارات استثمارية.

🍀 حظاً موفقاً وتداولاً آمناً! 🍀
  `;

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    if (!response.ok) {
      throw new Error("فشل في إرسال الرسالة إلى Telegram");
    }

    ctx.response.status = 200;
    ctx.response.body = { success: true, message: "تم إرسال التوصية بنجاح" };
  } catch (error) {
    console.error("خطأ:", error);
    ctx.response.status = 500;
    ctx.response.body = { success: false, message: "حدث خطأ أثناء إرسال التوصية" };
  }
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });