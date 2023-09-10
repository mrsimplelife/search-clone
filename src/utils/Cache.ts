class Cache<T> {
  private cache = new Map<string, T>();
  get(key: string) {
    return this.cache.get(key);
  }
  set(key: string, value: T) {
    this.cache.set(key, value);
  }
  has(key: string) {
    return this.cache.has(key);
  }
}

export default Cache;
