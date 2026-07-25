import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { CacheRepository } from '../../domain/ports/cache.repository';
import Redis from 'ioredis';

@Injectable()
export class RedisRepository implements CacheRepository, OnModuleDestroy {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds: number = 60): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
