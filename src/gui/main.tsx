import { createRoot } from 'react-dom/client';
import 'animate.css';
import '@/gui/input.scss';
import App from '@/gui/pages/App';
createRoot(document.getElementById('root')!).render(<App />);
