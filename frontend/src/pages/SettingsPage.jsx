import { useContext } from "react";
import { UserContext } from "../contexts/UserContext/UserContext";

export default function SettingsPage() {
    const {username} = useContext(UserContext);
    return (
        <h1>Username is: {username}</h1>
    );
}