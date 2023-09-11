import Cache from '../../utils/Cache';

describe('Cache class', () => {
  let cache: Cache<number>;

  beforeEach(() => {
    cache = new Cache<number>();
  });

  it('값을 올바르게 설정해야 함', () => {
    cache.set('testKey', 123);
    expect(cache.get('testKey')).toBe(123);
  });

  it('키가 존재하지 않을 때 undefined를 반환해야 함', () => {
    expect(cache.get('someRandomKey')).toBeUndefined();
  });

  it('키의 존재 여부를 올바르게 확인해야 함', () => {
    expect(cache.has('testKey')).toBe(false);
    cache.set('testKey', 123);
    expect(cache.has('testKey')).toBe(true);
  });

  it('기존 값이 새 값으로 덮어씌워져야 함', () => {
    cache.set('testKey', 123);
    expect(cache.get('testKey')).toBe(123);

    cache.set('testKey', 456);
    expect(cache.get('testKey')).toBe(456);
  });
});
