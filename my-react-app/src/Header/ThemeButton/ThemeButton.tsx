import useLocalStorage from "use-local-storage";
import Sun from "../../svgs/sun.svg?react";
import Moon from "../../svgs/moon.svg?react";
export default function ThemeButton() {
    const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isDark, setIsDark] = useLocalStorage("isDark", preference);

    if (isDark) {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
    }

    return (
        <button className="icon-button" onClick={() => setIsDark(!isDark)}>
            {isDark? <Sun className="Sun" height="100%" width="100%"/>
                : <Moon height="100%" width="100%" /> }
        </button>
    );
}