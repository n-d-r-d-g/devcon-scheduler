// Fetches the conference agenda from the Sessionize GridSmart API and writes it
// to src/data/sessions.json in the shape the app (src/app/page.tsx) expects.
//
// The API data changes as the agenda is finalised, so re-run this whenever the
// schedule is updated:
//
//   npm run update:sessions
//
// Override the Sessionize view id with SESSIONIZE_VIEW_ID if it ever changes:
//
//   SESSIONIZE_VIEW_ID=xxxxxxxx npm run update:sessions
//
// TIMEZONE NOTE: the conference is in Mauritius and the API returns local
// Mauritian date/times (no offset, e.g. "2026-07-23T09:30:00"). This script is
// timezone-independent on purpose so anyone, anywhere, gets identical output:
//   * startsAt/endsAt are copied verbatim and never parsed into a Date, so the
//     runner's local timezone can't shift them.
//   * the weekday name is computed from the calendar date components via
//     Date.UTC()/getUTCDay() (pure date arithmetic) rather than
//     `new Date(str)`, which would apply the runner's local timezone.

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const VIEW_ID = process.env.SESSIONIZE_VIEW_ID ?? "67cafpod";
const API_URL = `https://sessionize.com/api/v2/${VIEW_ID}/view/GridSmart`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "..", "src", "data", "sessions.json");

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Derive a weekday name from a `YYYY-MM-DDT...` date string.
 * Uses only the calendar date components with Date.UTC(), so the result is the
 * same regardless of the machine's local timezone.
 */
function weekdayName(dateStr) {
  const [year, month, day] = dateStr.slice(0, 10).split("-").map(Number);
  return WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
}

/** Stable, date-derived group id (e.g. 2026-07-23 -> 20260723). */
function groupIdFromDate(dateStr) {
  return Number(dateStr.slice(0, 10).replace(/-/g, ""));
}

function mapSession(session) {
  return {
    questionAnswers: [],
    id: session.id,
    title: session.title,
    description: session.description ?? null,
    startsAt: session.startsAt,
    endsAt: session.endsAt,
    isServiceSession: session.isServiceSession,
    isPlenumSession: session.isPlenumSession,
    speakers: session.speakers ?? [],
    categories: session.categories ?? [],
    roomId: String(session.roomId),
    room: session.room,
    liveUrl: session.liveUrl ?? null,
    recordingUrl: session.recordingUrl ?? null,
    status: session.status ?? null,
    isInformed: session.isInformed ?? false,
    isConfirmed: session.isConfirmed ?? false,
  };
}

async function main() {
  console.log(`Fetching agenda from ${API_URL} ...`);
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch agenda: ${response.status} ${response.statusText}`
    );
  }

  const days = await response.json();

  const sessionsByDay = days.map((day) => {
    // GridSmart nests sessions under each room; flatten and order by start time
    // (then by room) so the agenda renders chronologically. Sorting on the raw
    // ISO-like strings is a lexicographic compare, which is also TZ-independent.
    const sessions = day.rooms
      .flatMap((room) => room.sessions)
      .sort((a, b) => {
        if (a.startsAt !== b.startsAt) {
          return a.startsAt.localeCompare(b.startsAt);
        }
        return String(a.roomId).localeCompare(String(b.roomId));
      })
      .map(mapSession);

    return {
      groupId: groupIdFromDate(day.date),
      groupName: weekdayName(day.date),
      isDefault: day.isDefault ?? false,
      sessions,
    };
  });

  await writeFile(OUTPUT_PATH, `${JSON.stringify(sessionsByDay, null, 2)}\n`);

  const totalSessions = sessionsByDay.reduce(
    (sum, day) => sum + day.sessions.length,
    0
  );
  console.log(
    `Wrote ${sessionsByDay.length} day(s) and ${totalSessions} session(s) to ${OUTPUT_PATH}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
