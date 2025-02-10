SELECT
    date,
    SUM(amount) as expense
FROM "Entry"

-- @param {String} $1:user_id
-- @param {DateTime} $2:from
-- @param {DateTime} $3:to
WHERE amount < 0 AND user_id = $1 AND date >= $2 AND date <= $3
GROUP BY date
ORDER BY expense ASC

-- @param {Int} $4:count
LIMIT $4;
