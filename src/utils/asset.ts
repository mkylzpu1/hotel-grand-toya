export function asset(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  // すでにbaseが含まれていれば何もしない
  if (path.startsWith(base + '/') || path === base) {
    return path;
  }
  const cleanPath = path.replace(/^\//, '');
  return `${base}/${cleanPath}`;
}
