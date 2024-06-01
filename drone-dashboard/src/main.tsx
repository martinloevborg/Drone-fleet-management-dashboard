import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home.tsx";
import Error from "./pages/Error.tsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/*" element={<Error/>} />
    </Routes>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw Error('Failed to find the root element');
ReactDOM.createRoot(rootElement).render(
  <Router>
    <App />
  </Router>
);
