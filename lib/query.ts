import { QueryKey } from "@tanstack/react-query";
import axios from "axios";

export const entriesQueryFn = async ({ queryKey }: { queryKey: QueryKey }) => {
	if (
		(queryKey.length < 2 && queryKey[1] === undefined) ||
		queryKey[1] === null
	) {
		return [];
	}
	const res = await axios.get(`/api/users/${queryKey[1]}/entries`);
	const data = JSON.parse(res.data);
	return { ...data, date: new Date(data.date) };
};

export const deleteEntryMutationFn = (data?: string) => {
	return axios.delete(`/api/entries/${data}`);
};

export const deleteEntriesMutationFn = (data?: any[]) => {
	const ids = data?.map(value => value.id);
	return axios.delete("/api/entries", { data: { ids } });
};
