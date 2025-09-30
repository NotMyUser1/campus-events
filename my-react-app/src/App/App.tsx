import './App.css'
import Header from "../Header/Header.tsx";
import OverviewPage from "../OverviewPage/OverviewPage.tsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import DetailPage from "../DetailPage/DetailPage.tsx";
import CreateEditEventPage from "../CreateEditEventPage/CreateEditEventPage.tsx";

export default function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route path="/" element={<OverviewPage/>}/>
                    <Route path="/event/:eventId" element={<DetailPage/>}/>
                    <Route path="/event/edit" element={<CreateEditEventPage/>}/>
                    <Route path="/event/edit/:eventId" element={<CreateEditEventPage/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}