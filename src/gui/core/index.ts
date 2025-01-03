import { Data, Message } from '../typing';

export const DATA = {
  stringify: (data: Data) => JSON.stringify(data),
  parse: (data: string): Data => JSON.parse(data)
};

/**
 * input
 * @param input
 * @returns
 */
export const parseHtmlContent = (input: string): string => {
  return input
    .replace(/\n/g, '<br>')
    .replace(/@([^\s#]+)/g, '<strong>@$1</strong>')
    .replace(/#([^\s@]+)/g, '<strong>#$1</strong>');
};

/**
 *  UserList
 */
export const UserList = [
  { id: 1, UserId: 'everyone', UserName: '全体成员' },
  { id: 2, UserId: '916415899', UserName: '小柠檬' },
  { id: 2, UserId: '794161769', UserName: '阿柠檬' },
  { id: 3, UserId: '1715713638', UserName: '我自己' }
];

/**
 * input 出来的产物
 * @param input
 * @returns
 */
export const parseMessageContent = (input: string): string => {
  return input
    .replace(/@([^\s#]+)/g, (match, username) => {
      const user = UserList.find(u => u.UserName === username);
      return user ? `<@${user.UserId}>` : match;
    })
    .replace(/#([^\s@]+)/g, '<#$1>');
};

export const parseMessage = (msg: string) => {
  const message = parseMessageContent(msg);
  const mentionUserPattern = /<@(.*?)>/g; // 匹配用户提及
  const mentionChannelPattern = /<#(.*?)>/g; // 匹配频道提及
  const bodies: Message['MessageBody'] = [];
  let lastIndex = 0;
  // 提取用户提及
  let match;
  while ((match = mentionUserPattern.exec(message)) !== null) {
    // 添加普通文本部分
    if (lastIndex < match.index) {
      const textValue = message.substring(lastIndex, match.index).trim();
      if (textValue) {
        bodies.push({ type: 'Text', value: textValue });
      }
    }
    // 添加用户提及
    const username = match[1].trim();
    bodies.push({
      type: 'Mention',
      value: username,
      options: { belong: 'user' }
    });
    lastIndex = mentionUserPattern.lastIndex; // 更新索引
  }
  // 添加剩余文本
  if (lastIndex < message.length) {
    const remainingText = message.substring(lastIndex).trim();
    if (remainingText) {
      bodies.push({ type: 'Text', value: remainingText });
    }
  }
  // 处理频道提及（可选，根据你的需求）
  lastIndex = 0; // 重置索引
  while ((match = mentionChannelPattern.exec(message)) !== null) {
    // 添加普通文本部分
    if (lastIndex < match.index) {
      const textValue = message.substring(lastIndex, match.index).trim();
      if (textValue) {
        bodies.push({ type: 'Text', value: textValue });
      }
    }
    bodies.push({
      type: 'Mention',
      value: match[1].trim(),
      options: { belong: 'channel' }
    });
    lastIndex = mentionChannelPattern.lastIndex; // 更新索引
  }
  return bodies;
};
