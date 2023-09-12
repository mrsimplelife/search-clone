import { render, screen } from '@testing-library/react';
import Provider, { useCache } from '../../contexts/cacheContext';
import Cache from '../../utils/Cache';

describe('CacheContext', () => {
  const cache = new Cache<string>();
  cache.set('key1', 'value1');
  cache.set('key2', 'value2');

  const TestComponent = () => {
    const { cache: contextCache } = useCache<string>();
    const value1 = contextCache.get('key1');
    const value2 = contextCache.get('key2');
    return (
      <div>
        <div data-testid="value1">{value1}</div>
        <div data-testid="value2">{value2}</div>
      </div>
    );
  };

  it('캐시 컨텍스트를 제공해야 함', () => {
    render(
      <Provider cache={cache}>
        <TestComponent />
      </Provider>
    );
    expect(screen.getByTestId('value1')).toHaveTextContent('value1');
    expect(screen.getByTestId('value2')).toHaveTextContent('value2');
  });
});
