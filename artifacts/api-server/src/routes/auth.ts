import { Router, type IRouter } from "express";
import { db, usersTable, pool } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// Auto ensure schema columns in Neon DB
pool.query(`
  ALTER TABLE users ADD COLUMN IF NOT EXISTS password text;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS saved_place_ids jsonb DEFAULT '[]'::jsonb;
  ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;
`).catch(e => console.log('Schema check:', e.message));

// Sign Up / Register
router.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "Name, Email and Password are required." });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists in Neon DB
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, cleanEmail));
    if (existing) {
      return res.status(400).json({ success: false, error: "An account with this email already exists." });
    }

    const [newUser] = await db
      .insert(usersTable)
      .values({
        name: name.trim(),
        email: cleanEmail,
        password,
      })
      .returning();

    return res.json({
      success: true,
      message: "Account created successfully in Neon DB!",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Sign In / Login
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required." });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, cleanEmail));

    if (!user) {
      return res.status(404).json({ success: false, error: "No account found with this email. Please click Sign Up to register." });
    }

    if (user.password !== password) {
      return res.status(400).json({ success: false, error: "Incorrect password. Please check your password and try again." });
    }

    return res.json({
      success: true,
      message: "Signed in successfully!",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Reset Password / Update Password
router.post("/auth/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, error: "Email and new password are required." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, cleanEmail));
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }
    await db.update(usersTable).set({ password: newPassword }).where(eq(usersTable.id, user.id));
    res.json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
