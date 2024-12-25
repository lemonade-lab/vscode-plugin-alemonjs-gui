import * as vscode from 'vscode';
export class ChatSidebarProvider implements vscode.WebviewViewProvider {
  /**
   *
   * @param context
   */
  constructor(private readonly context: vscode.ExtensionContext) {}

  /**
   *
   * @param webviewView
   */
  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri),
        vscode.Uri.joinPath(this.context.extensionUri, 'dist'),
        vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'assets')
      ]
    };

    webviewView.webview.onDidReceiveMessage(
      message => {
        switch (message.type) {
          case 'window.showInformationMessage':
            vscode.window.showInformationMessage(message.payload.text);
            break;
        }
      },
      undefined,
      this.context.subscriptions
    );

    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
  }

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

    const html = require('fs').readFileSync(
      this.context.asAbsolutePath('dist/index.html'),
      'utf-8'
    );

    const scriptReg = /<script.*?src="(.+?)".*?>/g;
    const styleReg = /<link.*?href="(.+?)".*?>/g;
    const styleUri = getHTMLURL('dist', 'assets', 'index.css');
    const scriptUri = getHTMLURL('dist', 'assets', 'index.js');
    // 替换 script
    const newHtml = html.replace(
      scriptReg,
      `<script type="module" crossorigin src="${scriptUri}"></script>`
    );
    // 替换 style
    const finalHtml = newHtml.replace(
      styleReg,
      `<link rel="stylesheet" crossorigin href="${styleUri}">`
    );
    return finalHtml;
  }
}
