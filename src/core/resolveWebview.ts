import * as vscode from 'vscode';
import { getWebviewContent } from './webview';
export const resolveWebviewView = (
  webview: vscode.Webview,
  context: vscode.ExtensionContext
) => {
  /**
   * @param webviewView
   * @returns
   */
  const fsFreadFile = (
    webview: vscode.Webview,
    {
      tyep,
      jsonDir,
      payload
    }: {
      tyep: string;
      jsonDir: string;
      payload: any;
    }
  ) => {
    const dir = context.asAbsolutePath(jsonDir);
    if (!require('fs').existsSync(dir)) {
      webview.postMessage({
        type: tyep,
        payload: payload
      });
      require('fs').writeFileSync(dir, JSON.stringify(payload));
      return;
    }
    const data = require('fs').readFileSync(dir, 'utf-8');
    webview.postMessage({
      type: tyep,
      payload: JSON.parse(data)
    });
  };

  /**
   *
   * @param webviewView
   * @param message
   */
  const fsWriteFile = (
    message: any,
    {
      jsonDir
    }: {
      jsonDir: string;
    }
  ) => {
    const dir = context.asAbsolutePath(jsonDir);
    require('fs').writeFileSync(dir, JSON.stringify(message.payload));
    vscode.window.showInformationMessage('保存成功');
  };

  /**
   *
   */
  webview.options = {
    enableScripts: true,
    localResourceRoots: [
      vscode.Uri.joinPath(context.extensionUri),
      vscode.Uri.joinPath(context.extensionUri, 'dist-gui'),
      vscode.Uri.joinPath(context.extensionUri, 'dist-gui', 'assets')
    ]
  };

  /**
   *
   */
  webview.onDidReceiveMessage(
    message => {
      switch (message.type) {
        case 'window.showInformationMessage': {
          vscode.window.showInformationMessage(message.payload.text);
          break;
        }
        case 'fs.readFile.config': {
          fsFreadFile(webview, {
            tyep: 'fs.readFile.config',
            jsonDir: 'dist/config.json',
            payload: {
              host: 'localhost',
              port: '17127'
            }
          });
          break;
        }
        case 'fs.writeFile.config': {
          fsWriteFile(message, {
            jsonDir: 'dist/config.json'
          });
          break;
        }
        case 'fs.readFile.message': {
          fsFreadFile(webview, {
            tyep: 'fs.readFile.message',
            jsonDir: 'dist/message.json',
            payload: {
              BotId: '794161769',
              BotName: '阿柠檬',
              BotAvatar: 'https://q1.qlogo.cn/g?b=qq&s=0&nk=794161769',
              UserId: '1715713638',
              UserName: '柠檬冲水',
              OpenId: '120120120',
              UserAvatar: 'https://q1.qlogo.cn/g?b=qq&s=0&nk=1715713638',
              GuildId: '123123',
              ChannelId: '123456',
              ChannelName: '机器人交流群',
              ChannelAvatar: 'https://alemonjs.com/img/alemon.png'
            }
          });
          break;
        }
        case 'fs.writeFile.message': {
          fsWriteFile(message, {
            jsonDir: 'dist/message.json'
          });
          break;
        }
        case 'fs.readFile.users': {
          fsFreadFile(webview, {
            tyep: 'fs.readFile.users',
            jsonDir: 'dist/users.json',
            payload: [
              {
                UserId: '916415899',
                UserName: '小柠檬',
                OpenId: '120120122',
                UserAvatar: 'https://q1.qlogo.cn/g?b=qq&s=0&nk=916415899'
              }
            ]
          });
          break;
        }
        case 'fs.writeFile.users': {
          fsWriteFile(message, {
            jsonDir: 'dist/users.json'
          });
          break;
        }
        case 'fs.writeFile.users.add': {
          const jsonDir = 'dist/users.json';
          const dir = context.asAbsolutePath(jsonDir);
          const data = require('fs').readFileSync(dir, 'utf-8');
          const db = JSON.parse(data);
          db.push(message.payload);
          require('fs').writeFileSync(dir, JSON.stringify(db));
          vscode.window.showInformationMessage('保存成功');
          break;
        }
        case 'fs.writeFile.users.del': {
          const jsonDir = 'dist/users.json';
          const dir = context.asAbsolutePath(jsonDir);
          const data = require('fs').readFileSync(dir, 'utf-8');
          const db = JSON.parse(data);
          const id = message.payload.id;
          const index = db.findIndex((item: any) => item.id === id);
          db.splice(index, 1);
          require('fs').writeFileSync(dir, JSON.stringify(db));
          vscode.window.showInformationMessage('保存成功');
          break;
        }
        case 'fs.writeFile.users.put': {
          const jsonDir = 'dist/users.json';
          const dir = context.asAbsolutePath(jsonDir);
          const data = require('fs').readFileSync(dir, 'utf-8');
          const db = JSON.parse(data);
          const id = message.payload.id;
          const index = db.findIndex((item: any) => item.id === id);
          db[index] = message.payload;
          require('fs').writeFileSync(dir, JSON.stringify(db));
          vscode.window.showInformationMessage('保存成功');
          break;
        }
      }
    },
    undefined,
    context.subscriptions
  );

  webview.html = getWebviewContent(webview, context);
};
