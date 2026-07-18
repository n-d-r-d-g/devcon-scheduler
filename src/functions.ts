import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import sessionsData from "./data/sessions.json";
import { Session } from "./types";
import { ACTIVE_SESSIONS_SEARCH_PARAM_KEY } from "./constants";

dayjs.extend(utc);

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