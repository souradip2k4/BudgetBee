import { useState, useEffect } from "react";

export function useLocalStorag<T>(key: string, defaultValue: T) {
	const [storedValue, setStoredValue] = useState<string>(() => {
		const item = localStorage.getItem(key);
		return (
			typeof item != "undefined" ? item : (
				JSON.stringify(defaultValue)
			)) as string;
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(storedValue));
	}, [key, storedValue]);

	return [storedValue, setStoredValue];
}
