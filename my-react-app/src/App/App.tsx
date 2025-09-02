import './App.css'
import Header from "../Header/Header.tsx";
import Temp from "../Temp/Temp.tsx";
import {BrowserRouter, Routes, Route} from "react-router";

export default function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route path="/" element={<Temp/>}/>
                    <Route path="/event/:eventId" element={<h3>hello</h3>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}