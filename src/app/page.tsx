import { SESSION_WRAPPER_SELECTOR } from "@/constants";
import * as cheerio from "cheerio";
import { Agenda } from "./components/Agenda";

export default async function Home() {
  const formatSession = (session: any) => {
    const title = session.children.find((child: any) => child.name === "h3")
      ?.children?.[0]?.data;
    const schedule = session.children
      .find((child: any) => child.attribs?.class?.includes("tile_start"))
      ?.children?.[0]?.data?.trim()
      ?.split(" - ");
    const startTime = schedule[0];
    const endTime = schedule[1];
    const authors = (
      session.children
        .find((child: any) => child.attribs?.class?.includes("speaker"))
        ?.children?.filter((child: any) =>
          child.attribs?.class.includes("speaker--headshot")
        ) ?? []
    ).flatMap((x: any) =>
      x.children.map((child: any) => child?.children?.[0]?.data).filter(Boolean)
    );
    const room = session.attribs["data-room"];
    const link = `https://conference.mscc.mu${session.attribs["href"]}`;

    return {
      title,
      startTime,
      endTime,
      authors,
      room,
      link,
    };
  };
  const rawData = await fetch("https://conference.mscc.mu/agenda");
  const html = await rawData.text();
  const $ = cheerio.load(html);
  const thursdaySessions = $(
    `#agenda-thursday ${SESSION_WRAPPER_SELECTOR}`
  ) as any;
  const fridaySessions = $(`#agenda-friday ${SESSION_WRAPPER_SELECTOR}`) as any;
  const saturdaySessions = $(
    `#agenda-saturday ${SESSION_WRAPPER_SELECTOR}`
  ) as any;
  const sessionsByDay = {
    thursday: [...thursdaySessions].map(formatSession),
    friday: [...fridaySessions].map(formatSession),
    saturday: [...saturdaySessions].map(formatSession),
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Agenda dataStr={JSON.stringify(sessionsByDay)} />
    </main>
  );
}
