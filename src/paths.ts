// Vite supplies '/' locally and the repository path on a GitHub project site.
export function siteUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
