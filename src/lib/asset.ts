// Resolve a public asset against the deploy base path.
// BASE_URL is "/" in dev/test and "/tradeweave/" in the GitHub Pages build,
// so absolute public assets keep working under a sub-path deploy.
export const asset = (p: string): string => import.meta.env.BASE_URL + p.replace(/^\/+/, "");
