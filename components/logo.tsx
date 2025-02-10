import Logo from "@/public/images/logo/wallet_16.svg";
import Image from "next/image";
import Link from "next/link";

export function BudgetbeeLogo() {
	return (
		<Link href="/" className="flex items-center gap-1">
			<Image height={32} width={32} alt="Budgetbee logo" src={Logo.src} />
			<span className="text-sm font-bold">Budgetbee</span>
		</Link>
	);
}
