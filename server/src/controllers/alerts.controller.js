import Alert from "../models/Alert.js";
import { CreateAlertSchema } from "../validators/alert.schema.js";
import { getAllLivePrices } from "../services/market.service.js";

/*  CREATE ALERT  */
export async function createAlert(req, res) {
  const parsed = CreateAlertSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const alert = await Alert.create({
    userId: req.user.id,
    ...parsed.data,
  });

  res.status(201).json(alert);
}

/*  GET ALL ALERTS  */
export async function getAlerts(req, res) {
  const alerts = await Alert.find({
    userId: req.user.id,
  }).sort({ createdAt: -1 });

  res.json(alerts);
}

/*  CHECK ALERTS  */
export async function checkAlerts(req, res) {
  try {
    const alerts = await Alert.find({
      userId: req.user.id,
      triggered: false,
    });

    if (!alerts.length) {
      return res.json([]);
    }

    // 🔥 Fetch ALL prices once (optimized)
    const pricesMap = await getAllLivePrices();

    for (const alert of alerts) {
      const price = Number(pricesMap[alert.symbol]);

      // Safety check
      if (!price || isNaN(price)) continue;

      const crossed =
        alert.direction === "above"
          ? price >= alert.targetPrice
          : price <= alert.targetPrice;

      if (crossed) {
        alert.triggered = true;
        alert.triggeredAt = new Date();
        alert.seen = false;
        await alert.save();
      }
    }

    const updatedAlerts = await Alert.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(updatedAlerts);
  } catch (err) {
    console.error("Check alerts failed:", err.message);
    res.status(500).json({ error: "Failed to check alerts" });
  }
}

/*  DELETE ALERT  */
export async function deleteAlert(req, res) {
  const { id } = req.params;

  const alert = await Alert.findOneAndDelete({
    _id: id,
    userId: req.user.id,
  });

  if (!alert) {
    return res.status(404).json({ error: "Alert not found" });
  }

  res.json({ success: true });
}

/*  MARK TRIGGERED AS SEEN  */
export async function markAlertsSeen(req, res) {
  await Alert.updateMany(
    { userId: req.user.id, triggered: true, seen: false },
    { $set: { seen: true } }
  );

  res.json({ success: true });
}