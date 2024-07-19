import { Button } from "@nextui-org/react";

type Props = {
  dataStr: string;
};

export function Agenda({ dataStr }: Props) {
  const data = JSON.parse(dataStr);

  const renderSession = (session: any, day: string) => (
    <a
      key={`${session.title}:${day}:${session.startTime}:${session.endTime}`}
      href={session.link}
      target="_blank"
      rel="noreferrer"
      className=""
    >
      <dl>
        <dt>Title:</dt>
        <dd>{session.title}</dd>
        <dt>Time:</dt>
        <dd>
          {session.startTime} - {session.endTime}
        </dd>
        <dt>Room:</dt>
        <dd>{session.room}</dd>
        <dt>Authors:</dt>
        <dd>{session.authors.join(", ")}</dd>
      </dl>
      <Button color="secondary">View</Button>
    </a>
  );

  return (
    <div className="">
      <h2 className="text-3xl font-extrabold">Thursday:</h2>
      {data.thursday.map((session: any) => renderSession(session, "thursday"))}
      <h2 className="text-3xl font-extrabold">Friday:</h2>
      {data.friday.map((session: any) => renderSession(session, "friday"))}
      <h2 className="text-3xl font-extrabold">Saturday:</h2>
      {data.saturday.map((session: any) => renderSession(session, "saturday"))}
    </div>
  );
}
