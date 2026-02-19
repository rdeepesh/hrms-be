import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/database";
import { env } from "./config/env";

const startServer = async (): Promise<void> => {
  await connectDB(env.MONGO_URI);

  app.listen(env.PORT, () => {
    console.log(`HRMS backend running on port ${env.PORT}`);
  });
};

void startServer();
