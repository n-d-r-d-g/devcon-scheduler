"use client";

import {
  TimelineBox,
  TimelineDivider,
  TimelineDividers,
  TimelineTime,
  TimelineWrapper,
  useTimeline,
} from "planby";

interface TimelineProps {
  isBaseTimeFormat: boolean;
  isSidebar: boolean;
  dayWidth: number;
  hourWidth: number;
  numberOfHoursInDay: number;
  offsetStartHoursRange: number;
  sidebarWidth: number;
}

export function Timeline({
  isBaseTimeFormat,
  isSidebar,
  dayWidth,
  hourWidth,
  numberOfHoursInDay,
  offsetStartHoursRange,
  sidebarWidth,
}: TimelineProps) {
  const { time, dividers } = useTimeline(numberOfHoursInDay, isBaseTimeFormat);

  const renderTime = (index: number) => (
    <TimelineBox key={index} width={hourWidth}>
      <TimelineTime>{index + offsetStartHoursRange}:00</TimelineTime>
      <TimelineDividers>{renderDividers()}</TimelineDividers>
    </TimelineBox>
  );

  const renderDividers = () =>
    dividers.map((_, index) => (
      <TimelineDivider key={index} width={hourWidth} />
    ));

  return (
    <TimelineWrapper
      dayWidth={dayWidth}
      sidebarWidth={sidebarWidth}
      isSidebar={isSidebar}
      className="shadow-lg border border-b-1 border-default-50 dark:shadow-2xl"
    >
      {time.map((_, index) => renderTime(index))}
    </TimelineWrapper>
  );
}
