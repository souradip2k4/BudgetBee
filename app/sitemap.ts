import { url as rootUrl } from "@/lib/utils";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const sitemaps = [
		"/pricing",
		"/contact",
		"/join",
		"/login",
		"/report-a-bug",
		"/legal/privacy-policy",
	].map(slug => ({
		url: rootUrl(slug).toString(),
		lastModified: new Date(),
	}));

	return [
		{
			url: rootUrl("/").toString(),
			priority: 1,
			changeFrequency: "monthly",
			lastModified: new Date(),
		},
		...sitemaps,
	];
}
