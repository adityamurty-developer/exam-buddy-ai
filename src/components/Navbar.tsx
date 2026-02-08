import { useState } from "react";
import { NavLink } from "./NavLink"; // tumhara existing NavLink.tsx

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  return (
    <header className="bg-background border-b border-border px-4 py-2 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <div className="text-2xl font-bold text-foreground">Exam Buddy AI</div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 text-foreground font-medium">
          <NavLink to="/" className="hover:text-primary transition-colors" activeClassName="text-primary font-semibold">
            Home
          </NavLink>
          <NavLink to="/news" className="hover:text-primary transition-colors" activeClassName="text-primary font-semibold">
            News
          </NavLink>
          <NavLink to="/about" className="hover:text-primary transition-colors" activeClassName="text-primary font-semibold">
            About
          </NavLink>
        </nav>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="md:hidden flex flex-col space-y-2 mt-2 px-4 pb-2 border-t border-border bg-background">
          <NavLink to="/" className="hover:text-primary transition-colors" activeClassName="text-primary font-semibold" onClick={() => setMobileOpen(false)}>Home</NavLink>
          <NavLink to="/news" className="hover:text-primary transition-colors" activeClassName="text-primary font-semibold" onClick={() => setMobileOpen(false)}>News</NavLink>
          <NavLink to="/about" className="hover:text-primary transition-colors" activeClassName="text-primary font-semibold" onClick={() => setMobileOpen(false)}>About</NavLink>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
