import Navbar from "./Navbar/Navbar";

const Layout = (props) => {
  return (
    <div>
      <Navbar />
      <main>{props.children}</main>
    </div>
  );
};

export default Layout;
