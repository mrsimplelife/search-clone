import { render, screen, fireEvent } from '@testing-library/react';
import RecommendItem from '../../../components/RecommendItem';

describe('RecommendItem', () => {
  const id = 1;
  const name = 'Test Name';
  const onClick = jest.fn();
  const onDelete = jest.fn();

  beforeEach(() => {
    onClick.mockClear();
    onDelete.mockClear();
  });

  it('제공된 이름을 렌더링해야 한다', () => {
    render(<RecommendItem id={id} name={name} onClick={onClick} onDelete={onDelete} />);
    expect(screen.getByText(name)).toBeInTheDocument();
  });

  it('항목 클릭 시 onClick 함수가 호출되어야 한다', () => {
    render(<RecommendItem id={id} name={name} onClick={onClick} onDelete={onDelete} />);
    fireEvent.click(screen.getByText(name));
    expect(onClick).toHaveBeenCalledWith(name);
  });

  it('삭제 버튼 클릭 시 onDelete 함수가 호출되어야 한다', () => {
    render(<RecommendItem id={id} name={name} onClick={onClick} onDelete={onDelete} />);
    fireEvent.click(screen.getByText('X'));
    expect(onDelete).toHaveBeenCalledWith(id);
  });
});
