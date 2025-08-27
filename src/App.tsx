import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Incomes from "./pages/Incomes";
import Expenses from "./pages/Expenses";
import Search from "./pages/Search";

function App() {
  return (
    <Routes>
      <Route index path="/ExpenseTrackerWebApp_2/" element={<Home />} />
      <Route path="/ExpenseTrackerWebApp_2/incomes" element={<Incomes />} />
      <Route path="/ExpenseTrackerWebApp_2/expenses" element={<Expenses />} />
      <Route path="/ExpenseTrackerWebApp_2/search" element={<Search />} />
    </Routes>
  );
}

export default App;
