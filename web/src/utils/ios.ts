export function isIOS(): boolean {
  const userAgent = window.navigator.userAgent;
  return Boolean(userAgent.match(/iPad/i)) || Boolean(userAgent.match(/iPhone/i));
}
