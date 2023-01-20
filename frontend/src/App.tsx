import { Provider } from 'react-redux';
import Game from './pages/Game';
import store from './store';

function App(): React.ReactElement {
  return (
    <Provider store={store}>
      <Game />
    </Provider>
  );
}

export default App;