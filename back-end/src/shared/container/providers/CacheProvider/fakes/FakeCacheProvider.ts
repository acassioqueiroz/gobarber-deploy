import ICacheProvider from '../models/ICacheProvider';

interface ICacheData {
  [key: string]: string;
}

export default class RedisCacheProvider implements ICacheProvider {
  private data: ICacheData = {};

  public async save(key: string, value: string): Promise<void> {
    this.data[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.data[key];
    if (!data) {
      return null;
    }
    const parsedData = JSON.parse(data) as T;
    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.data[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.data).filter((key) =>
      key.startsWith(`${prefix}:`),
    );
    keys.forEach((key) => {
      delete this.data[key];
    });
  }
}
