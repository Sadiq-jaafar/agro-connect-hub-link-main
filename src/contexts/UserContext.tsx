
import { createContext, useState, useContext, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

// Define the user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  profileImage?: string;
}

// Define the context type
interface UserContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  deleteAccount: () => void;
  resetPassword: (email: string) => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Sample user data (in a real app, this would come from a backend)
const generateUser = (name: string, email: string): User => ({
  id: `user-${Math.random().toString(36).substring(2, 9)}`,
  name,
  email,
  role: "Farmer", // Default role
  joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
  profileImage: `https://i.pravatar.cc/150?u=${email}`
});

// Create the provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isAuthenticated = currentUser !== null;
  const { toast } = useToast();

  const login = (email: string, password: string) => {
    // In a real app, this would validate credentials with a backend
    console.log("Logging in with:", email, password);
    
    // If user doesn't exist yet (simulating first login)
    // This is a simplified example - in a real app, you'd check if the user exists first
    const userName = email.split('@')[0]; // Extract name from email as fallback
    const user = generateUser(userName, email);
    setCurrentUser(user);
    
    toast({
      title: "Logged in successfully",
      description: `Welcome back, ${userName}!`
    });
  };

  const signup = (name: string, email: string, password: string) => {
    // In a real app, this would register the user with a backend
    console.log("Signing up:", name, email, password);
    const user = generateUser(name, email);
    setCurrentUser(user);
    
    toast({
      title: "Account created successfully",
      description: `Welcome to AgroConnect, ${name}!`
    });
  };

  const updateUser = (userData: Partial<User>) => {
    // In a real app, this would update the user data in the backend
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...userData });
    }
  };

  const deleteAccount = () => {
    // In a real app, this would delete the user account from the backend
    setCurrentUser(null);
  };

  const resetPassword = (email: string) => {
    // In a real app, this would send a password reset email
    console.log("Password reset requested for:", email);
    
    // Simulate sending a password reset email
    toast({
      title: "Password Reset Email Sent",
      description: `We've sent a password reset link to ${email}. Please check your inbox.`,
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      login, 
      signup, 
      logout,
      updateUser,
      deleteAccount,
      resetPassword
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
