export type DataText = {
  t: 'Text';
  d: string;
};

export type DataImage = {
  t: 'Image';
  d: {
    url_data?: string;
    url_index?: string;
  };
};

export type Data = {
  // bot
  BotId: string;
  BotName: string;
  BotAvatar: string;
  // user
  UserId: string;
  UserName: string;
  UserAvatar: string;
  OpenId: string;
  // guild
  GuildId: string;
  ChannelId: string;
  ChannelName: string;
  ChannelAvatar: string;
};

export type User = {
  UserId: string;
  UserName: string;
  OpenId: string;
  UserAvatar: string;
};
