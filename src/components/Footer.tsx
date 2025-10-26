import React from "react";

const Footer: React.FC = () => (
  <footer className="bg-gray-50 border-t">
    <div className="container mx-auto px-4 py-4 text-sm text-gray-600">
      <div>
        © {new Date().getFullYear()} ReliefMap — built for relief coordination
      </div>
    </div>
  </footer>
);

export default Footer;
