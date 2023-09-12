import Search from './components/Search';
import Provider from './contexts/cacheContext';
import { getKeywords } from './services/api';
import Cache from './utils/Cache';

const cache = new Cache<unknown>();

function App() {
  return (
    <Provider cache={cache}>
      <Search getKeywords={getKeywords} search={() => Promise.resolve([{ id: 1, name: 'keyword1' }])} />
    </Provider>
  );
}

export default App;
