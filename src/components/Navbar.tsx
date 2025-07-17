
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, Menu, X, LogOut, Settings, UserRound, ShoppingCart, Wheat } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { theme } = useTheme();
  const { toast } = useToast();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account."
    });
    navigate("/auth");
    setIsMenuOpen(false);
  };

  return (
    <nav className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'} shadow-md py-4 sticky top-0 z-50`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Wheat className={`w-8 h-8 ${theme === 'dark' ? 'text-green-400' : 'text-agro-green-dark'}`} />
          <span className={`${theme === 'dark' ? 'text-green-400' : 'text-agro-green-dark'} font-bold text-2xl`}>AggroMarket</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`${theme === 'dark' ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-agro-green'} font-medium`}>Home</Link>
          <Link to="/products" className={`${theme === 'dark' ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-agro-green'} font-medium`}>Products</Link>
          <Link to="/services" className={`${theme === 'dark' ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-agro-green'} font-medium`}>Services</Link>
          {user && profile?.user_type === 'farmer' && (
            <Link to="/farmer-dashboard" className={`${theme === 'dark' ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-agro-green'} font-medium`}>Farmer Dashboard</Link>
          )}
          {user && (
            <Link to="/purchases" className={`${theme === 'dark' ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-agro-green'} font-medium`}>Purchases</Link>
          )}
          <Link to="/contact" className={`${theme === 'dark' ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-agro-green'} font-medium`}>Contact</Link>
          
          {/* Cart Icon with Badge */}
          <Link to="/cart" className="relative">
            <ShoppingCart className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-agro-green'}`} />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Link>
          
          <div className="flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback className={theme === 'dark' ? 'bg-gray-700 text-gray-100' : ''}>
                        {profile?.full_name?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : ''}>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className={theme === 'dark' ? 'bg-gray-700' : ''} />
                  {/* <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center">
                      <UserRound className="mr-2 h-4 w-4" />
                      <span>Account</span>
                    </Link>
                  </DropdownMenuItem> */}
                 
                  <DropdownMenuSeparator className={theme === 'dark' ? 'bg-gray-700' : ''} />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="cursor-pointer text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button className={theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-agro-green hover:bg-agro-green-dark'} asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={`md:hidden ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white'} py-4 px-4 shadow-inner animate-fade-in`}>
          <div className="flex flex-col space-y-4">
            <Link to="/" className={`${theme === 'dark' ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-agro-green'} font-medium py-2`} onClick={toggleMenu}>Home</Link>
            <Link to="/products" className={`${theme === 'dark' ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-agro-green'} font-medium py-2`} onClick={toggleMenu}>Products</Link>
            <Link to="/services" className={`${theme === 'dark' ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-agro-green'} font-medium py-2`} onClick={toggleMenu}>Services</Link>
            {user && profile?.user_type === 'farmer' && (
              <Link to="/farmer-dashboard" className={`${theme === 'dark' ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-agro-green'} font-medium py-2`} onClick={toggleMenu}>Farmer Dashboard</Link>
            )}
            {user && (
              <Link to="/purchases" className={`${theme === 'dark' ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-agro-green'} font-medium py-2`} onClick={toggleMenu}>Purchases</Link>
            )}
            <Link to="/cart" className={`${theme === 'dark' ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-agro-green'} font-medium py-2 flex items-center`} onClick={toggleMenu}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart {getTotalItems() > 0 && `(${getTotalItems()})`}
            </Link>
            <Link to="/contact" className={`${theme === 'dark' ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-agro-green'} font-medium py-2`} onClick={toggleMenu}>Contact</Link>
            
            <div className="flex flex-col space-y-2 pt-2">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={theme === 'dark' ? 'bg-gray-700 text-gray-100' : ''}>
                        {profile?.full_name?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{profile?.full_name}</span>
                  </div>
                  <Link 
                    to="/profile" 
                    className={`${theme === 'dark' ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-agro-green'} font-medium py-2 pl-2`} 
                    onClick={toggleMenu}
                  >
                    <span className="flex items-center">
                      <UserRound className="mr-2 h-4 w-4" />
                      Account
                    </span>
                  </Link>
                  <Link 
                    to="/profile?tab=settings" 
                    className={`${theme === 'dark' ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-agro-green'} font-medium py-2 pl-2`} 
                    onClick={toggleMenu}
                  >
                    <span className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </span>
                  </Link>
                  <Button 
                    variant="outline" 
                    className={`w-full mt-2 ${theme === 'dark' ? 'text-red-400 border-red-400' : 'text-red-500 border-red-200'}`} 
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button className={`w-full ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-agro-green hover:bg-agro-green-dark'}`} asChild>
                  <Link to="/auth" onClick={toggleMenu}>Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
