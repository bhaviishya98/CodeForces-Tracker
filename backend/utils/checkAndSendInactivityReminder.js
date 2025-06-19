import sendMail from "./sendMail.js";

const checkAndSendInactivityReminder = async (student, lastSubmissionDate) => {
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const inactive =
    lastSubmissionDate &&
    now - new Date(lastSubmissionDate).getTime() > SEVEN_DAYS_MS;

  if (!inactive || student.autoEmailDisabled) return;

  try {
    await sendMail({
      to: student.email,
      subject: "Get Back to Codeforces!",
      text: `Hi ${student.name},\n\nWe noticed you haven't submitted anything on Codeforces in the last 7 days. Time to get back to solving problems!\n\n- CodeForces Tracker Team`,
    });

    student.inactivityReminderCount =
      (student.inactivityReminderCount || 0) + 1;

    console.log(`📩 Sent inactivity reminder to ${student.name}`);
  } catch (err) {
    console.error(`❌ Failed to send email to ${student.name}:`, err.message);
  }
};

export default checkAndSendInactivityReminder;
