import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import sessionsData from "./data/sessions.json";
import { ConfDay, Session } from "./types";
import {
  ACTIVE_SESSIONS_SEARCH_PARAM_KEY,
  CONFERENCE_TIMEZONE,
} from "./constants";

dayjs.extend(utc);
dayjs.extend(timezone);

export function retrieveDefaultConfDay(days: Array<ConfDay>): string | undefined {
  if (days.length === 0) return undefined;

  const todayInConfTimezone = dayjs().tz(CONFERENCE_TIMEZONE).format("YYYY-MM-DD");
  const confDayMatchingToday = days.find(
    (day) => dayjs.utc(day.date).format("YYYY-MM-DD") === todayInConfTimezone
  );

  return (confDayMatchingToday ?? days[0]).name.long;
}

export function retrieveConfYear(format = "YYYY") {
  const firstStartsAt = sessionsData[0]?.sessions[0]?.startsAt;
  return firstStartsAt ? dayjs.utc(firstStartsAt).format(format) : "";
}

export function retrieveSortedSessionsByDay(sessions: Map<string, Session>) {
  const sortedSessions = [...sessions.values()]?.sort((sessionA, sessionB) => {
    const parsedSessionA = dayjs.utc(sessionA.startsAt);
    const parsedSessionB = dayjs.utc(sessionB.startsAt);

    if (parsedSessionA.isBefore(parsedSessionB)) return -1;
    if (parsedSessionA.isAfter(parsedSessionB)) return 1;
    return 0;
  });

  return sortedSessions;
}

export function setActiveSessionsInUrl(stringifiedActiveSessions: string) {
  const url = new URL(window.location.href);
  url.searchParams.set(ACTIVE_SESSIONS_SEARCH_PARAM_KEY, btoa(stringifiedActiveSessions));
  window.history.replaceState({}, "", url.toString());
}