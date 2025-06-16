const cron = require("node-cron");
const db = require("./models/db");

// Runs every minute to delete old reminders
cron.schedule("* * * * *", async () => {
  try {
    const [deleted] = await db.execute(`
      DELETE FROM reminders WHERE due_date < NOW() - INTERVAL 1 DAY
    `);

    if (deleted.affectedRows > 0) {
      console.log(`Deleted ${deleted.affectedRows} old reminders.`);
    }
  } catch (err) {
    console.error("Scheduler error:", err);
  }
});
