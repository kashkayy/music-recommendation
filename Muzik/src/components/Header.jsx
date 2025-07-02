export default function Header({setCurrentSection}) {
    return(
        <>
            <header>
                <h1>Sound Map 🎵</h1>
                <div className="nav-btns">
                    <button onClick={() => setCurrentSection("home")}>Home</button>
                    <button onClick={() => setCurrentSection("map")}>Map</button>
                    <button onClick={() => setCurrentSection("admin")}>Admin</button>
                </div>
                <p>Discover the best music</p>
            </header>
        </>
    )
}
