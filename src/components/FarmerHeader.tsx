
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
import { User, Menu, X, LogOut, Settings, UserRound, Tractor } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

const FarmerHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { theme } = useTheme();
  const { toast } = useToast();
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
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <nav className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-green-800 text-white'} shadow-md py-4 sticky top-0 z-50`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/farmer-dashboard" className="flex items-center space-x-2">
          <Tractor className="w-6 h-6 text-yellow-400" />
          <span className="text-yellow-400 font-bold text-2xl">FarmConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/farmer-dashboard" className="text-gray-200 hover:text-yellow-400 font-medium">Dashboard</Link>
          <Link to="/sales" className="text-gray-200 hover:text-yellow-400 font-medium">Sales</Link>
          <Link to="/" className="text-gray-200 hover:text-yellow-400 font-medium">Marketplace</Link>
          
          <div className="flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-green-600 text-white">
                        {profile?.full_name?.substring(0, 2).toUpperCase() || 'F'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : ''}>
                  <DropdownMenuLabel>Farmer Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className={theme === 'dark' ? 'bg-gray-700' : ''} />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center">
                      <UserRound className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile?tab=settings" className="cursor-pointer flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
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
            ) : null}
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
        <div className="md:hidden bg-green-700 py-4 px-4 shadow-inner animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link to="/farmer-dashboard" className="text-gray-200 hover:text-yellow-400 font-medium py-2" onClick={toggleMenu}>Dashboard</Link>
            <Link to="/sales" className="text-gray-200 hover:text-yellow-400 font-medium py-2" onClick={toggleMenu}>Sales</Link>
            <Link to="/" className="text-gray-200 hover:text-yellow-400 font-medium py-2" onClick={toggleMenu}>Marketplace</Link>
            
            <div className="flex flex-col space-y-2 pt-2">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-600 text-white">
                        {profile?.full_name?.substring(0, 2).toUpperCase() || 'F'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{profile?.full_name || profile?.email}</span>
                  </div>
                  <Link 
                    to="/profile" 
                    className="text-gray-200 hover:text-yellow-400 font-medium py-2 pl-2" 
                    onClick={toggleMenu}
                  >
                    <span className="flex items-center">
                      <UserRound className="mr-2 h-4 w-4" />
                      Profile
                    </span>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full mt-2 border-red-400 text-red-400" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default FarmerHeader;
