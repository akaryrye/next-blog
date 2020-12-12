import Header from './Header';

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <Header />
      {children}
      <footer className="footer">
        <div className="container text-center">
          <span className="text-muted">© Ryan K Alldrin 2020</span>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default Layout;