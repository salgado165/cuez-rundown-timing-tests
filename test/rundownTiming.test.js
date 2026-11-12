import assert from "node:assert/strict";
import test from "node:test";
import { applyDurationInput, calculateRundown, parseDuration } from "../src/rundownTiming.js";

test("rundown timing excludes floated items and calculates back-times", () => {
  const result = calculateRundown(
    [
      { id: "intro", durationSeconds: 5 * 60, floated: false },
      { id: "weather", durationSeconds: 6 * 60, floated: true },
      { id: "final-story", durationSeconds: 19 * 60, floated: false },
    ],
    "18:00:00",
    "18:30:00",
  );
  assert.equal(result.totalPlannedSeconds, 24 * 60);
  assert.equal(result.overUnderSeconds, 6 * 60);
  assert.equal(result.overUnderColor, "green");
  assert.deepEqual(result.backTimes, { intro: "18:06:00", "final-story": "18:11:00" });
});

test("duration input accepts the limit and keeps the previous value when invalid", () => {
  assert.equal(parseDuration("1:30"), 90);
  assert.equal(parseDuration("59:59"), 59 * 60 + 59);
  const invalidMinutes = applyDurationInput(90, "90");
  assert.equal(invalidMinutes.accepted, false);
  assert.equal(invalidMinutes.valueSeconds, 90);
  assert.match(invalidMinutes.error, /mm:ss/);
  const tooLong = applyDurationInput(90, "60:00");
  assert.equal(tooLong.accepted, false);
  assert.equal(tooLong.valueSeconds, 90);
});
