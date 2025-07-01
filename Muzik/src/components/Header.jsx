export default function Header({setCurrentSection}) {
    return(
        <>
            <header>
                <h1>Sound Map 🎵</h1>
                <p>Discover the best music</p>
                <div className="nav-btns">
                    <button onClick={() => setCurrentSection("home")}>Home</button>
                    <button onClick={() => setCurrentSection("Map")}>Map</button>
                    <button onClick={() => setCurrentSection("Admin")}>Admin</button>
                </div>

            </header>
        </>
    )
}
