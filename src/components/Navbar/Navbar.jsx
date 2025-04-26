import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li>
          <a href="/" className="navbar-link">
            Checkout
          </a>
        </li>
        <li>
          <a href="/v-light" className="navbar-link">
            Checkout Light
          </a>
        </li>
        <li>
          <a href="/v-dark" className="navbar-link">
            Checkout Dark
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
