import "./HomePage.css";

function HomePage(){
    return(
        <div className= "homepage">

            {/*navbar*/}
            <nav className= "navbar">
                <h1 className="logo">Paper Studio</h1>
                <div className= "nav-links">
                    <NavLink to="/pencils">pen/pencils</NavLink>
                    <NavLink to="/cases">cases</NavLink>
                    <NavLink to="/notebooks">notebooks</NavLink>
                </div>

                <div className="icons">
                    <span>🔍</span>
                    <span>🛒</span>
                    <span>👤</span>
                </div>
                 </nav>
                {/*hero section*/}
                
            <section className="hero">
                <div className="hero-content">
                    <h1>Stationery that inspires creativity</h1>
                    <p>Discover, Organize, Create, with our curated collection of stationery.</p>   
            
            <nav style={{padding: "20px", backgroundColor: "#e6e1c5"}}>
                <h2>Paper Studio</h2>
                </nav>
                </div>
                </section>

                <section style={{padding: "60px", background: "#e6e1c5"}}>
                <h1>Stationery that inspires creativity</h1>
                <p>Discover, Organize, Create, with our curated collection of stationery.</p>
                    <button style= {{
                        color: "#48423B",
                        padding: "12px 24px",
                        border: "none",
                    }}>
                        Shop Now</button>
                    
                    </section>
        </div>
    
    )
}

export default HomePage