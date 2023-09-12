import { createRecentItem, deleteRecentItem, readRecentItem } from '../../utils/localStorageUtils';

describe('localStorageUtils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('createRecentItem', () => {
    it('이름이 없을 때 항목을 생성하지 않아야 함', () => {
      const recentItems = createRecentItem('');
      expect(recentItems).toEqual([]);
    });

    it('항목이 없을 때 새로운 항목을 생성해야 함', () => {
      const name = 'test';
      const recentItems = createRecentItem(name);
      expect(recentItems).toEqual([{ id: 1, name }]);
      expect(JSON.parse(localStorage.getItem('recent')!)).toEqual([{ id: 1, name }]);
    });

    it('항목에 이름이 없을 때 새로운 항목을 추가해야 함', () => {
      const name1 = 'test1';
      const name2 = 'test2';
      localStorage.setItem('recent', JSON.stringify([{ id: 1, name: name1 }]));
      const recentItems = createRecentItem(name2);
      expect(recentItems).toEqual([
        { id: 2, name: name2 },
        { id: 1, name: name1 },
      ]);
      expect(JSON.parse(localStorage.getItem('recent')!)).toEqual([
        { id: 2, name: name2 },
        { id: 1, name: name1 },
      ]);
    });

    it('항목이 있을 때 기존 항목을 최상단으로 이동해야 함', () => {
      const name1 = 'test1';
      const name2 = 'test2';
      localStorage.setItem(
        'recent',
        JSON.stringify([
          { id: 2, name: name2 },
          { id: 1, name: name1 },
        ])
      );
      const recentItems = createRecentItem(name1);
      expect(recentItems).toEqual([
        { id: 3, name: name1 },
        { id: 2, name: name2 },
      ]);
      expect(JSON.parse(localStorage.getItem('recent')!)).toEqual([
        { id: 3, name: name1 },
        { id: 2, name: name2 },
      ]);
    });

    it('항목이 5개 이상일 때 가장 오래된 항목을 삭제해야 함', () => {
      const name1 = 'test1';
      const name2 = 'test2';
      const name3 = 'test3';
      const name4 = 'test4';
      const name5 = 'test5';
      localStorage.setItem(
        'recent',
        JSON.stringify([
          { id: 5, name: name5 },
          { id: 4, name: name4 },
          { id: 3, name: name3 },
          { id: 2, name: name2 },
          { id: 1, name: name1 },
        ])
      );
      const recentItems = createRecentItem('test6');
      expect(recentItems).toEqual([
        { id: 1, name: 'test6' },
        { id: 5, name: name5 },
        { id: 4, name: name4 },
        { id: 3, name: name3 },
        { id: 2, name: name2 },
      ]);
      expect(JSON.parse(localStorage.getItem('recent')!)).toEqual([
        { id: 1, name: 'test6' },
        { id: 5, name: name5 },
        { id: 4, name: name4 },
        { id: 3, name: name3 },
        { id: 2, name: name2 },
      ]);
    });
  });

  describe('readRecentItem', () => {
    it('항목이 없을 때 빈 배열을 반환해야 함', () => {
      const recentItems = readRecentItem();
      expect(recentItems).toEqual([]);
    });

    it('항목이 있을 때 항목을 반환해야 함', () => {
      const items = [
        { id: 1, name: 'test1' },
        { id: 2, name: 'test2' },
      ];
      localStorage.setItem('recent', JSON.stringify(items));
      const recentItems = readRecentItem();
      expect(recentItems).toEqual(items);
    });
  });

  describe('deleteRecentItem', () => {
    const items = [
      { id: 1, name: 'test1' },
      { id: 2, name: 'test2' },
    ];

    it('항목이 없을 때 빈 배열을 반환해야 함', () => {
      const recentItems = deleteRecentItem(1);
      expect(recentItems).toEqual([]);
    });

    it('주어진 ID를 가진 항목을 삭제해야 함', () => {
      localStorage.setItem('recent', JSON.stringify(items));
      const recentItems = deleteRecentItem(1);
      expect(recentItems).toEqual([{ id: 2, name: 'test2' }]);
      expect(JSON.parse(localStorage.getItem('recent')!)).toEqual([{ id: 2, name: 'test2' }]);
    });

    it('ID가 존재하지 않을 때 어떤 항목도 삭제하지 않아야 함', () => {
      localStorage.setItem('recent', JSON.stringify(items));
      const recentItems = deleteRecentItem(3);
      expect(recentItems).toEqual(items);
      expect(JSON.parse(localStorage.getItem('recent')!)).toEqual(items);
    });
  });
});
