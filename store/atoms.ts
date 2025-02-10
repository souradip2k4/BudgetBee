import { QueryCategories } from "@/lib/api";
import { atom } from "recoil";

export const entryAtom = atom<string[]>({
	key: "entryAtom",
	default: [],
});

export const categoriesAtom = atom<QueryCategories | undefined>({
	key: "categoriesAtom",
	default: [],
});
