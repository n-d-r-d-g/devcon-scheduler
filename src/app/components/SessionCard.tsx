"use client";

import { EXPORT_TIME_FORMAT, MSCC_WEBSITE_AGENDA_URL } from "@/constants";
import { Session } from "@/types";
import { Button, Link, Tooltip } from "@nextui-org/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  ProgramBox,
  ProgramContent,
  ProgramFlex,
  ProgramItem,
  ProgramStack,
  ProgramText,
  ProgramTitle,
  useProgram,
} from "planby";
import { useState } from "react";
import { FaEye as FaEyeIcon } from "react-icons/fa";

dayjs.extend(utc);

type SessionCardProps = ProgramItem & {
  onClick: () => void;
  program: { data: Session };
};

export const SessionCard = ({
  program,
  onClick,
  ...rest
}: SessionCardProps) => {
  const [isTitleTooltipOpen, setIsTitleTooltipOpen] = useState(false);
  const { styles } = useProgram({
    program,
    ...rest,
  });
  const { data } = program;
  const {
    id,
    title,
    startsAt,
    endsAt,
    room,
    speakers,
    isActive,
    isClickDisabled,
  } = data;
  debugger;
  const startTime = dayjs.utc(startsAt).format(EXPORT_TIME_FORMAT);
  const endTime = dayjs.utc(endsAt).format(EXPORT_TIME_FORMAT);

  return (
    <ProgramBox width={styles.width} style={styles.position}>
      <ProgramContent
        width={styles.width}
        isLive={isActive}
        tabIndex={0}
        onClick={onClick}
        className={`border-2 border-dashed ${
          isActive ? "border-green-300" : "border-transparent"
        }`}
      >
        <ProgramFlex>
          <ProgramStack>
            <Tooltip
              content={title}
              isOpen={isTitleTooltipOpen}
              color="foreground"
            >
              <div className="flex flex-row items-baseline gap-0.5">
                <ProgramTitle
                  onMouseEnter={() => setIsTitleTooltipOpen(true)}
                  onMouseLeave={() => setIsTitleTooltipOpen(false)}
                >
                  {title}
                </ProgramTitle>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  radius="full"
                  aria-label="View full title"
                  onPress={() => setIsTitleTooltipOpen((prev) => !prev)}
                  onBlur={() => setIsTitleTooltipOpen(false)}
                  onMouseLeave={() => setIsTitleTooltipOpen(false)}
                  className="text-white"
                >
                  <FaEyeIcon />
                </Button>
              </div>
            </Tooltip>
            <ProgramText className="mb-1 text-gray-300">
              {startTime} - {endTime}
            </ProgramText>
            <ProgramText className="mb-1 text-gray-300">{room}</ProgramText>
            {speakers.length > 0 && (
              <ProgramText className="mb-1 text-gray-300">
                {speakers.join(", ")}
              </ProgramText>
            )}
            {!isClickDisabled && (
              <Link
                isExternal
                showAnchorIcon
                href={`${MSCC_WEBSITE_AGENDA_URL}${id}`}
                className="text-blue-300"
              >
                Details
              </Link>
            )}
          </ProgramStack>
        </ProgramFlex>
      </ProgramContent>
    </ProgramBox>
  );
};
