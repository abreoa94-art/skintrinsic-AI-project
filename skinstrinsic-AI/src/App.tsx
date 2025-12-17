import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Testing from './pages/Testing';
import Capture from './pages/Capture';
import Result from './pages/Result';
import Analysis from './pages/Analysis';
import Demographics from './pages/Demographics';
import Summary from './pages/Summary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/testing" element={<Testing />} />
        <Route path="/capture" element={<Capture />} />
        <Route path="/result" element={<Result />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/demographics" element={<Demographics />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </Router>
  );
}

export default App;
