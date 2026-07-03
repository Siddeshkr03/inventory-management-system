import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

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

        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}></Route>

        <Route path="/items" element={<ProtectedRoute><ItemIndex /></ProtectedRoute>} />
        <Route path="/items/add" element={<ProtectedRoute><ItemForm /></ProtectedRoute>} />
        <Route path="/items/edit/:id" element={<ProtectedRoute><ItemForm /></ProtectedRoute>} />
        <Route path="/items/view/:id" element={<ProtectedRoute><ItemShow /></ProtectedRoute>} />

        <Route path="/suppliers" element={<ProtectedRoute><SupplierIndex /></ProtectedRoute>}></Route>
        <Route path="/suppliers/add" element={<ProtectedRoute><SupplierForm /></ProtectedRoute>} />
        <Route path="/suppliers/edit/:id" element={<ProtectedRoute><SupplierForm /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
