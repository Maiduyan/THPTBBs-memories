import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Không dùng StrictMode để tránh Phaser bị khởi tạo/huỷ 2 lần trong môi trường dev.
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
