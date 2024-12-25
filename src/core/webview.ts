import * as vscode from 'vscode';
export function getWebviewContent(
  webview: vscode.Webview,
  context: vscode.ExtensionContext
) {
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, 'dist', 'assets', 'index.js')
  );
  const styleUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, 'dist', 'assets', 'index.css')
  );
  return `<!doctype html>
<html lang="en" id="__gui">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>
    AlemonJS
  </title>
  <link rel="stylesheet" href="${styleUri}">
</head>
<body>
  <div id="root"></div>
  <script type="module"  src="${scriptUri}"></script>
</body>
</html>
    `;
}
