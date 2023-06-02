/* eslint-disable react/jsx-no-useless-fragment */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

import FormComponent from './components/emailform.component';

function Home() {
  return (
    <>
      <FormComponent />

      {/* <button type="button">
        <span role="img" aria-label="folded hands">
          🙏
        </span>
        Donate
      </button> */}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
