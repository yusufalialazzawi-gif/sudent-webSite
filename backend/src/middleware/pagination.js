/**
 * Normalizes pagination query params for every API route.
 * - limit: integer in [1, MAX_LIMIT]; invalid values are dropped so route defaults apply
 *   (previously limit=abc produced NaN -> Prisma 500, and limit=999999 returned whole tables).
 * - page: integer >= 1.
 */
const MAX_LIMIT = 100;

export function normalizePagination(req, res, next) {
  const { limit, page } = req.query;

  if (limit !== undefined) {
    const n = parseInt(limit, 10);
    if (Number.isFinite(n) && n > 0) req.query.limit = String(Math.min(n, MAX_LIMIT));
    else delete req.query.limit;
  }
  if (page !== undefined) {
    const n = parseInt(page, 10);
    if (Number.isFinite(n) && n > 0) req.query.page = String(n);
    else delete req.query.page;
  }
  next();
}
