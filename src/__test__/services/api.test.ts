import { getKeywords } from '../../services/api';

describe('getKeywords', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue([
        { id: 1, name: 'keyword1' },
        { id: 2, name: 'keyword2' },
      ]),
    } as unknown as Response);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('올바른 URL로 fetch를 호출해야 함', async () => {
    await getKeywords('test');
    expect(global.fetch).toHaveBeenCalledWith('https://search-back-mrsimplelife.vercel.app/api/sick?q=test');
  });

  it('아이템 배열을 반환해야 함', async () => {
    const result = await getKeywords('test');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[0]).toHaveProperty('id', 1);
    expect(result[0]).toHaveProperty('name', 'keyword1');
    expect(result[1]).toHaveProperty('id', 2);
    expect(result[1]).toHaveProperty('name', 'keyword2');
  });
});
