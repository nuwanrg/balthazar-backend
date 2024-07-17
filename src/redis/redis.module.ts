import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const useCache = configService.get<string>('USE_CACHE') === 'true';
        if (useCache) {
          const redisUrl = configService.get<string>('REDIS_URL');
          return new Redis(redisUrl);
        }
        return null; // No Redis client when caching is disabled
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
