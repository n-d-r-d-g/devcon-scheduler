"use client";

import { Button } from "@nextui-org/react";
import { Epg, Layout, useEpg } from "planby";
import { useCallback, useState } from "react";
import {
  LuCheckCheck as LuCheckCheckIcon,
  LuCopy as LuCopyIcon,
} from "react-icons/lu";
import { ChannelItem } from "./ChannelItem";
import { PDFPreview } from "./PDFPreview";
import { Program } from "./ProgramItem";
import { Timeline } from "./Timeline";

type Props = {
  dataStr: string;
};

const agendaTheme = {
  primary: {
    600: "#1a202c",
    900: "#171923",
  },
  grey: { 300: "#d1d1d1" },
  white: "#fff",
  green: {
    300: "#2c7a7b",
  },
  scrollbar: {
    border: "#ffffff",
    thumb: {
      bg: "#e1e1e1",
    },
  },
  loader: {
    teal: "#5DDADB",
    purple: "#3437A2",
    pink: "#F78EB6",
    bg: "#171923db",
  },
  gradient: {
    blue: {
      300: "#063",
      600: "#004d26",
      900: "#032112",
    },
  },
  text: {
    grey: {
      300: "#a0aec0",
      500: "#a7b0be;",
    },
  },

  timeline: {
    divider: {
      bg: "#718096",
    },
  },
};

const rooms = [
  {
    uuid: "Donkey Kong",
    type: "channel",
    title: "Donkey Kong",
    logo: "",
  },
  {
    uuid: "Tetris",
    type: "channel",
    title: "Tetris",
    logo: "",
  },
  {
    uuid: "Street Fighter",
    type: "channel",
    title: "Street Fighter",
    logo: "",
  },
  {
    uuid: "Pac Man",
    type: "channel",
    title: "Pac Man",
    logo: "",
  },
  {
    uuid: "Space Invaders",
    type: "channel",
    title: "Space Invaders",
    logo: "",
  },
];

export function Agenda({ dataStr }: Props) {
  const data = JSON.parse(dataStr);
  const [activeDay, setActiveDay] = useState<
    "thursday" | "friday" | "saturday"
  >("thursday");
  const [sessionsData, setSessionsData] = useState({
    thursday: data.thursday.map((session: any, index: number) => ({
      id: `${session.title}:thursday:${session.since}:${session.till}`,
      title: session.title,
      startTime: session.since,
      endTime: session.till,
      since: `2024-07-18T${session.since}:00`,
      till: `2024-07-18T${session.till}:00`,
      channelUuid: session.room,
      authors: session.authors,
      room: session.room,
      link: session.link,
      isActive: session.isActive,
      index,
    })),
    friday: data.friday.map((session: any, index: number) => ({
      id: `${session.title}:friday:${session.since}:${session.till}`,
      title: session.title,
      startTime: session.since,
      endTime: session.till,
      since: `2024-07-19T${session.since}:00`,
      till: `2024-07-19T${session.till}:00`,
      channelUuid: session.room,
      authors: session.authors,
      room: session.room,
      link: session.link,
      isActive: session.isActive,
      index,
    })),
    saturday: data.saturday.map((session: any, index: number) => ({
      id: `${session.title}:saturday:${session.since}:${session.till}`,
      title: session.title,
      startTime: session.since,
      endTime: session.till,
      since: `2024-07-20T${session.since}:00`,
      till: `2024-07-20T${session.till}:00`,
      channelUuid: session.room,
      authors: session.authors,
      room: session.room,
      link: session.link,
      isActive: session.isActive,
      index,
    })),
  });
  const [activeSessions, setActiveSessions] = useState(
    new Map<"thursday" | "friday" | "saturday", Map<string, any>>([
      ["thursday", new Map()],
      ["friday", new Map()],
      ["saturday", new Map()],
    ])
  );
  const [isCopying, setIsCopying] = useState(false);
  const { getEpgProps, getLayoutProps } = useEpg({
    channels: rooms,
    epg: sessionsData[activeDay],
    dayWidth: 3000,
    sidebarWidth: 80,
    itemHeight: 156,
    isSidebar: true,
    isTimeline: true,
    isLine: true,
    startDate: `2024-07-${
      activeDay === "thursday" ? 18 : activeDay === "friday" ? 19 : 20
    }T09:00:00`,
    endDate: `2024-07-${
      activeDay === "thursday" ? 18 : activeDay === "friday" ? 19 : 20
    }T18:00:00`,
    isBaseTimeFormat: true,
    theme: agendaTheme,
  });
  const noSessionsSelected =
    activeSessions.get("thursday")?.size === 0 &&
    activeSessions.get("friday")?.size === 0 &&
    activeSessions.get("saturday")?.size === 0;

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
        nextDisplay += "\n";
        nextDisplay += `${session.title}\n`;
        nextDisplay += `${session.channelUuid}\n`;
        nextDisplay += `${session.startTime} - ${session.endTime}\n`;
        nextDisplay += `${session.authors.join(", ")}`;

        if (sessionIndex < sessionsByDay.size - 1) {
          nextDisplay += "\n\n";
        }

        sessionIndex++;
      });
    });

    return nextDisplay;
  }, [activeSessions]);

  return (
    <>
      <div className="print:hidden flex flex-col sm:items-end gap-2 max-w-full">
        <div className="max-w-full flex flex-row gap-2">
          <Button
            type="button"
            color="default"
            variant="light"
            onClick={async () => {
              try {
                await navigator?.clipboard?.writeText(retrieveTextToCopy());

                setIsCopying(true);
                setTimeout(() => setIsCopying(false), 2000);
              } catch (e) {
                alert("Copy to clipboard is not supported!");
                console.error(e);
              }
            }}
            isDisabled={noSessionsSelected}
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
            onClick={async () => {
              const isPrintingSupported = typeof window && "print" in window;

              if (isPrintingSupported) {
                window.print();
              } else {
                alert("Printing is not supported by your browser!");
              }
            }}
            isDisabled={noSessionsSelected}
            className="mb-2 disabled:cursor-not-allowed"
          >
            Save
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:mx-auto">
          <Button
            type="button"
            color={activeDay === "thursday" ? "primary" : "default"}
            variant={activeDay === "thursday" ? "solid" : "light"}
            onClick={() => setActiveDay("thursday")}
            className="text-white"
          >
            Thursday
          </Button>
          <Button
            type="button"
            color={activeDay === "friday" ? "primary" : "default"}
            variant={activeDay === "friday" ? "solid" : "light"}
            onClick={() => setActiveDay("friday")}
            className="text-white"
          >
            Friday
          </Button>
          <Button
            type="button"
            color={activeDay === "saturday" ? "primary" : "default"}
            variant={activeDay === "saturday" ? "solid" : "light"}
            onClick={() => setActiveDay("saturday")}
            className="text-white"
          >
            Saturday
          </Button>
        </div>
        <Epg {...getEpgProps()}>
          <Layout
            {...getLayoutProps()}
            renderTimeline={(props) => <Timeline {...props} />}
            renderProgram={({ program, ...rest }) => (
              <Program
                key={program.data.id}
                program={program}
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
              <ChannelItem key={channel.uuid} channel={channel} />
            )}
          />
        </Epg>
      </div>
      <PDFPreview sessionsByDay={activeSessions} />
    </>
  );
}
