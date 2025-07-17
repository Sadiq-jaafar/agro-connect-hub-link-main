
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserRound, Settings, Package, History, LogOut, Sun, Moon, Edit, Trash2, Save, Key } from "lucide-react";
import { supabase } from "@/integrations/supabase/client"; // adjust import as needed

const Profile = () => {
  const { currentUser, isAuthenticated, logout, updateUser, deleteAccount } = useUser();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get the tab from URL query parameter or default to "account"
  const tabFromURL = searchParams.get("tab");

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: ""
  });

  // State for password reset
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] = useState(false);
  const [email, setEmail] = useState("");

  // Redirect if not authenticated
  // (Removed auth check as requested)

  // Initialize edit form data when user data is available
  useEffect(() => {
    if (currentUser) {
      setEditFormData({
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role
      });
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your actual logic to get the user ID
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch profile from your 'profiles' table
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading profile...</div>;
  }
  if (!profile) {
    return <div>No profile found.</div>;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    updateUser({
      name: editFormData.name,
      email: editFormData.email,
      role: editFormData.role
    });
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    toast({
      title: "Account Deleted",
      description: "Your account has been successfully deleted.",
      variant: "destructive",
    });
    navigate("/");
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending a password reset email
    toast({
      title: "Password Reset Email Sent",
      description: `We've sent a password reset link to ${email}. Please check your inbox.`,
    });
    setIsPasswordResetDialogOpen(false);
  };

  // Get initials from name for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Determine active tab
  const activeTab = tabFromURL || "account";

  console.log("Current user in Profile:", currentUser);

  // Use profile.name, profile.email, etc. in your UI

  return (
    <div className={`container mx-auto py-8 px-4 ${theme === 'dark' ? 'text-white bg-gray-900' : ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <Card className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.profileImage} alt={profile.name} />
                  <AvatarFallback className={`text-xl ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-accent text-accent-foreground'}`}>
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{profile.name}</CardTitle>
              <CardDescription className={theme === 'dark' ? 'text-gray-300' : ''}>{profile.role}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>Email:</span>
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>Member since:</span>
                <span>{profile.joinDate}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button onClick={handleLogout} variant={theme === 'dark' ? 'secondary' : 'outline'} className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              <div className="flex items-center justify-between w-full pt-2">
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <Label htmlFor="theme-mode">Theme</Label>
                  <Moon className="h-4 w-4" />
                </div>
                <Switch
                  id="theme-mode"
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Profile Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue={activeTab} value={activeTab}>
            <TabsList className={`mb-4 ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : ''}`}>
              <TabsTrigger value="account" onClick={() => navigate("/profile?tab=account")}>
                <UserRound className="mr-2 h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="orders" onClick={() => navigate("/profile?tab=orders")}>
                <Package className="mr-2 h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="activity" onClick={() => navigate("/profile?tab=activity")}>
                <History className="mr-2 h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="settings" onClick={() => navigate("/profile?tab=settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="space-y-4">
              <Card className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-300' : ''}>View and update your account details</CardDescription>
                  </div>
                  <Button 
                    variant={theme === 'dark' ? 'secondary' : 'outline'} 
                    size="icon"
                    onClick={handleEditToggle}
                  >
                    {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={editFormData.name}
                          onChange={handleInputChange}
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={editFormData.email}
                          onChange={handleInputChange}
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          name="role"
                          value={editFormData.role}
                          onChange={handleInputChange}
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                        />
                      </div>
                      <Button onClick={handleSaveProfile} className={`w-full mt-4 ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : ''}`}>
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Personal Information</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : ''}`}>Manage your personal information to keep your account secure.</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Security</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : ''}`}>Manage your password and security preferences.</p>
                        
                        <Dialog open={isPasswordResetDialogOpen} onOpenChange={setIsPasswordResetDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant={theme === 'dark' ? 'secondary' : 'outline'} size="sm" className="mt-2">
                              <Key className="mr-2 h-4 w-4" />
                              Change Password
                            </Button>
                          </DialogTrigger>
                          <DialogContent className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}>
                            <DialogHeader>
                              <DialogTitle>Reset Password</DialogTitle>
                              <DialogDescription className={theme === 'dark' ? 'text-gray-300' : ''}>
                                Enter your email address to receive a password reset link.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handlePasswordReset}>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="reset-email">Email</Label>
                                  <Input 
                                    id="reset-email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit" className={theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : ''}>
                                  Send Reset Link
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription className={theme === 'dark' ? 'text-gray-300' : ''}>Manage your notifications and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">Email Notifications</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>Receive updates about your account activity and products.</p>
                      </div>
                      <Switch id="email-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">SMS Notifications</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>Get text messages for order updates and announcements.</p>
                      </div>
                      <Switch id="sms-notifications" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Your Orders</CardTitle>
                  <CardDescription className={theme === 'dark' ? 'text-gray-300' : ''}>View and manage your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}>No orders found.</p>
                    <Button className={`mt-4 ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-agro-green hover:bg-agro-green-dark'}`}>
                      Browse Products
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription className={theme === 'dark' ? 'text-gray-300' : ''}>View your recent account activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}>No recent activity.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription className={theme === 'dark' ? 'text-gray-300' : ''}>Manage your account settings and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">Theme Mode</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>Choose between light and dark mode.</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sun className="h-4 w-4" />
                        <Switch
                          checked={theme === "dark"}
                          onCheckedChange={toggleTheme}
                        />
                        <Moon className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">Language</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>Select your preferred language for the application.</p>
                      </div>
                      <Button variant={theme === 'dark' ? 'secondary' : 'outline'} size="sm">
                        English (US)
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">Time Zone</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>Set your local time zone for accurate times.</p>
                      </div>
                      <Button variant={theme === 'dark' ? 'secondary' : 'outline'} size="sm">
                        UTC (GMT+0)
                      </Button>
                    </div>
                    <div className="pt-4">
                      <h4 className="text-sm font-semibold text-red-500 mb-2">Danger Zone</h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : ''}`}>Permanently delete your account and all your data.</p>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="mt-2">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Account
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className={theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className={theme === 'dark' ? 'text-gray-300' : ''}>
                              This action cannot be undone. This will permanently delete your
                              account and remove your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className={theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : ''}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white">
                              Delete Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
