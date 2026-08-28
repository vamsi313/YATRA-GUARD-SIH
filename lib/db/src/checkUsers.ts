import { db, usersTable } from "./index";

export async function checkUserCount() {
  const users = await db.select().from(usersTable);
  console.log(`\n========================================`);
  console.log(`📊 TOTAL REGISTERED PILGRIMS: ${users.length}`);
  console.log(`========================================`);
  if (users.length > 0) {
    console.log(`\nUser List:`);
    users.forEach((u, i) => {
      console.log(`${i + 1}. Name: ${u.name} | Email: ${u.email} | Registered At: ${u.createdAt}`);
    });
  } else {
    console.log("No users have registered yet.");
  }
  console.log(`========================================\n`);
}
