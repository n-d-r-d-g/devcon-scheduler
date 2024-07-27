"use client";

import { MSCC_WEBSITE_AGENDA_URL } from "@/constants";
import { Card, CardBody, Link } from "@nextui-org/react";

type Props = {
  sessionsByDay: Map<string, Map<string, any>>;
};

export function PDFPreview({ sessionsByDay }: Props) {
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
                  <Card key={id} className="max-w-full border-1" shadow="none">
                    <CardBody className="flex flex-col gap-1">
                      <p className="text-lg font-semibold">{session.title}</p>
                      <p className="text-small text-default-700">
                        {session.startTime} - {session.endTime} ~{" "}
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
