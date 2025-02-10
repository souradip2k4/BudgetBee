import { Decimal } from "@prisma/client/runtime/library";
import { addDays, differenceInDays, format } from "date-fns";

type DatedElement<T, D> = { date: D; total: T; income: T; expense: T };

export function padDates(
	elements: DatedElement<Decimal | null, Date>[],
	from: Date,
	to: Date,
) {
	const diff = differenceInDays(to, from);
	const result = Array.from({ length: diff + 1 }, (_, i) => ({
		date: addDays(from, i),
		total: 0,
		income: 0,
		expense: 0,
	}));

	for (let i = 0; i < elements.length; i++) {
		const gap = differenceInDays(elements[i].date, from);
		if (gap < 0 || gap > diff) continue;
		result[gap].total = elements[i].total?.toNumber() ?? 0;
		result[gap].income = elements[i].income?.toNumber() ?? 0;
		result[gap].expense = elements[i].expense?.toNumber() ?? 0;
	}

	return result.map(x => ({ ...x, date: format(x.date, "yyyy-MM-dd") }));
}
