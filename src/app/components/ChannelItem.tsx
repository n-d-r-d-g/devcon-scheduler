import { Channel, ChannelBox } from "planby";

interface ChannelItemProps {
  channel: Channel;
}

export const ChannelItem = ({ channel }: ChannelItemProps) => {
  const { position, title } = channel;
  return (
    <ChannelBox {...position}>
      <p className="w-full text-end text-white font-bold px-2">{title}</p>
    </ChannelBox>
  );
};
