import { Link, useLocation } from "react-router-dom";
import { HandbookSearchInput } from "./handbook/HandbookSearchInput";

export default function Navbar() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/quiz/play";

  if (hideNavbar) return null;

  return (
    <nav className="bg-primary text-primary-foreground p-4">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-lg font-bold shrink-0">
          QUIZNOX
        </Link>

        <div className="ml-auto w-full max-w-xs md:max-w-sm">
          <HandbookSearchInput />
        </div>
      </div>
    </nav>
  );
}
