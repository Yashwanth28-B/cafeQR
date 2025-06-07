/*import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { authApi } from "../../services/api";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import { Coffee } from "lucide-react";
// Update the import path if the file is named differently or located elsewhere
// Example: import { useToast } from "../../hooks/useToast";
import { useToast } from "../../hooks/useToast";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.login(formData);
      const { user, token } = response.data;

      login(user, token);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      });
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Coffee className="h-12 w-12 text-amber-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">QR Café</h1>
              <p className="text-gray-600">Admin Panel</p>
            </div>
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={!formData.email || !formData.password}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/admin/register"
              className="text-sm text-amber-600 hover:text-amber-700"
            >
              Don't have an account? Register here
            </Link>
          </div>

          <div className="mt-4 p-3 bg-amber-50 rounded-md">
            <p className="text-xs text-amber-700">
              <strong>Demo Credentials:</strong>
              <br />
              Admin: admin@qrcafe.com / admin123
              <br />
              Staff: staff@qrcafe.com / staff123
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
*/
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock login - replace with actual authentication
    if (formData.email && formData.password) {
      toast({
        title: "Success",
        description: "Login successful",
      });
      // Redirect to dashboard
      window.location.href = "/admin/dashboard";
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <div className="text-center">
              <a
                href="/admin/register"
                className="text-sm text-blue-600 hover:underline"
              >
                Don't have an account? Register here
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
