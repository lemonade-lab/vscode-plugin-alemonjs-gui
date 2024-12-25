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
    // 修改为。 读取文件 dist/index.html
    // 正则匹配出 script 标签，将 src 替换为 scriptUri
    // 正则匹配出 link 标签，将 href 替换为 styleUri
    // 返回替换后的 html
    // 读取文件内容
    const html = require('fs').readFileSync(
      this.context.asAbsolutePath('dist/index.html'),
      'utf-8'
    );
    /**
     *   <script type="module" crossorigin src="/assets/index.js"></script>
     *   <link rel="stylesheet" crossorigin href="/assets/index.css">
     */
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
