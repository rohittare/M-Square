import { useState } from "react";
import { Search, ChevronDown, User, Heart, LogOut, Menu, X } from "lucide-react";

interface HeaderProps {
  onSavedClick: () => void;
}

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 61 61" className="w-7 h-7 sm:w-8 sm:h-8">
                <g fill="hsl(27, 97%, 54%)">
                  <path d="M30.5 0C13.664 0 0 13.664 0 30.5S13.664 61 30.5 61 61 47.336 61 30.5 47.336 0 30.5 0zm0 56C16.439 56 5 44.561 5 30.5S16.439 5 30.5 5 56 16.439 56 30.5 44.561 56 30.5 56z"/>
                  <path d="M30.5 10c-11.322 0-20.5 9.178-20.5 20.5S19.178 51 30.5 51 51 41.822 51 30.5 41.822 10 30.5 10zm0 36c-8.56 0-15.5-6.94-15.5-15.5S21.94 15 30.5 15 46 21.94 46 30.5 39.06 46 30.5 46z"/>
                  <circle cx="30.5" cy="30.5" r="8"/>
                </g>
              </svg>
              <span className="text-lg sm:text-xl font-bold text-swiggy-orange">swiggy</span>
            </div>

            {/* Location */}
            <div className="hidden md:flex items-center gap-1 cursor-pointer group">
              <span className="text-sm font-semibold text-foreground border-b-2 border-foreground">Bangalore</span>
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                Koramangala, Bangalore, Karnataka, India
              </span>
              <ChevronDown className="w-4 h-4 text-swiggy-orange" />
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-foreground"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <NavItem icon="🔍" label="Search" />
            <NavItem icon="💼" label="Swiggy Corporate" />
            <NavItem 
              label="Dineout" 
              isActive 
              customIcon={
                <div className="w-5 h-5 bg-swiggy-orange rounded-full flex items-center justify-center">
                  <span className="text-xs text-primary-foreground font-bold">D</span>
                </div>
              }
            />
            
            <NavItem icon="🛒" label="Cart" />
            
            {/* User Menu */}
            {true ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 cursor-pointer text-foreground"
                >
                  <div className="w-8 h-8 bg-swiggy-orange rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold text-sm">
                        Email
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-background rounded-lg shadow-lg border border-border py-2">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground truncate">Email</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="flex items-center gap-2 cursor-pointer text-foreground group"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium group-hover:text-swiggy-orange transition-colors">Sign In</span>
              </button>
            )}
          </nav>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-border py-4 space-y-4">
            {/* Mobile Location */}
            <div className="flex items-center gap-1 cursor-pointer md:hidden">
              <span className="text-sm font-semibold text-foreground border-b-2 border-foreground">Bangalore</span>
              <span className="text-sm text-muted-foreground truncate">
                Koramangala
              </span>
              <ChevronDown className="w-4 h-4 text-swiggy-orange" />
            </div>

            <div className="flex flex-wrap gap-4">
              <NavItem icon="🔍" label="Search" />
              <NavItem icon="💼" label="Corporate" />
              <NavItem 
                label="Dineout" 
                isActive 
                customIcon={
                  <div className="w-5 h-5 bg-swiggy-orange rounded-full flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-bold">D</span>
                  </div>
                }
              />
              <NavItem icon="🛒" label="Cart" />
            </div>

            {/* Mobile Auth */}
            <div className="pt-2 border-t border-border">
              {true ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-swiggy-orange rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold text-sm">
                        Email
                      </span>
                    </div>
                    <span className="text-sm text-foreground truncate max-w-[180px]">Email</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-2 text-foreground"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Sign In</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const NavItem = ({ 
  icon, 
  label, 
  isActive,
  customIcon 
}: { 
  icon?: string; 
  label: string; 
  isActive?: boolean;
  customIcon?: React.ReactNode;
}) => (
  <div className={`flex items-center gap-2 cursor-pointer group ${isActive ? 'text-swiggy-orange font-semibold' : 'text-foreground'}`}>
    {customIcon || <span className="text-lg">{icon}</span>}
    <span className="text-sm font-medium group-hover:text-swiggy-orange transition-colors">{label}</span>
  </div>
);

export default Header;
