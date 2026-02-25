import Navbar from "./ui/Navbar/Navbar";

const Layout = (props) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div>{props.children}</div>
    </div>
  );
};

export default Layout;
