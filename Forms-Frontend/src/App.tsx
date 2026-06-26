import { BrowserRouter, Routes, Route } from "react-router-dom";

import ItemForm from './ItemForm';
import ItemIndex from './ItemIndex';
import SupplierForm from "./SupplierForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ItemIndex />} />
        <Route path="/forms" element={<ItemForm />} />
        <Route path="/edit/:id" element={<ItemForm />} />
        <Route path="/supplier" element={<SupplierForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
