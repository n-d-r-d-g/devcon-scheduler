"use client";

import { EXPORT_TIME_FORMAT, MSCC_WEBSITE_AGENDA_URL } from "@/constants";
import { Session } from "@/types";
import { Card, CardBody, Link } from "@nextui-org/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useCallback } from "react";

dayjs.extend(utc);

type Props = {
  sessionsByDay: Map<string, Map<string, Session>>;
};

export function PDFPreview({ sessionsByDay }: Props) {
  const retrieveTime = useCallback(
    (dateTime: string) => dayjs.utc(dateTime).format(EXPORT_TIME_FORMAT),
    []
  );

  return (
    <div className="hidden print:block w-full">
      <h1 className="text-3xl font-bold mb-2">
        MSCC Developers Conference 2024 Agenda
      </h1>
      <div className="flex flex-row items-baseline gap-4 mb-12">
        <Link
          isExternal
          showAnchorIcon
          href="https://conference.mscc.mu/agenda"
          className="text-blue-800"
        >
          MSCC agenda
        </Link>
        <Link
          isExternal
          showAnchorIcon
          href="https://devconmu.netlify.app/"
          className="text-blue-800"
        >
          Scheduler agenda
        </Link>
      </div>
      <div className="flex flex-col gap-12">
        {[...sessionsByDay.entries()].map(([day, sessions]) => {
          if (sessions.size === 0) return null;
          return (
            <div key={day} className="flex flex-col gap-4">
              <h2 className="text-xl font-bold uppercase">{day}</h2>
              <div className={`flex flex-col items-start gap-4`}>
                {[...sessions.entries()].map(([id, session]) => (
                  <Card
                    key={id}
                    className="max-w-full border-1 break-inside-avoid"
                    shadow="none"
                  >
                    <CardBody className="flex flex-col gap-1">
                      <p className="text-lg font-semibold">{session.title}</p>
                      <p className="text-small text-default-700">
                        {retrieveTime(session.startsAt)} -{" "}
                        {retrieveTime(session.endsAt)} ~{" "}
                        <span className="capitalize italic">{day}</span>
                      </p>
                      <p className="text-small text-default-700 font-semibold">
                        {session.room}
                      </p>
                      {session.speakers.length > 0 && (
                        <p className="text-small text-default-700">
                          {session.speakers.join(", ")}
                        </p>
                      )}
                      {!session.isClickDisabled && (
                        <Link
                          isExternal
                          showAnchorIcon
                          href={`${MSCC_WEBSITE_AGENDA_URL}${session.id}`}
                          className="text-blue-600"
                        >
                          View details
                        </Link>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
