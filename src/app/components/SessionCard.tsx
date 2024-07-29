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
  const startTime = dayjs.utc(startsAt).format(EXPORT_TIME_FORMAT);
  const endTime = dayjs.utc(endsAt).format(EXPORT_TIME_FORMAT);

  return (
    <ProgramBox width={styles.width} style={styles.position}>
      <Tooltip content={isActive ? "Remove session" : "Add session"}>
        <Button
          onPress={onClick}
          className="w-full h-full p-0"
          variant="light"
          radius="sm"
          as="div"
          aria-label={isActive ? "Remove session" : "Add session"}
          disableAnimation
        >
          <ProgramContent
            width={styles.width}
            isLive={isActive}
            className={`w-full border-2 border-dashed !p-0 ${
              isActive
                ? "border-green-700 dark:border-green-300"
                : "border-transparent"
            }`}
          >
            <ProgramFlex>
              <ProgramStack className="px-5 py-2.5">
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
                      className="text-default-foreground data-[focus-visible=true]:-outline-offset-[2px]"
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
                  <Button
                    as={Link}
                    variant="light"
                    size="sm"
                    href={`${MSCC_WEBSITE_AGENDA_URL}${id}`}
                    className="px-0 text-[0.9375rem] text-blue-800 dark:text-blue-300 font-semibold"
                    isExternal
                    showAnchorIcon
                  >
                    Details
                  </Button>
                )}
              </ProgramStack>
            </ProgramFlex>
          </ProgramContent>
        </Button>
      </Tooltip>
    </ProgramBox>
  );
};
