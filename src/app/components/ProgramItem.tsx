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

export const Program = ({ program, ...rest }: ProgramItem) => {
  const { styles, formatTime, set12HoursTimeFormat, isLive, isMinWidth } =
    useProgram({
      program,
      ...rest,
    });

  const { data } = program;
  const { title, since, till, room, authors, link } = data;

  const sinceTime = formatTime(since, set12HoursTimeFormat()).toLowerCase();
  const tillTime = formatTime(till, set12HoursTimeFormat()).toLowerCase();

  return (
    <ProgramBox width={styles.width} style={styles.position}>
      <ProgramContent width={styles.width} isLive={isLive}>
        <ProgramFlex>
          <ProgramStack>
            <ProgramTitle>{title}</ProgramTitle>
            <ProgramText className="mb-1">
              {sinceTime} - {tillTime}
            </ProgramText>
            <ProgramText className="mb-1">{room}</ProgramText>
            <ProgramText className="mb-1">{authors.join(", ")}</ProgramText>
            <Link isExternal showAnchorIcon href={link}>
              View details
            </Link>
          </ProgramStack>
        </ProgramFlex>
      </ProgramContent>
    </ProgramBox>
  );
};
