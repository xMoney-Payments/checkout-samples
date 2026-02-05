import { A } from "@solidjs/router";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="nav-menu">
          <li className="nav-item">
            <A href="/" className="nav-link" activeClass="active" end>
              Payment Form
            </A>
          </li>
          <li className="nav-item">
            <A
              href="/payment-methods"
              className="nav-link"
              activeClass="active"
            >
              Embedded Components
            </A>
          </li>
          <li className="nav-item">
            <A href="/custom-cards" className="nav-link" activeClass="active">
              Custom Cards
            </A>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
