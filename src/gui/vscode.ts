/**
 * @param message
 * @returns
 */
export const postMessage = (message: any) => {
  if (!window.acquireVsCodeApi) {
    return;
  }
  const vscode = acquireVsCodeApi();
  vscode.postMessage(message);
};
