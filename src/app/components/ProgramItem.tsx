import { Link } from "@nextui-org/react";
import {
  ProgramItem,
  ProgramBox,
  ProgramContent,
  ProgramFlex,
  ProgramStack,
  ProgramTitle,
  ProgramText,
  useProgram,
} from "planby";

export const Program = ({
  program,
  onClick,
  ...rest
}: ProgramItem & { onClick: any }) => {
  const { styles, formatTime, set12HoursTimeFormat } = useProgram({
    program,
    ...rest,
  });
  const { data } = program;
  const { title, since, till, room, authors, link, isActive } = data;
  const sinceTime = formatTime(since, set12HoursTimeFormat()).toLowerCase();
  const tillTime = formatTime(till, set12HoursTimeFormat()).toLowerCase();

  return (
    <ProgramBox width={styles.width} style={styles.position} onClick={onClick}>
      <ProgramContent
        width={styles.width}
        isLive={isActive}
        className={`border-2 border-dashed ${
          isActive ? "border-green-300" : "border-transparent"
        }`}
      >
        <ProgramFlex>
          <ProgramStack>
            <ProgramTitle>{title}</ProgramTitle>
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
