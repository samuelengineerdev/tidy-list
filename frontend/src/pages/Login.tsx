import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import tidyListLogo from "@/assets/tidy-list-logo.png";
import Logo from "@/components/Logo";
import { Toast } from "@/components/Toast";
import { useTheme } from "@/contexts/ThemeContext";
import { authService } from "@/services/authService";
import { Eye, EyeClosed, EyeClosedIcon, EyeOff, LucideEye, LucideEyeOff } from "lucide-react";

const defaultUserEmail = (import.meta as any).env?.VITE_DEFAULT_USER_EMAIL || "";
const defaultUserpassword = (import.meta as any).env?.VITE_DEFAULT_USER_PASSWORD || "";
const isDefaultUser = defaultUserEmail && defaultUserpassword;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(isDefaultUser ? defaultUserEmail : "");
  const [password, setPassword] = useState(isDefaultUser ? defaultUserpassword : "");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loadTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.login({ email, password });
      loadTheme();
      Toast.success("Welcome back!");
      navigate("/tasks");
    } catch (error) {
      // Toast.error(error instanceof Error ? error.message : "Login error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link to="/">
            {/* <img src={tidyListLogo} alt="Tidy List" className="h-10 mx-auto mb-6" /> */}
            <Logo />
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Enter your email and password to access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  icon={showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  onIconClick={() => setShowPassword(prev => !prev)}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <Link
                to="/register"
                className="text-primary hover:underline font-medium"
              >
                Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
