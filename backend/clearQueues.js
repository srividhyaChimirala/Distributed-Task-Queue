import { emailQueue } from "./queues/emailQueue.js";
import { imageQueue } from "./queues/imageQueue.js";
import { reportQueue } from "./queues/reportQueue.js";

await emailQueue.obliterate({ force: true });
await imageQueue.obliterate({ force: true });
await reportQueue.obliterate({ force: true });

console.log("All queues cleared");
process.exit(0);