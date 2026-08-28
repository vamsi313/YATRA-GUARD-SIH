import { Router, type IRouter } from "express";
import { db, destinationsTable, placesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// GET all destinations
router.get("/destinations", async (_req, res) => {
  try {
    const destinations = await db.select().from(destinationsTable);
    res.json({ success: true, data: destinations });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET all places or places by destination
router.get("/places", async (req, res) => {
  try {
    const { destinationId } = req.query;
    if (destinationId && typeof destinationId === "string") {
      const places = await db.select().from(placesTable).where(eq(placesTable.destinationId, destinationId));
      return res.json({ success: true, data: places });
    }
    const places = await db.select().from(placesTable);
    res.json({ success: true, data: places });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET place by ID
router.get("/places/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [place] = await db.select().from(placesTable).where(eq(placesTable.id, id));
    if (!place) {
      return res.status(404).json({ success: false, error: "Place not found" });
    }
    res.json({ success: true, data: place });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
