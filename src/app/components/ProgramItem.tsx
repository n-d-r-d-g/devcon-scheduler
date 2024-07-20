"use client";

import { Button, Link, Tooltip } from "@nextui-org/react";
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

export const Program = ({
  program,
  onClick,
  ...rest
}: ProgramItem & { onClick: any }) => {
  const [isTitleTooltipOpen, setIsTitleTooltipOpen] = useState(false);
  const { styles, formatTime, set12HoursTimeFormat } = useProgram({
    program,
    ...rest,
  });
  const { data } = program;
  const { title, since, till, room, authors, link, isActive } = data;
  const sinceTime = formatTime(since, set12HoursTimeFormat()).toLowerCase();
  const tillTime = formatTime(till, set12HoursTimeFormat()).toLowerCase();

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
              {sinceTime} - {tillTime}
            </ProgramText>
            <ProgramText className="mb-1 text-gray-300">{room}</ProgramText>
            {authors.length > 0 && (
              <ProgramText className="mb-1 text-gray-300">
                {authors.join(", ")}
              </ProgramText>
            )}
            <Link
              isExternal
              showAnchorIcon
              href={link}
              className="text-blue-300"
            >
              Details
            </Link>
          </ProgramStack>
        </ProgramFlex>
      </ProgramContent>
    </ProgramBox>
  );
};
