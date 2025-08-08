import './App.css'
import Header from "../Header/Header.tsx";
import Temp from "../Temp/Temp.tsx";

function App() {
    const setTheme = (theme: "light" | "dark") => {
        document.documentElement.setAttribute("data-theme", theme);
    };

    return (
        <div className="App">
            <button onClick={() => setTheme("light")}>
                Light Mode
            </button>
            <button onClick={() => setTheme("dark")}>
                Dark Mode
            </button>
            <Header />
            <Temp />
        </div>
    )
}

export default App;