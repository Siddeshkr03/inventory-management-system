import { BrowserRouter, Routes, Route } from "react-router-dom";

import ItemForm from './ItemForm';
import ItemIndex from './ItemIndex';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ItemIndex />} />
        <Route path="/forms" element={<ItemForm />} />
        <Route path="/edit/:id" element={<ItemForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
