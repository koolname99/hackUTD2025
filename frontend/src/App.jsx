import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import TransactionsByMonth from "./components/TransactionsByMonth";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/transactions" element={<TransactionsByMonth />} />
      </Routes>
    </Router>
  );
}
