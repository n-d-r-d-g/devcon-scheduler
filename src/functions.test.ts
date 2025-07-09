import { describe, expect, test } from "@jest/globals";
import { retrieveSortedSessionsByDay } from "./functions";
import { Session } from "./types";

describe("retrieveSortedSessionsByDay", () => {
  test("sorts sessions by start time", () => {
    const session1: Session = {
      id: "1",
      title: "Title 1",
      startsAt: "2025-07-24T09:00:00",
      endsAt: "2025-07-24T15:00:00",
      description: "Description 1",
      since: "2025-07-24T09:00:00",
      till: "2025-07-24T15:00:00",
      image: "",
      channelUuid: "",
      speakers: [],
      isActive: true,
      room: "-1",
      index: -1,
    };
    const session2: Session = {
      id: "2",
      title: "Title 2",
      startsAt: "2025-07-24T10:00:00",
      endsAt: "2025-07-24T10:45:00",
      description: "Description 2",
      since: "2025-07-24T10:00:00",
      till: "2025-07-24T10:45:00",
      image: "",
      channelUuid: "",
      speakers: [],
      isActive: true,
      room: "-1",
      index: -1,
    };
    const session3: Session = {
      id: "3",
      title: "Title 3",
      startsAt: "2025-07-24T11:00:00",
      endsAt: "2025-07-24T11:45:00",
      description: "Description 3",
      since: "2025-07-24T11:00:00",
      till: "2025-07-24T11:45:00",
      image: "",
      channelUuid: "",
      speakers: [],
      isActive: true,
      room: "-1",
      index: -1,
    };
    const session4: Session = {
      id: "4",
      title: "Title 4",
      startsAt: "2025-07-24T13:00:00",
      endsAt: "2025-07-24T13:30:00",
      description: "Description 4",
      since: "2025-07-24T13:00:00",
      till: "2025-07-24T13:30:00",
      image: "",
      channelUuid: "",
      speakers: [],
      isActive: true,
      room: "-1",
      index: -1,
    };
    const session5: Session = {
      id: "5",
      title: "Title 5",
      startsAt: "2025-07-24T14:00:00",
      endsAt: "2025-07-24T14:45:00",
      description: "Description 5",
      since: "2025-07-24T14:00:00",
      till: "2025-07-24T14:45:00",
      image: "",
      channelUuid: "",
      speakers: [],
      isActive: true,
      room: "-1",
      index: -1,
    };
    const unsortedSessions = new Map([
      [session3.id, session3],
      [session1.id, session1],
      [session4.id, session4],
      [session5.id, session5],
      [session2.id, session2],
    ]);

    expect(retrieveSortedSessionsByDay(unsortedSessions)).toStrictEqual([
      session1,
      session2,
      session3,
      session4,
      session5,
    ]);
  });
});
