import axios from "axios";
// Every API call must carry the auth cookies (backend routes are cookie-authenticated).
axios.defaults.withCredentials = true;
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
