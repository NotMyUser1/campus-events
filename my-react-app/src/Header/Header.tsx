/// <reference types="vite-plugin-svgr/client" />
import {useEffect, useState} from "react";
import './Header.css'
import MainTitle from "/public/menu.svg?react";
import IconButton from "../IconButton/IconButton.tsx";

const Header = () => {
    const [position, setPosition] = useState(window.pageYOffset);
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const handleScroll = () => {
            const moving = window.pageYOffset
            setVisible(position > moving);
            setPosition(moving)
        };
        window.addEventListener("scroll", handleScroll);
        return (() => {
            window.removeEventListener("scroll", handleScroll);
        })
    })

    return (
        <>
            <header className={visible ? "header-visible" : "header-hidden"}>
                <IconButton icon={<MainTitle height="100%" width="100%" />} label={""} onClick={() => {}}/>
                <img className="Logo"
                     src="https://mediatool.mitegro.de/DimensionImages/12411/12411156_MZ.jpg" alt={"alt"}/>
                <IconButton icon={<MainTitle height="100%" width="100%"/>} label={""} onClick={() => {}}/>
                <IconButton icon={<MainTitle height="100%" width="100%"/>} label={"Sign In"} onClick={() => {}}/>
            </header>
            <div className="header-filler"></div>
        </>
    )
}

export default Header;
