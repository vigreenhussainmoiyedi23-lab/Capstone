
import { config } from "./src/config/config.js";

import app from "./src/app.js";

import { ConnectToDB } from "./src/config/db.js";
import { connectRedis } from "./src/config/redis.js";

await ConnectToDB();
await connectRedis();

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});