"use client";

import { Button } from "@nextui-org/react";
import { Epg, Layout, useEpg } from "planby";
import { useRef, useState } from "react";
import { ChannelItem } from "./ChannelItem";
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
      since: `2024-07-20T${session.since}:00`,
      till: `2024-07-20T${session.till}:00`,
      channelUuid: session.room,
      authors: session.authors,
      room: session.room,
      link: session.link,
      isActive: session.isAcisActive,
      index,
    })),
  });
  const [activeSessions, setActiveSessions] = useState(new Map<string, any>());
  const { getEpgProps, getLayoutProps } = useEpg({
    channels: rooms,
    epg: sessionsData[activeDay],
    dayWidth: 3000,
    sidebarWidth: 80,
    itemHeight: 148,
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

  return (
    <div className="flex flex-col items-end gap-2 max-w-full">
      <Button
        type="button"
        color="success"
        onClick={() => console.log("activeSessions :>> ", activeSessions)}
        isDisabled={activeSessions.size === 0}
        className="mb-2"
      >
        Export
      </Button>
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
                        newActiveSessions.set(s.id, s);
                      } else {
                        newActiveSessions.delete(s.id);
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
  );
}
