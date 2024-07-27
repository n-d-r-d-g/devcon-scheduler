"use client";

import { Channel, ChannelBox } from "planby";

interface ChannelItemProps {
  channel: Channel;
}

export const RoomName = ({ channel }: ChannelItemProps) => {
  const { position, title } = channel;
  return (
    <ChannelBox {...position}>
      <p className="w-full text-end font-bold px-2">{title}</p>
    </ChannelBox>
  );
};
