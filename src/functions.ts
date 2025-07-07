import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Session } from "./types";

dayjs.extend(utc);

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
