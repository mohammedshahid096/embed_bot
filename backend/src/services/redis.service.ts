import redis from "../config/redis.config";
import { AppError } from "../utils/errorHandling.util";
import redisExpiryTime from "../constants/redis.constant";

const redisExpiry = redisExpiryTime.fifteenMinuteInSec;

class RedisServiceClass {
  redisExpiry: number;
  constructor({ expiryTime }: { expiryTime?: number } = {}) {
    this.redisExpiry = expiryTime ?? redisExpiry;
  }
  async setRedisJSON(key: string, value: any) {
    try {
      const stringValue = JSON.stringify(value);
      await redis.set(key, stringValue, "EX", this.redisExpiry);
      return true;
    } catch (error: any) {
      const customError = new Error(error?.message) as AppError;
      customError.status = 503; // Service Unavailable
      customError.name = "RediConnectionError";
      throw customError;
    }
  }

  async getRedisJSON(key: string) {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error: any) {
      const customError = new Error(error?.message) as AppError;
      customError.status = 503; // Service Unavailable
      customError.name = "RediConnectionError";
      throw customError;
    }
  }

  async deleteRedisKey(key: string) {
    try {
      await redis.del(key);
      return true;
    } catch (error: any) {
      const customError = new Error(error?.message) as AppError;
      customError.status = 503; // Service Unavailable
      customError.name = "RediConnectionError";
      throw customError;
    }
  }

  async deletePattern(pattern: string) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(keys);
      }
      return true;
    } catch (error: any) {
      const customError = new Error(error?.message) as AppError;
      customError.status = 503; // Service Unavailable
      customError.name = "RediConnectionError";
      throw customError;
    }
  }
}
export default RedisServiceClass;
