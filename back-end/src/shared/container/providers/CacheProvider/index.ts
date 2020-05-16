import { container } from 'tsyringe';
import cacheConfig from '@config/cache';
import ICacheProvider from './models/ICacheProvider';
import RedisCacheProvider from './implementations/RedisCacheProvider';

const providers = {
  redis: RedisCacheProvider,
};

container.registerInstance<ICacheProvider>(
  'CacheProvider',
  new providers[cacheConfig.driver](),
);
