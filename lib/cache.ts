export const CACHE_TTL = 60 * 60; // 1 hour
export const CACHE_CONTROL_HEADER = `public, max-age=0, s-maxage=${CACHE_TTL}, stale-while-revalidate=${CACHE_TTL}`;
