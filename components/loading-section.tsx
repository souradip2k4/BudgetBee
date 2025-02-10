import LoadingSpinner from "@/components/loading-spinner";

export default function LoadingSection() {
	return (
		<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
			<LoadingSpinner />
		</div>
	);
}
