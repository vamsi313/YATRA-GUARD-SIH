import { Router, type IRouter } from "express";
import { db, emergencyAlertsTable, crowdReportsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

// GET active emergency alerts
router.get("/alerts", async (req, res) => {
  try {
    const { destinationId } = req.query;
    if (destinationId && typeof destinationId === "string") {
      const alerts = await db
        .select()
        .from(emergencyAlertsTable)
        .where(eq(emergencyAlertsTable.destinationId, destinationId))
        .orderBy(desc(emergencyAlertsTable.createdAt));
      return res.json({ success: true, data: alerts });
    }
    const alerts = await db.select().from(emergencyAlertsTable).orderBy(desc(emergencyAlertsTable.createdAt));
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST a new crowd report from a pilgrim
router.post("/crowd-reports", async (req, res) => {
  try {
    const { placeId, reportedLevel, waitingMinutes, comment } = req.body;
    if (!placeId || !reportedLevel) {
      return res.status(400).json({ success: false, error: "placeId and reportedLevel are required" });
    }
    const [report] = await db
      .insert(crowdReportsTable)
      .values({
        placeId,
        reportedLevel,
        waitingMinutes: waitingMinutes ? parseInt(waitingMinutes, 10) : 0,
        comment,
      })
      .returning();

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
