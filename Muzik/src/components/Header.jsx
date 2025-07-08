import { useAuth } from "../auth/AuthContext";
export default function Header({setCurrentSection}) {
    const {logout} = useAuth()
    function handleLogOut() {
        logout()
    }
    return(
        <>
            <header>
                <h1>Sound Map 🎵</h1>
                <div className="nav-btns">
                    <button onClick={() => setCurrentSection("home")}>Home</button>
                    <button onClick={() => setCurrentSection("map")}>Map</button>
                    <button onClick={() => setCurrentSection("admin")}>Admin</button>
                </div>
                <button onClick={() => handleLogOut()}>Logout</button>
            </header>
        </>
    )
}
