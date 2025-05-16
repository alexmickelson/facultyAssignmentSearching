import { createClient } from "redis";

// Redis consumer function using node-redis
export const redisClient = createClient({
  url: "redis://search_redis:6379",
});
await redisClient.connect();

const jobQueue = "jobs-channel";

redisClient.on("error", (err: Error) =>
  console.error("Redis Client Error", err)
);
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

export const consumeRedisJobs = async () => {
  await redisClient.connect();
  console.log("Subscribing to channel:", jobQueue);

  redisClient.subscribe(jobQueue, (message: string) => {
    console.log(`Received message from ${jobQueue}:`, message);
    // try {
    //   const job = JSON.parse(message);
    //   console.log("Processing job:", job);
    // } catch (error) {
    //   console.error("Failed to process job:", error);
    //   throw error;
    // }
  });
};

export const pushJobToQueue = async (job: object) => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  const message = JSON.stringify(job);
  await redisClient.publish(jobQueue, message);
  console.log(`Job pushed to ${jobQueue}:`, job);
};
