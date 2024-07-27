export type Session = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  description: string;
  since: string;
  till: string;
  image: "";
  channelUuid: string;
  speakers: Array<string>;
  isActive: boolean;
  room: string;
  index: number;
  isClickDisabled?: boolean;
};

export type Room = {
  uuid: string;
  type: string;
  title: string;
  logo: string;
};
