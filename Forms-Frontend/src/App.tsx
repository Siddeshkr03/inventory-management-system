import { BrowserRouter, Routes, Route } from "react-router-dom";

import ItemForm from './ItemForm';
import ItemIndex from './ItemIndex';
import SupplierForm from "./SupplierForm";
import SupplierIndex from "./SupplierIndex";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ItemIndex />} />
        <Route path="/forms" element={<ItemForm />} />
        <Route path="/edit/:id" element={<ItemForm />} />
        <Route path="/add-supplier" element={<SupplierForm />} />
        <Route path="/supplier" element={<SupplierIndex/>}></Route>
        <Route path="/supplier/edit/:id" element={<SupplierForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
