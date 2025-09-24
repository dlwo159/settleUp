export function getHeader(headers: any, name: string) {
  if (!headers) return undefined;
  return headers[name] ?? headers[name.toLowerCase()] ?? headers[name.toUpperCase()];
}

export function extractAccessToken(headers: any) {
  const auth = getHeader(headers, 'authorization');
  if (typeof auth === 'string') {
    const m = auth.match(/^Bearer\s+(.+)$/i);
    if (m) return m[1].trim();
  }
  return getHeader(headers, 'access-token');
}

export function extractRefreshToken(headers: any) {
  return getHeader(headers, 'refresh-token');
}
