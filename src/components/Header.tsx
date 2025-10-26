import React from "react";
import { NavLink } from "react-router-dom";

const NavItem: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded ${
        isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
      }`
    }
  >
    {children}
  </NavLink>
);

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="text-lg font-bold">
            ReliefMap
          </a>
          <nav className="hidden sm:flex items-center gap-2">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/profile">Profile</NavItem>
            <NavItem to="/auth">Sign in</NavItem>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
