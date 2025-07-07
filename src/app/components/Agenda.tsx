"use client";

import {
  AGENDA_DARK_THEME,
  AGENDA_LIGHT_THEME,
  EXPORT_TIME_FORMAT,
} from "@/constants";
import { ConfDay, Room, Session, SessionsByDay } from "@/types";
import { Button, ButtonGroup } from "@heroui/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useTheme } from "next-themes";
import { Epg, Layout, Program, ProgramItem, useEpg } from "planby";
import { Position } from "planby/dist/Epg/helpers/types";
import { useCallback, useRef, useState } from "react";
import {
  LuCheckCheck as LuCheckCheckIcon,
  LuCopy as LuCopyIcon,
  LuDownload,
} from "react-icons/lu";
import { PDFPreview } from "./PDFPreview";
import { RoomName } from "./RoomName";
import { SessionCard } from "./SessionCard";
import { Timeline } from "./Timeline";
import { retrieveSortedSessionsByDay } from "@/functions";

dayjs.extend(utc);

type Props = {
  stringifiedSessionsByDay: string;
  stringifiedRooms: string;
  stringifiedDays: string;
  stringifiedTimelineRangeByDay: string;
  defaultDay?: string;
};

type DaysProps = {
  days: Array<ConfDay>;
  activeDay: string;
  onClick: (day: string) => void;
};

function Days({ days, activeDay, onClick }: DaysProps) {
  const handleClick = useCallback(
    (day: string) => () => onClick(day),
    [onClick]
  );

  const isActiveDay = useCallback(
    (day: string) => activeDay === day,
    [activeDay]
  );

  return (
    <ButtonGroup fullWidth disableAnimation>
      {days.map((day) => (
        <Button
          key={day.name.long}
          type="button"
          color="primary"
          variant={isActiveDay(day.name.long) ? "solid" : "bordered"}
          onPress={handleClick(day.name.long)}
          className={`px-[14px] sm:px-5 min-w-fit flex flex-col items-center gap-0 ${
            isActiveDay(day.name.long)
              ? "text-white bg-blue-700 dark:text-black dark:bg-blue-400"
              : "text-default-600 bg-default-50"
          }`}
        >
          <span className="sm:hidden">{day.name.short}</span>
          <span className="hidden sm:inline-block">{day.name.long}</span>
          <span
            className={`text-xs ${
              !isActiveDay(day.name.long)
                ? "text-gray-700 dark:text-gray-400"
                : ""
            }`}
          >
            {dayjs.utc(day.date).format("DD/MM")}
          </span>
        </Button>
      ))}
    </ButtonGroup>
  );
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
  const days = useRef(JSON.parse(stringifiedDays) as Array<ConfDay>);
  const timelineRangeByDay = useRef(
    JSON.parse(stringifiedTimelineRangeByDay) as Record<
      string,
      Record<"start" | "end", string>
    >
  );
  const [sessionsData, setSessionsData] = useState<SessionsByDay>(
    JSON.parse(stringifiedSessionsByDay)
  );
  const [activeSessions, setActiveSessions] = useState(
    new Map<string, Map<string, Session>>(
      days.current.map((day) => [day.name.long, new Map()])
    )
  );
  const [isCopying, setIsCopying] = useState(false);
  const { resolvedTheme } = useTheme();

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
    sidebarWidth: 102,
    itemHeight: 164,
    isSidebar: true,
    isTimeline: true,
    isLine: false,
    startDate: timelineRangeByDay.current[activeDay]?.start,
    endDate: timelineRangeByDay.current[activeDay]?.end,
    isBaseTimeFormat: true,
    theme: resolvedTheme === "light" ? AGENDA_LIGHT_THEME : AGENDA_DARK_THEME,
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
      retrieveSortedSessionsByDay(sessionsByDay).forEach((session) => {
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
      <div className="print:hidden max-w-full flex flex-row items-center gap-2 sm:mx-auto px-3 pt-2">
        <Days days={days.current} activeDay={activeDay} onClick={onDayChange} />
        <Button
          type="button"
          color="default"
          variant="faded"
          onPress={handleCopy}
          isDisabled={noSessionsSelected()}
          endContent={isCopying ? <LuCheckCheckIcon /> : <LuCopyIcon />}
          title="Copy"
          className={`px-[14px] sm:px-4 min-w-fit border-0 disabled:cursor-not-allowed ${
            isCopying
              ? "text-success-800 dark:text-success-400"
              : "text-default-foreground"
          }`}
        >
          <span className="hidden sm:inline-block">
            {isCopying ? "Copied" : "Copy"}
          </span>
        </Button>
        <Button
          type="button"
          color="success"
          variant={noSessionsSelected() ? "faded" : "solid"}
          onPress={handleSave}
          isDisabled={noSessionsSelected()}
          endContent={<LuDownload />}
          title="Save"
          className={`px-[14px] sm:px-4 min-w-fit border-0 ${
            noSessionsSelected() ? "text-default-foreground" : "bg-green-400"
          } data-[disabled=true]:cursor-not-allowed`}
        >
          <span className="hidden sm:inline-block">Save</span>
        </Button>
      </div>
      <div className="print:hidden sticky top-0 min-h-0 h-full flex flex-col gap-2 max-w-full isolate">
        <div className="w-full max-w-full min-h-0 grow">
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
      </div>
      <PDFPreview sessionsByDay={activeSessions} />
    </>
  );
}
