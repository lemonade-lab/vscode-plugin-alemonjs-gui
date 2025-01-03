import type { User } from '@alemonjs/gui';
export type {
  PrivateMessage,
  Message,
  PublicMessage,
  User,
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
} & User;
