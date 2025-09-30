/// <reference types="vite-plugin-svgr/client" />
import {useEffect, useState} from "react";
import './Header.css'
import MenuIcon from "../svgs/menu.svg?react";
import Logo from "../svgs/dragon.svg?react";
import IconButton from "../IconButton/IconButton.tsx";
import ThemeButton from "./ThemeButton/ThemeButton.tsx";
import {Link} from "react-router";
import LoginButton from "./LoginButton/LoginButton.tsx";

export default function Header() {
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
                    <IconButton icon={<MenuIcon className="MenuIcon" height="100%" width="100%"/>} label={""}
                                onClick={() => {
                                }}/>
                    <Link to='/'>
                        <Logo className="Logo" color="var(--button-background-color)"/>
                    </Link>
                    <ThemeButton/>
                    <LoginButton/>
                </div>
            </header>
            <div className="header-filler"></div>
        </>
    )
}