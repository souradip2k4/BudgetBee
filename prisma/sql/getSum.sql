SELECT 
    SUM(total) as total,
    SUM(income) as income,
    SUM(CASE WHEN expense<0 THEN -expense ELSE 0 END) as expense
FROM
    (SELECT
        date,
        SUM(amount) AS total,
        SUM(CASE WHEN amount>0 THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN amount<0 THEN amount ELSE 0 END) AS expense
    FROM "Entry"

    -- @param {String} $1:user_id
    -- @param {DateTime} $2:from
    -- @param {DateTime} $3:to
    WHERE user_id=$1 AND date > $2 AND date < $3
    GROUP BY date
    ORDER BY date);
