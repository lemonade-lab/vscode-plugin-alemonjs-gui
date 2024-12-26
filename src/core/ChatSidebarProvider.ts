import * as vscode from 'vscode';

export class ChatSidebarProvider implements vscode.WebviewViewProvider {
  /**
   *
   * @param context
   */
  constructor(private readonly context: vscode.ExtensionContext) {}

  /**
   *
   * @param webview
   * @returns
   */
  private getHtmlForWebview(webview: vscode.Webview): string {
    const getHTMLURL = (...arg: string[]) => {
      return webview.asWebviewUri(
        vscode.Uri.joinPath(this.context.extensionUri, ...arg)
      );
    };
    const scriptReg = /<script.*?src="(.+?)".*?>/g;
    const styleReg = /<link.*?href="(.+?)".*?>/g;
    const styleUri = getHTMLURL('dist-gui', 'assets', 'index.css');
    const scriptUri = getHTMLURL('dist-gui', 'assets', 'index.js');
    const html = require('fs')
      .readFileSync(this.context.asAbsolutePath('dist-gui/index.html'), 'utf-8')
      .replace(
        '<head>',
        `<head> <script> window.vscode = acquireVsCodeApi(); </script>`
      )
      .replace(
        scriptReg,
        `<script type="module" crossorigin src="${scriptUri}"></script>`
      )
      .replace(
        styleReg,
        `<link rel="stylesheet" crossorigin href="${styleUri}">`
      );
    return html;
  }

  /**
   *
   * @param webviewView
   * @returns
   */
  fsFreadFile(
    webviewView: vscode.WebviewView,
    {
      tyep,
      jsonDir,
      payload
    }: {
      tyep: string;
      jsonDir: string;
      payload: any;
    }
  ) {
    const dir = this.context.asAbsolutePath(jsonDir);
    if (!require('fs').existsSync(dir)) {
      webviewView.webview.postMessage({
        type: tyep,
        payload: payload
      });
      require('fs').writeFileSync(dir, JSON.stringify(payload));
      return;
    }
    const data = require('fs').readFileSync(dir, 'utf-8');
    webviewView.webview.postMessage({
      type: tyep,
      payload: JSON.parse(data)
    });
  }

  /**
   *
   * @param webviewView
   * @param message
   */
  fsWriteFile(
    message: any,
    {
      jsonDir
    }: {
      jsonDir: string;
    }
  ) {
    const dir = this.context.asAbsolutePath(jsonDir);
    require('fs').writeFileSync(dir, JSON.stringify(message.payload));
    vscode.window.showInformationMessage('保存成功');
  }

  /**
   *
   * @param webviewView
   */
  resolveWebviewView(webviewView: vscode.WebviewView) {
    //
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri),
        vscode.Uri.joinPath(this.context.extensionUri, 'dist-gui'),
        vscode.Uri.joinPath(this.context.extensionUri, 'dist-gui', 'assets')
      ]
    };
    webviewView.webview.onDidReceiveMessage(
      message => {
        switch (message.type) {
          case 'window.showInformationMessage': {
            vscode.window.showInformationMessage(message.payload.text);
            break;
          }
          case 'fs.readFile.config': {
            this.fsFreadFile(webviewView, {
              tyep: 'fs.readFile.config',
              jsonDir: 'dist/config.json',
              payload: {
                host: 'localhost',
                port: '9601'
              }
            });
            break;
          }
          case 'fs.writeFile.config': {
            this.fsWriteFile(message, {
              jsonDir: 'dist/config.json'
            });
            break;
          }
          case 'fs.readFile.message': {
            this.fsFreadFile(webviewView, {
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
            this.fsWriteFile(message, {
              jsonDir: 'dist/message.json'
            });
            break;
          }
          case 'fs.readFile.users': {
            this.fsFreadFile(webviewView, {
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
            this.fsWriteFile(message, {
              jsonDir: 'dist/users.json'
            });
            break;
          }
          case 'fs.writeFile.users.add': {
            const jsonDir = 'dist/users.json';
            const dir = this.context.asAbsolutePath(jsonDir);
            const data = require('fs').readFileSync(dir, 'utf-8');
            const db = JSON.parse(data);
            db.push(message.payload);
            require('fs').writeFileSync(dir, JSON.stringify(db));
            vscode.window.showInformationMessage('保存成功');
            break;
          }
          case 'fs.writeFile.users.del': {
            const jsonDir = 'dist/users.json';
            const dir = this.context.asAbsolutePath(jsonDir);
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
            const dir = this.context.asAbsolutePath(jsonDir);
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
      this.context.subscriptions
    );

    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
  }
}
