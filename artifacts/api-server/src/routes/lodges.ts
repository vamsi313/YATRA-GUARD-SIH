import { Router, type IRouter } from "express";
import { db, lodgesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// GET all lodges or filter by destination
router.get("/lodges", async (req, res) => {
  try {
    const { destinationId } = req.query;
    if (destinationId && typeof destinationId === "string") {
      const lodges = await db.select().from(lodgesTable).where(eq(lodgesTable.destinationId, destinationId));
      return res.json({ success: true, data: lodges });
    }
    const lodges = await db.select().from(lodgesTable);
    res.json({ success: true, data: lodges });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
