import { render, screen, fireEvent } from '@testing-library/react';
import ListItem from '../../../components/ListItem';

describe('ListItem', () => {
  const title = 'Test Title';
  const onClick = jest.fn();

  beforeEach(() => {
    onClick.mockClear();
  });

  it('제공된 제목을 렌더링해야 한다', () => {
    render(<ListItem title={title} onClick={onClick} selected={false} />);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('항목 클릭 시 onClick 함수가 호출되어야 한다', () => {
    render(<ListItem title={title} onClick={onClick} selected={false} />);
    fireEvent.click(screen.getByText(title));
    expect(onClick).toHaveBeenCalledWith(title);
  });

  it('selected가 true일 때 선택된 클래스를 가져야 한다', () => {
    render(<ListItem title={title} onClick={onClick} selected={true} />);
    expect(screen.getByText(title)).toHaveClass('selected');
  });

  it('selected가 false일 때 선택된 클래스를 가져서는 안된다', () => {
    render(<ListItem title={title} onClick={onClick} selected={false} />);
    expect(screen.getByText(title)).not.toHaveClass('selected');
  });
});
