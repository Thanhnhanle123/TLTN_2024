import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Container chỉ được truyền ở đây
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
