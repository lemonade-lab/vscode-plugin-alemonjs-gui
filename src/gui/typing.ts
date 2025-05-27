import type { User as GUIUser } from '@alemonjs/gui';
export type {
  PrivateMessage,
  Message,
  PublicMessage,
  User as GUIUser,
  DataPrivate,
  DataPublic,
  Data
} from '@alemonjs/gui';
export type Config = {
  // bot
  BotId: string;
  BotName: string;
  BotAvatar: string;
  // guild
  GuildId: string;
  ChannelId: string;
  ChannelName: string;
  ChannelAvatar: string;
} & GUIUser;

export type User = {
  UserId: string;
  UserName: string;
  UserAvatar: string;
  OpenId: string;
  IsBot: boolean;
};

export type Channel = {
  GuildId: string;
  ChannelId: string;
  ChannelAvatar: string;
  ChannelName: string;
};
