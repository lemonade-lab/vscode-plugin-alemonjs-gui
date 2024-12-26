/**
 * 要渲染成的 html ?
 * @param input
 * @returns
 */
export const parseHtmlContent = (input: string): string => {
  return input
    .replace(/\n/g, '<br>')
    .replace(/@([^\s#]+)/g, '<strong>@$1</strong>')
    .replace(/#([^\s@]+)/g, '<strong>#$1</strong>');
};

export const UserList = [
  { id: 1, UserId: 'everyone', UserName: '全体成员' },
  { id: 2, UserId: '916415899', UserName: '小柠檬' },
  { id: 2, UserId: '794161769', UserName: '阿柠檬' },
  { id: 3, UserId: '1715713638', UserName: '我自己' }
];

/**
 *
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

/**
 *
 * @param input
 * @returns
 */
export const parseTextContent = (input: string): string => {
  return input
    .replace(/<@([^>\s]+)>/g, (match, UserId) => {
      const user = UserList.find(u => u.UserId === UserId);
      return user ? `@${user.UserName} ` : match;
    })
    .replace(/<#([^\s]+)>/g, '#$1 ');
};
