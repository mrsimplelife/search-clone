import { act, fireEvent, render, screen } from '@testing-library/react';
import Search from '../../../components/Search';
import Cache from '../../../utils/Cache';
import Provider from '../../../contexts/cacheContext';

describe('Search', () => {
  const getKeywords = jest.fn();
  const search = jest.fn();
  let cache = new Cache();

  beforeEach(() => {
    Element.prototype.scrollIntoView = jest.fn();
    getKeywords.mockClear();
    search.mockClear();
    jest.useFakeTimers();
    cache = new Cache();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('검색 입력창이 렌더링 되어야 한다', () => {
    render(
      <Provider cache={cache}>
        <Search getKeywords={getKeywords} search={search} />
      </Provider>
    );
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('입력 값이 변경될 때 getKeywords가 호출되어야 한다', async () => {
    getKeywords.mockResolvedValueOnce([
      { sickCd: '1', sickNm: 'keyword1' },
      { sickCd: '2', sickNm: 'keyword2' },
    ]);
    render(
      <Provider cache={cache}>
        <Search getKeywords={getKeywords} search={search} />
      </Provider>
    );
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'sick' } });
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    expect(getKeywords).toHaveBeenCalledWith('sick');
    expect(screen.getByText('keyword1')).toBeInTheDocument();
    expect(screen.getByText('keyword2')).toBeInTheDocument();
  });

  it('폼이 제출될 때 search 함수가 호출되어야 한다', () => {
    render(
      <Provider cache={cache}>
        <Search getKeywords={getKeywords} search={search} />
      </Provider>
    );
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'sick' } });
    fireEvent.submit(screen.getByRole('form', { name: 'search' }));
    expect(search).toHaveBeenCalledWith('sick');
  });

  it('입력창에 포커스가 있을 때 팝업이 표시되어야 한다', () => {
    render(
      <Provider cache={cache}>
        <Search getKeywords={getKeywords} search={search} />
      </Provider>
    );
    fireEvent.focus(screen.getByRole('searchbox'));
    expect(screen.getAllByRole('list')[0]).toBeInTheDocument();
  });

  it('마우스를 다른 곳을 클릭할 때 팝업이 사라져야 한다', () => {
    render(
      <Provider cache={cache}>
        <Search getKeywords={getKeywords} search={search} />
      </Provider>
    );
    fireEvent.focus(screen.getByRole('searchbox'));
    expect(screen.getAllByRole('list')[0]).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryAllByRole('list')).toHaveLength(0);
  });

  it('아래 화살표 키를 누를 때 다음 항목이 선택되어야 한다', async () => {
    getKeywords.mockResolvedValueOnce([
      { sickCd: '1', sickNm: 'keyword1' },
      { sickCd: '2', sickNm: 'keyword2' },
    ]);
    render(
      <Provider cache={cache}>
        <Search getKeywords={getKeywords} search={search} />
      </Provider>
    );
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'sick' } });
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'ArrowDown' });
    expect(screen.getByText('keyword1')).toHaveClass('selected');
  });

  it('위 화살표 키를 누를 때 이전 항목이 선택되어야 한다', async () => {
    getKeywords.mockResolvedValueOnce([
      { sickCd: '1', sickNm: 'keyword1' },
      { sickCd: '2', sickNm: 'keyword2' },
    ]);
    render(
      <Provider cache={cache}>
        <Search getKeywords={getKeywords} search={search} />
      </Provider>
    );
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'sick' } });
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'ArrowDown' });
    expect(screen.getByText('keyword1')).toHaveClass('selected');
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'ArrowUp' });
    expect(screen.getByText('keyword1')).not.toHaveClass('selected');
    expect(screen.getByText('keyword2')).toHaveClass('selected');
  });

  it('리스트의 끝에서 아래 화살표 키를 누르면 첫 번째 항목이 선택되어야 한다', async () => {
    getKeywords.mockResolvedValueOnce([
      { sickCd: '1', sickNm: 'keyword1' },
      { sickCd: '2', sickNm: 'keyword2' },
    ]);
    render(
      <Provider cache={cache}>
        <Search getKeywords={getKeywords} search={search} />
      </Provider>
    );
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'sick' } });
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'ArrowDown' });
    expect(screen.getByText('keyword1')).toHaveClass('selected');
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'ArrowDown' });
    expect(screen.getByText('keyword2')).toHaveClass('selected');
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'ArrowDown' });
    expect(screen.getByText('keyword1')).toHaveClass('selected');
  });

  it('리스트의 시작에서 위 화살표 키를 누르면 마지막 항목이 선택되어야 한다', async () => {
    getKeywords.mockResolvedValueOnce([
      { sickCd: '1', sickNm: 'keyword1' },
      { sickCd: '2', sickNm: 'keyword2' },
    ]);
    render(
      <Provider cache={cache}>
        <Search getKeywords={getKeywords} search={search} />
      </Provider>
    );
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'sick' } });
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'ArrowUp' });
    expect(screen.getByText('keyword2')).toHaveClass('selected');
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'ArrowUp' });
    expect(screen.getByText('keyword1')).toHaveClass('selected');
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'ArrowUp' });
    expect(screen.getByText('keyword2')).toHaveClass('selected');
  });

  it('Enter 키를 누를 때 항목이 선택되어야 한다', async () => {
    getKeywords.mockResolvedValueOnce([
      { sickCd: '1', sickNm: 'keyword1' },
      { sickCd: '2', sickNm: 'keyword2' },
    ]);
    render(
      <Provider cache={cache}>
        <Search getKeywords={getKeywords} search={search} />
      </Provider>
    );
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'sick' } });
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'ArrowDown' });
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter' });
    getKeywords.mockResolvedValueOnce([
      { sickCd: '1', sickNm: 'keyword3' },
      { sickCd: '2', sickNm: 'keyword4' },
    ]);
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    expect(getKeywords).toHaveBeenCalledWith('keyword1');
    expect(screen.getByText('keyword3')).toBeInTheDocument();
    expect(screen.getByText('keyword4')).toBeInTheDocument();
  });

  it('검색이 호출될 때 최근 검색 항목이 생성되어야 한다', async () => {
    render(
      <Provider cache={cache}>
        <Search getKeywords={getKeywords} search={search} />
      </Provider>
    );
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'sick' } });
    fireEvent.submit(screen.getByRole('form', { name: 'search' }));
    expect(screen.getByText('최근 검색어')).toBeInTheDocument();
    expect(screen.getByText('sick')).toBeInTheDocument();
  });

  it('삭제 버튼을 클릭할 때 최근 검색 항목이 삭제되어야 한다', () => {
    render(
      <Provider cache={cache}>
        <Search getKeywords={getKeywords} search={search} />
      </Provider>
    );
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'sick' } });
    fireEvent.submit(screen.getByRole('form', { name: 'search' }));
    expect(screen.getByText('최근 검색어')).toBeInTheDocument();
    expect(screen.getByText('sick')).toBeInTheDocument();
    fireEvent.click(screen.getByText('X'));
    expect(screen.queryByText('sick')).not.toBeInTheDocument();
  });
});
