import React from "react";

// 21.4.4
import { Link } from "react-router-dom";
// ------- //

// 21.5.5
import Auth from "../../utils/auth";
// ------- //

const Header = () => {
  // 21.5.5
  // completely remove the token from localStorage upon this action
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  // ------- //

  // 21.4.4
  // 增加了 <Link> & <nav>
  // update the <nav> element 加多login之后的状态
  // the <Link> component take us the logged-in user's profile page, 虽然本课还没完全搭建好
  return (
    <header className="bg-secondary mb-4 py-2 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <Link to="/">
          <h1>Deep Thoughts</h1>
        </Link>

        <nav className="text-center">
          {Auth.loggedIn() ? (
            <>
              <Link to="/profile">Me</Link>
              <a href="/" onClick={logout}>
                Logout
              </a>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
