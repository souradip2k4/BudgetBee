export type QueryEntry = {
	id: string;
	amount: number;
	date: string;
	message: string | null;
	tags: {
		id: string;
		name: string;
		user_id: string;
	}[];
	category: {
		id: string;
		name: string;
		created_at: Date; // TODO: change this
		updated_at: Date; // TODO: change this
		user_id: string;
	} | null;
	user_id: string;
	category_id: string | null;
};

export type QueryEntries = {
	id: string;
	amount: number;
	date: string;
	message: string | null;
	tags: {
		id: string;
		name: string;
		user_id: string;
	}[];
	category: {
		id: string;
		name: string;
		created_at: Date; // TODO: change this
		updated_at: Date; // TODO: change this
		user_id: string;
	} | null;
	user_id: string;
	category_id: string | null;
}[];

export type QueryCategory = {
	id: string;
	_count: {
		entries: number;
		user: number;
	};
	name: string;
	created_at: Date;
	updated_at: Date;
};

export type QueryCategories = {
	id: string;
	user_id: string;
	name: string;
	created_at: Date;
	updated_at: Date;
	entries: {
		_count: {
			user: number;
			tags: number;
			category: number;
		};
	}[];
}[];

export type ApiKeysResoponse = {
	data: {
		id: string;
		key: string;
		user_id: string;
	}[];
};

export type QueryTag = {
	id: string;
	name: string;
	user_id: string;
	_count: {
		user: number;
		entries: number;
	};
};

export type QueryTags = {
	data: {
		id: string;
		name: string;
		user_id: string;
		_count: {
			user: number;
			entries: number;
		};
	}[];
};
