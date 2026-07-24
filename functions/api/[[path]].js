const BACKEND_ORIGIN = 'https://automation-cobol.onrender.com';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const target = new URL(url.pathname + url.search, BACKEND_ORIGIN);
  const proxied = new Request(target, context.request);
  return fetch(proxied);
}
