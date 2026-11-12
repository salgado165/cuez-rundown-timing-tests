const DURATION_PATTERN = /^(\d{1,2}):([0-5]\d)$/;
const CLOCK_PATTERN = /^(\d{2}):([0-5]\d):([0-5]\d)$/;

export function parseDuration(input) {
  const match = DURATION_PATTERN.exec(String(input));
  if (!match) throw new Error("Enter a duration as mm:ss, with seconds from 00 to 59.");
  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  if (minutes > 59) throw new Error("Duration cannot be longer than 59:59.");
  return minutes * 60 + seconds;
}

export function applyDurationInput(previousSeconds, input) {
  try {
    return { accepted: true, valueSeconds: parseDuration(input), error: null };
  } catch (error) {
    return { accepted: false, valueSeconds: previousSeconds, error: error.message };
  }
}

function parseClockTime(value) {
  const match = CLOCK_PATTERN.exec(String(value));
  if (!match || Number(match[1]) > 23) throw new Error("Clock time must be a valid HH:mm:ss value.");
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
}

function formatClockTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

export function calculateRundown(items, onAirStart, hardOut) {
  const startSeconds = parseClockTime(onAirStart);
  const hardOutSeconds = parseClockTime(hardOut);
  if (hardOutSeconds < startSeconds) throw new Error("This version assumes the hard out is on the same day as the start.");

  for (const item of items) {
    if (!Number.isInteger(item.durationSeconds) || item.durationSeconds < 0) {
      throw new Error("Each item must have a non-negative duration in seconds.");
    }
  }

  const activeItems = items.filter((item) => !item.floated);
  const totalPlannedSeconds = activeItems.reduce((total, item) => total + item.durationSeconds, 0);
  const overUnderSeconds = hardOutSeconds - startSeconds - totalPlannedSeconds;
  const overUnderColor = overUnderSeconds < 0 ? "red" : overUnderSeconds > 0 ? "green" : "on-time";

  let durationAfter = 0;
  const backTimes = {};
  for (let index = activeItems.length - 1; index >= 0; index -= 1) {
    const item = activeItems[index];
    backTimes[item.id] = formatClockTime(hardOutSeconds - durationAfter - item.durationSeconds);
    durationAfter += item.durationSeconds;
  }

  return { totalPlannedSeconds, overUnderSeconds, overUnderColor, backTimes };
}
