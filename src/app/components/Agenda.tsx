"use client";

import { Button } from "@nextui-org/react";
import { Epg, Layout, useEpg } from "planby";
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
      300: "#002eb3",
      600: "#002360",
      900: "#051937",
    },
  },

  text: {
    grey: {
      300: "#a0aec0",
      500: "#718096",
    },
  },

  timeline: {
    divider: {
      bg: "#718096",
    },
  },
};

export function Agenda({ dataStr }: Props) {
  const data = JSON.parse(dataStr);

  const rooms = [
    {
      uuid: "donkey-kong",
      type: "channel",
      title: "Donkey Kong",
      logo: "",
    },
    {
      uuid: "tetris",
      type: "channel",
      title: "Tetris",
      logo: "",
    },
    {
      uuid: "street-fighter",
      type: "channel",
      title: "Street Fighter",
      logo: "",
    },
    {
      uuid: "pac-man",
      type: "channel",
      title: "Pac Man",
      logo: "",
    },
    {
      uuid: "space-invaders",
      type: "channel",
      title: "Space Invaders",
      logo: "",
    },
  ];
  const sessionsData = [
    {
      id: "6f3caa7f-5b11-4edb-998e-80d4baa03373",
      description:
        "Bounty hunter Boba Fett & mercenary Fennec Shand navigate the underworld when they return to Tatooine to claim Jabba the Hutt's old turf.",
      title: "The Book of Boba Fett",
      since: "2024-07-19T08:00:00",
      till: "2024-07-19T08:45:00",
      channelUuid: "donkey-kong",
      image: "",
      authors: ["Bob Marley", "Alice Wonderland"],
      room: "Donkey Kong",
      link: "https://google.com/",
    },
    {
      id: "f8fa7e21-6a8a-4ccc-8859-6f61a31f2f55",
      description:
        "The series will follow Carrie, Miranda and Charlotte as they navigate the journey from the complicated reality of life and friendship in their 30s to the even more complicated reality of life and friendship in their 50s.",
      title: "And Just Like That...",
      since: "2024-07-19T09:00:00",
      till: "2024-07-19T09:45:00",
      channelUuid: "donkey-kong",
      image: "",
      authors: ["Bob Marley", "Alice Wonderland"],
      room: "Donkey Kong",
      link: "https://google.com/",
    },
    {
      id: "a3945c66-4192-44a2-ac30-65e9ddfd9afe",
      description:
        "Conan O'Brien, a Harvard Lampoon alumnus, hosts this late-night comedy/talk-show, which is often silly and whimsical.",
      title: "Late Night with Conan O'Brien",
      since: "2024-07-19T10:00:00",
      till: "2024-07-19T10:45:00",
      channelUuid: "donkey-kong",
      image: "",
      authors: ["Bob Marley", "Alice Wonderlandsssssss"],
      room: "Donkey Kong",
      link: "https://google.com/",
    },
  ];
  const { getEpgProps, getLayoutProps } = useEpg({
    channels: rooms,
    epg: sessionsData,
    dayWidth: 3000,
    sidebarWidth: 80,
    itemHeight: 144,
    isSidebar: true,
    isTimeline: true,
    isLine: true,
    startDate: "2024-07-19T08:00:00",
    endDate: "2024-07-19T18:00:00",
    isBaseTimeFormat: true,
    theme: agendaTheme,
  });
  return (
    <div className="flex flex-col gap-2 max-w-full">
      <div className="flex flex-col sm:flex-row gap-2 sm:mx-auto">
        <Button color="primary">Thursday</Button>
        <Button color="default">Friday</Button>
        <Button color="default">Saturday</Button>
      </div>
      <Epg {...getEpgProps()}>
        <Layout
          {...getLayoutProps()}
          renderTimeline={(props) => <Timeline {...props} />}
          renderProgram={({ program, ...rest }) => (
            <Program key={program.data.id} program={program} {...rest} />
          )}
          renderChannel={({ channel }) => (
            <ChannelItem key={channel.uuid} channel={channel} />
          )}
        />
      </Epg>
    </div>
  );
}
