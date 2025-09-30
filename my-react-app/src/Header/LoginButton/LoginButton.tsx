import IconButton from "../../IconButton/IconButton.tsx";
import Door from "../../svgs/door.svg?react";
import {useAuth} from "../../Context/AuthContext.tsx";

export default function LoginButton() {
    const {loggedIn, toggleLogin} = useAuth();
    return (
        <IconButton icon={<div className="Scene"><Door className="Door" height="100%" width="100%"/></div>}
                    label={loggedIn? "Log Out" : "Sign In"} onClick={() => {
                        toggleLogin();
        }}/>
    );
}