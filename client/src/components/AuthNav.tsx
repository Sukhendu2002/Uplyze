import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { X, Command } from "lucide-react";
import MobileNav from "./MobileNav";
import { ModeToggle } from "./mode-toggle";

const navItems = [
  {
    title: "Home",
    href: "/",
    disabled: false,
  },
  {
    title: "Login",
    href: "/login",
    disabled: false,
  },
  {
    title: "About",
    href: "/about",
    disabled: false,
  },
  {
    title: "Contact",
    href: "/contact",
    disabled: false,
  },
];

interface AuthNavProps {
  onLogout: () => void;
}

const AuthNav: React.FC<AuthNavProps> = ({ onLogout }) => {
  const location = useLocation();
  const segment = location.pathname.split("/")[1];
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
  };

  return (
    <header className="container z-40 bg-background">
      <div className="flex h-10 items-center justify-between py-6">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="hidden items-center space-x-2 md:flex">
            {/* <Icons.logo /> */}
            <span className="hidden font-bold sm:inline-block">Uplyze</span>
          </Link>
          {navItems?.length ? (
            <nav className="hidden gap-6 md:flex ">
              {navItems?.map((item, index) => (
                <Link
                  key={index}
                  to={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex  items-center text-lg font-medium transition-colorshover:text-foreground/80 sm:text-sm",
                    item.href.startsWith(`/${segment}`)
                      ? "text-foreground"
                      : "text-gray-500",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          ) : null}
          <button
            className="flex items-center space-x-2 md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X /> : <Command />}
            <span className="font-bold">Menu</span>
          </button>
          {showMobileMenu && navItems && <MobileNav items={navItems} />}
        </div>
        <nav className="flex items-center gap-4 md:gap-6 text-sm font-medium transition-colors hover:text-foreground/80">
          <ModeToggle />
          <button
            onClick={logout}
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "px-4"
            )}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AuthNav;
