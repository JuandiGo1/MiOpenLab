
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from '../auth/pages/LoginPage'
import ExplorePage from "../explore/pages/ExplorePage";
import '../App.css'


function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<ExplorePage />} /> 
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
