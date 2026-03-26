import dotenv from "dotenv";
dotenv.config({ quiet: true });

import { connectDB } from "./db/connect.js";

async function start() {
  try {
    await connectDB();
  } catch (err) {
    console.error("Failed to start DB", err);
    process.exit(1);
  }
}

start();