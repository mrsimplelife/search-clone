import Search from './components/Search';
import Provider from './contexts/cacheContext';
import Cache from './utils/Cache';

const cache = new Cache<unknown>();

function App() {
  return (
    <Provider cache={cache}>
      <Search />
    </Provider>
  );
}

export default App;
