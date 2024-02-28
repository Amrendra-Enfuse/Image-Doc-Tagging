import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./Homepage";
import Layout from "./layout";
import ItemTable from "./ItemTable";
import DetailsPage from "./DetailsPage";

function App() {
  let urlPath = window.location.pathname.split('/');
  const homepath = `/${urlPath[1]}/${urlPath[2]}`;
  const itemTableRect = `/${urlPath[1]}/${urlPath[2]}/rect`;
  const layoutpath = `/${urlPath[1]}/${urlPath[2]}/rect/${urlPath[4]}/${urlPath[5]}/${urlPath[6]}/layout`;
  const detailpath = `/${urlPath[1]}/${urlPath[2]}/rect/${urlPath[4]}/${urlPath[5]}/${urlPath[6]}/detail`;
  console.log(urlPath, detailpath)
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path={homepath} element={<Homepage />} />
          <Route path="/:id/:img/:rect/:projectone/:taskone/:folderone/layout" element={<Layout />} />
          <Route path="/:id/:img/:rect" element={<ItemTable />} />
          <Route path="/:id/:img/:poly" element={<ItemTable />} />
          <Route path="/:id/:img/:rect/:projectone/:taskone/:folderone/detail" element={<DetailsPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
