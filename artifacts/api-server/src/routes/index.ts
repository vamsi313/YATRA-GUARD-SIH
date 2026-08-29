import { Router, type IRouter } from "express";
import healthRouter from "./health";
import destinationsRouter from "./destinations";
import lodgesRouter from "./lodges";
import aiRouter from "./ai";
import alertsRouter from "./alerts";
import authRouter from "./auth";
import crowdRouter from "./crowd";
import { runDbSeed } from "../lib/seed";

const router: IRouter = Router();

router.use(healthRouter);
router.use(destinationsRouter);
router.use(lodgesRouter);
router.use(aiRouter);
router.use(alertsRouter);
router.use(authRouter);
router.use(crowdRouter);

// Database auto-seed endpoint (convenient for setup)
router.post("/seed", async (_req, res) => {
  try {
    await runDbSeed();
    res.json({ success: true, message: "Neon database seeded successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
