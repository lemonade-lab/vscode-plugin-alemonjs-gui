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

  const bodies: Message['MessageBody'] = [];

  const createMentions = (mentionPattern: RegExp) => {
    let lastIndex = 0;
    let match;

    while ((match = mentionPattern.exec(message)) !== null) {
      // 添加普通文本部分
      if (lastIndex < match.index) {
        const textValue = message.substring(lastIndex, match.index).trim();
        if (textValue) {
          bodies.push({ type: 'Text', value: textValue });
        }
      }

      const value = match[1].trim();
      const mentionType = match[0].startsWith('<@') ? 'user' : 'channel';

      bodies.push({
        type: 'Mention',
        value: value,
        options: {
          belong: value === 'everyone' ? 'everyone' : mentionType
        }
      });

      lastIndex = mentionPattern.lastIndex; // 更新索引
    }

    // 添加剩余文本
    if (lastIndex < message.length) {
      const remainingText = message.substring(lastIndex).trim();
      if (remainingText) {
        bodies.push({ type: 'Text', value: remainingText });
      }
    }
  };

  createMentions(/<[@#](.*?)>/g);

  return bodies;
};
