"use client";

import {
  AGENDA_DATE_TIME_FORMAT,
  AGENDA_THEME,
  EXPORT_TIME_FORMAT,
} from "@/constants";
import { Room, Session } from "@/types";
import { Button } from "@nextui-org/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Epg, Layout, Program, ProgramItem, useEpg } from "planby";
import { Position } from "planby/dist/Epg/helpers/types";
import { useCallback, useRef, useState } from "react";
import {
  LuCheckCheck as LuCheckCheckIcon,
  LuCopy as LuCopyIcon,
} from "react-icons/lu";
import { RoomName } from "./RoomName";
import { PDFPreview } from "./PDFPreview";
import { SessionCard } from "./SessionCard";
import { Timeline } from "./Timeline";

dayjs.extend(utc);

type Props = {
  stringifiedSessionsByDay: string;
  stringifiedRooms: string;
  stringifiedDays: string;
  stringifiedTimelineRangeByDay: string;
  defaultDay?: string;
};

type DaysProps = {
  days: Array<string>;
  activeDay: string;
  onClick: (day: string) => void;
};

function Days({ days, activeDay, onClick }: DaysProps) {
  const handleClick = useCallback(
    (day: string) => () => onClick(day),
    [onClick]
  );

  return days.map((day) => (
    <Button
      key={day}
      type="button"
      color={activeDay === day ? "primary" : "default"}
      variant={activeDay === day ? "solid" : "light"}
      onClick={handleClick(day)}
      className="text-white"
    >
      {day}
    </Button>
  ));
}

export function Agenda({
  stringifiedSessionsByDay,
  stringifiedRooms,
  stringifiedDays,
  stringifiedTimelineRangeByDay,
  defaultDay,
}: Props) {
  const [activeDay, setActiveDay] = useState<string>(defaultDay ?? "");
  const rooms = useRef(JSON.parse(stringifiedRooms) as Array<Room>);
  const days = useRef(JSON.parse(stringifiedDays) as Array<string>);
  const timelineRangeByDay = useRef(
    JSON.parse(stringifiedTimelineRangeByDay) as Record<
      string,
      Record<"start" | "end", string>
    >
  );
  const [sessionsData, setSessionsData] = useState<
    Record<string, Array<Session>>
  >(JSON.parse(stringifiedSessionsByDay));
  const [activeSessions, setActiveSessions] = useState(
    new Map<string, Map<string, Session>>(
      days.current.map((day) => [day, new Map()])
    )
  );
  const [isCopying, setIsCopying] = useState(false);

  const noSessionsSelected = useCallback(() => {
    let allActiveSessionsCount = 0;

    for (const [_day, sessions] of activeSessions) {
      allActiveSessionsCount += sessions.size;
    }

    return allActiveSessionsCount === 0;
  }, [activeSessions]);

  const { getEpgProps, getLayoutProps } = useEpg({
    channels: rooms.current,
    epg: sessionsData[activeDay] as Array<Program>,
    dayWidth: 3000,
    sidebarWidth: 83,
    itemHeight: 156,
    isSidebar: true,
    isTimeline: true,
    isLine: false,
    startDate: timelineRangeByDay.current[activeDay]?.start,
    endDate: timelineRangeByDay.current[activeDay]?.end,
    isBaseTimeFormat: true,
    theme: AGENDA_THEME,
  });

  const retrieveTextToCopy = useCallback(() => {
    let nextDisplay = "";
    let isFirstActiveSession = true;
    activeSessions.forEach((sessionsByDay, day) => {
      if (sessionsByDay.size === 0) return;

      if (!isFirstActiveSession) {
        nextDisplay += "\n\n\n\n";
      }

      isFirstActiveSession = false;
      nextDisplay += `<<<<<<< ${day.toUpperCase()} >>>>>>>\n`;
      let sessionIndex = 0;
      sessionsByDay?.forEach((session) => {
        nextDisplay += `\n${session.title}`;
        nextDisplay += `\n${session.room}`;
        nextDisplay += `\n${dayjs
          .utc(session.startsAt)
          .format(EXPORT_TIME_FORMAT)} - ${dayjs
          .utc(session.endsAt)
          .format(EXPORT_TIME_FORMAT)}`;
        nextDisplay +=
          session.speakers.length > 0 ? `\n${session.speakers.join(", ")}` : "";

        if (sessionIndex < sessionsByDay.size - 1) {
          nextDisplay += "\n\n";
        }

        sessionIndex++;
      });
    });

    return nextDisplay;
  }, [activeSessions]);

  const onDayChange = useCallback((day: string) => setActiveDay(day), []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator?.clipboard?.writeText(retrieveTextToCopy());

      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    } catch (e) {
      alert("Copy to clipboard is not supported!");
      console.error(e);
    }
  }, [retrieveTextToCopy]);

  const handleSave = useCallback(async () => {
    const isPrintingSupported = typeof window && "print" in window;

    if (isPrintingSupported) {
      window.print();
    } else {
      alert("Printing is not supported by your browser!");
    }
  }, []);

  return (
    <>
      <div className="print:hidden flex flex-col sm:items-end gap-2 max-w-full">
        <div className="max-w-full flex flex-row gap-2">
          <Button
            type="button"
            color="default"
            variant="light"
            onClick={handleCopy}
            isDisabled={noSessionsSelected()}
            endContent={
              isCopying ? <LuCheckCheckIcon color="#4ade80" /> : <LuCopyIcon />
            }
            className={`mb-2 disabled:cursor-not-allowed ${
              isCopying ? "text-success-400" : "text-white"
            }`}
          >
            {isCopying ? "Copied" : "Copy"}
          </Button>
          <Button
            type="button"
            color="success"
            onClick={handleSave}
            isDisabled={noSessionsSelected()}
            className="mb-2 disabled:cursor-not-allowed"
          >
            Save
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:mx-auto">
          <Days
            days={days.current}
            activeDay={activeDay}
            onClick={onDayChange}
          />
        </div>
        <Epg {...getEpgProps()}>
          <Layout
            {...getLayoutProps()}
            renderTimeline={(props) => <Timeline {...props} />}
            renderProgram={({ program, ...rest }) => (
              <SessionCard
                key={program.data.id}
                program={
                  program as unknown as ProgramItem & {
                    data: Session;
                    position: Omit<Position, "edgeEnd">;
                  }
                }
                onClick={() => {
                  const newSessionsData = { ...sessionsData };
                  const newActiveSessions = new Map(activeSessions);

                  newSessionsData[activeDay] = newSessionsData[activeDay].map(
                    (s: any, i: number) => {
                      if (i === program.data.index) {
                        const newIsActive = !s.isActive;

                        if (newIsActive) {
                          newActiveSessions.get(activeDay)?.set(s.id, s);
                        } else {
                          newActiveSessions.get(activeDay)?.delete(s.id);
                        }

                        return { ...s, isActive: newIsActive };
                      }

                      return s;
                    }
                  );

                  setActiveSessions(newActiveSessions);
                  setSessionsData(newSessionsData);
                }}
                {...rest}
              />
            )}
            renderChannel={({ channel }) => (
              <RoomName key={channel.uuid} channel={channel} />
            )}
          />
        </Epg>
      </div>
      <PDFPreview sessionsByDay={activeSessions} />
    </>
  );
}
