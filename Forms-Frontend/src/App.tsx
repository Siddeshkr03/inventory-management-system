import { BrowserRouter, Routes, Route } from "react-router-dom";

import ItemForm from "./ItemForm";
import ItemIndex from "./ItemIndex";
import SupplierForm from "./SupplierForm";
import SupplierIndex from "./SupplierIndex";
import Dashboard from "./Dashboard";
import ItemShow from "./ItemShow";
import Register from "./Register";
import Login from "./Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Dashboard />}></Route>

        <Route path="/items" element={<ItemIndex />} />
        <Route path="/items/add" element={<ItemForm />} />
        <Route path="/items/edit/:id" element={<ItemForm />} />
        <Route path="/items/view/:id" element={<ItemShow />} />

        <Route path="/suppliers" element={<SupplierIndex />}></Route>
        <Route path="/suppliers/add" element={<SupplierForm />} />
        <Route path="/suppliers/edit/:id" element={<SupplierForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
