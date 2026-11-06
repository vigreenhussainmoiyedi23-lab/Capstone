// import Navbar from "../commonComponents/Navbar";

const CommonLayout = ({ children }) => {
  return (
    <section className="min-h-screen relative">
      {/* <Navbar /> */}

      {children}
    </section>
  );
};

export default CommonLayout;
