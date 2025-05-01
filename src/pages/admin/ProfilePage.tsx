
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { getAdminProfile } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Calendar } from "lucide-react";

const ProfilePage = () => {
  const [profile, setProfile] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
  });

  const navigate = useNavigate();
  const { admin, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log("Admin in ProfilePage:", admin);
    const fetchProfile = async () => {
      try {
        // Set profile directly from admin context to avoid additional API call
        if (admin) {
          setProfile(admin);
          setFormData({
            username: admin.username || "",
            email: admin.email || "",
            role: admin.role || "",
          });
        } else {
          // If admin is null, redirect to login
          navigate("/admin/login");
          return;
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAuthenticated) {
      navigate("/admin/login");
    } else {
      fetchProfile();
    }
  }, [admin, isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // Implementation for profile update can be added here
    e.preventDefault();
    toast.info("Profile update functionality will be implemented soon");
    setIsEditing(false);
  };

  if (isLoading || !admin) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and profile information
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate("/admin/change-password")}
          >
            Change Password
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card md:col-span-1">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-muted-foreground">
                  {profile.username || "Not provided"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{profile.email || "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Admin role</p>
                <p className="text-sm text-muted-foreground">
                  {profile.role || "Not provided"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Joined</p>
                <p className="text-sm text-muted-foreground">
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : "Not available"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card md:col-span-2">
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Profile" : "Profile Details"}
            </CardTitle>
            <CardDescription>
              {isEditing
                ? "Update your profile information"
                : "View your detailed profile information"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Saving Changes..." : "Save Changes"}
                </Button>
              </form>
            ) : (
              <div className="prose max-w-none dark:prose-invert">
                <p>
                  Hello, {profile.username || "Admin"}. You are
                  logged in as an administrator with access to manage the entire
                  platform. Your account was created on{" "}
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : "N/A"}
                  .
                </p>
                <p>
                  From your dashboard, you can manage users, products, orders,
                  tickets, and all other aspects of the platform. Please ensure
                  you follow security best practices when making changes.
                </p>
                <p>
                  If you need to update your password for security reasons, you
                  can use the
                  <Link
                    to="/admin/change-password"
                    className="text-primary hover:underline"
                  >
                    {" "}
                    Change Password{" "}
                  </Link>
                  option.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
