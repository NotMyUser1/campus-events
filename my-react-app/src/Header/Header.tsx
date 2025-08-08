/// <reference types="vite-plugin-svgr/client" />
import {useEffect, useState} from "react";
import './Header.css'
import MainTitle from "/public/menu.svg?react";
import Logo from "/public/dragon.svg?react";
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
                <div className="box">
                    <IconButton icon={<MainTitle height="100%" width="100%"/>} label={""} onClick={() => {
                    }}/>
                    <Logo className="Logo" />
                    <div className="EndNav">
                        <IconButton icon={<MainTitle height="100%" width="100%"/>} label={""} onClick={() => {
                        }}/>
                    </div>
                    <IconButton icon={<MainTitle height="100%" width="100%"/>} label={"Sign In"} onClick={() => {
                    }}/>


                </div>
            </header>
            <div className="header-filler"></div>
        </>
    )
}

export default Header;
