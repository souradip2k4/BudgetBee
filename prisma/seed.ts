import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

if (!process.env.DEV_ONLY_PRISMA_SEED_CLERK_USER_ID)
	throw new Error(
		"Seeding failed. Please provide DEV_ONLY_PRISMA_SEED_CLERK_USER_ID env variable",
	);

/**
 * user id of your test clerk user
 * note, that this method does not sync
 * email and other user information, but
 * that is alright
 */
const user_id = process.env._DEV_PRISMA_SEED_CLERK_USER_ID;

const prisma = new PrismaClient();

type User = Awaited<ReturnType<typeof prisma.user.create>>;
type Entry = Awaited<ReturnType<typeof prisma.entry.create>>;
type Category = Awaited<ReturnType<typeof prisma.category.create>>;
type Tag = Awaited<ReturnType<typeof prisma.tag.create>>;

async function cleardb() {
	if (process.env.NODE_ENV === "production") return; // double check is always good :)
	await prisma.entry.deleteMany();
	await prisma.category.deleteMany();
	await prisma.tag.deleteMany();
	await prisma.apiKey.deleteMany();
	await prisma.user.deleteMany();
}

async function genentries(
	count: number = 10,
	user: User,
	categories?: Category[],
	tags?: Tag[],
) {
	let entries = [];
	for (let i = 0; i < count; i++) {
		let randomCategory: Category | undefined =
			categories &&
			faker.helpers.maybe(() => faker.helpers.arrayElement(categories), {
				probability: 0.75,
			});
		let randomTags: Tag[] | undefined =
			tags &&
			faker.helpers.maybe(() => faker.helpers.arrayElements(tags), {
				probability: 0.75,
			});
		let entry = await prisma.entry.create({
			data: {
				user_id: user.id,
				amount: faker.finance.amount({ min: -10_000, max: +10_000 }),
				date: faker.date.recent({ days: 300 }),
				message: faker.lorem.text(),
				category_id: randomCategory?.id,
				tags: {
					connect: randomTags
						?.filter(x => x !== undefined)
						.map(randomTag => ({ id: randomTag.id })),
				},
			},
			include: { tags: true, category: true },
		});
		process.stdout.write(
			`[entry] ${entry.amount.toString()} ${entry.message} `,
		);
		if (entry.category) process.stdout.write(`${entry.category.name} `);
		if (entry.tags)
			process.stdout.write(
				`${entry.tags.map(tag => tag.name).toString()} `,
			);
		process.stdout.write(`-> ${entry.user_id}\n`);
		entries.push(entry);
	}
	return entries;
}

async function gencategories(user: User) {
	const categoryNames = ["Food", "Travel", "Rent", "Study", "Misc"];
	let categories: Category[] = await Promise.all(
		categoryNames.map(async name => {
			let category = await prisma.category.create({
				data: { name, user_id: user.id },
			});
			console.log(`[category] ${category.name} -> ${category.user_id}`);
			return category;
		}),
	);
	return categories;
}

async function gentags(user: User) {
	const tagNames = ["Unnecessay", "Required", "Expensive", "Cheap"];
	let tags: Tag[] = await Promise.all(
		tagNames.map(async name => {
			let tag = await prisma.tag.create({
				data: { name, user_id: user.id },
			});
			console.log(`[tag] ${tag.name} -> ${tag.user_id}`);
			return tag;
		}),
	);
	return tags;
}

async function seed() {
	if (process.env.NODE_ENV === "production") return;

	await cleardb();
	console.log("Cleared db successfully. Hopefully it wasn't prod db :)");

	const user = await prisma.user.create({
		data: {
			id: user_id,
			email: "john.doe@gmail.com",
			username: "john.doe",
			first_name: "John",
			last_name: "Doe",
		},
	});

	const tags = await gentags(user);
	const categories = await gencategories(user);
	await genentries(10_000, user, categories, tags);
}

seed()
	.then(() => console.log("Seeding successfull"))
	.catch(err => {
		console.log(err);
		process.exitCode = 1;
	})
	.finally(() => prisma.$disconnect());
