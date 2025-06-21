import { AGENDA_DATE_TIME_FORMAT } from "@/constants";
import { ConfDay, SessionsByDay } from "@/types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import roomsData from "../data/rooms.json";
import sessionsData from "../data/sessions.json";
import { Agenda } from "./components/Agenda";

dayjs.extend(utc);

export default async function Home() {
  let defaultConfDay: undefined | string;
  const sessionsByDay: SessionsByDay = {};
  const confDays: Array<ConfDay> = [];
  const roomMap: Record<string, string> = {};
  const rooms = roomsData.map((room) => {
    roomMap[room.id] = room.name;

    return {
      uuid: room.id,
      type: "channel",
      title: room.name,
      logo: "",
    };
  });
  const stringifiedRooms = JSON.stringify(rooms);
  const timelineRangeByDay: Record<
    string,
    Record<"start" | "end", string>
  > = {};

  sessionsData.forEach((dayWithSessions) => {
    const currConfDay = dayWithSessions.groupName;

    if (!defaultConfDay && dayWithSessions.isDefault) {
      defaultConfDay = dayWithSessions.groupName;
    }

    confDays.push({
      name: {
        long: currConfDay,
        short: currConfDay.slice(0, 3),
      },
      date: dayWithSessions.sessions[0].startsAt,
    });

    const currConfDayFirstSession = dayWithSessions.sessions?.[0];
    const firstSessionStartsAt = dayjs.utc(
      currConfDayFirstSession?.startsAt ?? "1970-01-01T08:30:00"
    );
    const currConfDayRegStartsAt = firstSessionStartsAt
      .clone()
      .set("hours", 8)
      .set("minutes", 30)
      .set("seconds", 0); // 08:30
    const currConfDayRegEndsAt = firstSessionStartsAt
      .clone()
      .set("hours", 15)
      .set("minutes", 0)
      .set("seconds", 0); // 15:00
    const registrationSession = {
      id: "registration",
      title: "Registration",
      description: "Registration",
      startsAt: currConfDayRegStartsAt.format(AGENDA_DATE_TIME_FORMAT),
      endsAt: currConfDayRegEndsAt.format(AGENDA_DATE_TIME_FORMAT),
      roomId: "-1",
      speakers: [],
      image: "",
      isClickDisabled: true,
    };

    const currDaySessions = [registrationSession, ...dayWithSessions.sessions];
    sessionsByDay[currConfDay] = currDaySessions.map((session, index) => ({
      id: session.id,
      title: session.title,
      description: session.description ?? "",
      startsAt: session.startsAt,
      endsAt: session.endsAt,
      since: session.startsAt,
      till: session.endsAt,
      channelUuid: session.roomId,
      room: roomMap[session.roomId] ?? "",
      speakers: session.speakers.map((speaker) => speaker.name),
      image: "",
      isActive: false,
      index,
      isClickDisabled:
        (session as typeof registrationSession).isClickDisabled ?? false,
    }));

    const lastSessionEndsAt = dayjs.utc(
      sessionsByDay[currConfDay][sessionsByDay[currConfDay].length - 1].endsAt
    );
    const timelineRangeEndsAtHours =
      lastSessionEndsAt.minute() === 0 && lastSessionEndsAt.hour() === 0
        ? lastSessionEndsAt.hour()
        : lastSessionEndsAt.hour() + 1 === 23
        ? 23
        : lastSessionEndsAt.hour() + 1;
    const timelineRangeEndsAt = lastSessionEndsAt
      .clone()
      .set("hours", timelineRangeEndsAtHours)
      .set("minutes", 0)
      .set("seconds", 0);
    timelineRangeByDay[currConfDay] = {
      start: firstSessionStartsAt
        .clone()
        .set("hours", 8)
        .set("minutes", 0)
        .set("seconds", 0)
        .format(AGENDA_DATE_TIME_FORMAT),
      end: timelineRangeEndsAt.format(AGENDA_DATE_TIME_FORMAT),
    };
  });

  const stringifiedSessionsByDay = JSON.stringify(sessionsByDay);
  const stringifiedConfDays = JSON.stringify(confDays);
  const stringifiedTimelineRangeByDay = JSON.stringify(timelineRangeByDay);

  return (
    <Agenda
      stringifiedSessionsByDay={stringifiedSessionsByDay}
      stringifiedRooms={stringifiedRooms}
      stringifiedDays={stringifiedConfDays}
      stringifiedTimelineRangeByDay={stringifiedTimelineRangeByDay}
      defaultDay={defaultConfDay}
    />
  );
}
