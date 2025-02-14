import LoadingSpinner from "@/components/loading-spinner";
import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import React from "react";

const theme = {
	elements: {
		card: { boxShadow: "none" },
	},
};

export default function PageJoin() {
	return (
		<React.Fragment>
			<ClerkLoading>
				<LoadingSpinner />
			</ClerkLoading>
			<ClerkLoaded>
				<SignIn appearance={theme} />
			</ClerkLoaded>
		</React.Fragment>
	);
}
