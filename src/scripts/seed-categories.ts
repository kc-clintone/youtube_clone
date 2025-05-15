import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
    "Cars and vehicles",
    "Education",
    "Comedy",
    "Entertainment",
    "Gaming",
    "Computers",
    "Film and animation",
    "How-to videos",
    "Lifestyle",
    "Style",
    "Music",
    "News and politics",
    "Sport",
    "Blogs",
    "Science and technology",
    "Animals and pets",
    "Travel",
    "Events",
];

async function main() {
    console.log("Seeding categories...");

    try {
        const values = categoryNames.map((name) => ({
            name,
            description: `Videos related to ${name.toLowerCase()}`,
        }));

        await db.insert(categories).values(values);

        console.log("All categories seeded successfully!");
    } catch (error) {
        console.log("Error seeding categories: ", error);
        process.exit(1);
    }
}

main();
