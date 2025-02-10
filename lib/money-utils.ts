export function formatMoney(amt: number | undefined | null) {
	amt = amt ?? 0;
	let rounded = parseFloat(amt.toFixed(2));
	const formatted = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "INR",
	}).format(rounded);
	return formatted;
}
