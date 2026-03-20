import { Link, Outlet } from "react-router-dom";
import "./Layout.css";

function Layout() {
  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-content">
          <Link to="/" className="header-title">
            L Compendium
          </Link>
          <nav className="header-nav">
            <Link to="/" className="nav-link">
              Browse
            </Link>
            <Link to="/upload" className="nav-link">
              Upload
            </Link>
          </nav>
        </div>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
