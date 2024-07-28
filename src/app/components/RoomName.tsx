"use client";

import { Channel, ChannelBox } from "planby";

interface ChannelItemProps {
  channel: Channel;
}

export const RoomName = ({ channel }: ChannelItemProps) => {
  const { position, title } = channel;
  return (
    <ChannelBox
      {...position}
      className="border-r-1 border-default-50 shadow-lg dark:shadow-2xl"
    >
      <p className="w-full text-end font-bold px-2 text-default-600">{title}</p>
    </ChannelBox>
  );
};
