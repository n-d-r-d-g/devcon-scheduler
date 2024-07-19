import { Button } from "@nextui-org/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
} from "@nextui-org/react";

type Props = {
  dataStr: string;
};

export function Agenda({ dataStr }: Props) {
  const data = JSON.parse(dataStr);

  const renderSession = (session: any, day: string) => (
    <Card
      key={`${session.title}:${day}:${session.startTime}:${session.endTime}`}
      className="max-w-[400px]"
    >
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">{session.title}</p>
          <p className="text-small text-default-500">
            {session.startTime} - {session.endTime}
          </p>
          <p className="text-small text-default-500">
            {session.authors.join(", ")}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{session.room}</p>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link isExternal showAnchorIcon href={session.link}>
          View details
        </Link>
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-3xl font-extrabold">Thursday:</h2>
      {data.thursday.map((session: any) => renderSession(session, "thursday"))}
      <h2 className="text-3xl font-extrabold">Friday:</h2>
      {data.friday.map((session: any) => renderSession(session, "friday"))}
      <h2 className="text-3xl font-extrabold">Saturday:</h2>
      {data.saturday.map((session: any) => renderSession(session, "saturday"))}
    </div>
  );
}
