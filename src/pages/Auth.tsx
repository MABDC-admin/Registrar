import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import owlMascot from "@/assets/owl-mascot.png";
import foxMascot from "@/assets/fox-mascot.png";
import schoolBackground from "@/assets/school-background.png";

type AuthMode = "login" | "signup";
type UserRole = "admin" | "teacher" | "student" | "parent";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<UserRole>("admin");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role: userRole, signUp, signIn } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user && userRole) {
      redirectBasedOnRole(userRole);
    }
  }, [user, userRole]);

  const redirectBasedOnRole = (role: UserRole) => {
    switch (role) {
      case "student":
        navigate("/student-portal");
        break;
      case "parent":
        navigate("/parent-portal");
        break;
      default:
        navigate("/");
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await signUp(email, password, firstName, lastName, role);
        
        if (error) {
          // Handle specific error cases
          if (error.message.includes("already registered")) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign up failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Account created!",
            description: "Welcome to Smart School Hub!",
          });
          // The auth state change will handle redirect
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          toast({
            title: "Sign in failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "Redirecting to dashboard...",
          });
          // The auth state change will handle redirect
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${schoolBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card rounded-3xl shadow-elevated p-8 relative overflow-hidden">
          {/* Mascots */}
          <img 
            src={owlMascot} 
            alt="Owl" 
            className="absolute -top-4 -left-4 w-20 h-20 object-contain animate-bounce-soft"
          />
          <img 
            src={foxMascot} 
            alt="Fox" 
            className="absolute -bottom-2 -right-2 w-16 h-16 object-contain animate-float"
          />

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Smart School Hub
            </h1>
            <p className="text-muted-foreground">
              {mode === "login" ? "Welcome back!" : "Create your account"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                    className="rounded-xl"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder="you@example.com"
                required
                className={`rounded-xl ${errors.email ? "border-destructive" : ""}`}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                placeholder="••••••••"
                required
                className={`rounded-xl ${errors.password ? "border-destructive" : ""}`}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label>I am a...</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["admin", "teacher", "student", "parent"] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`p-3 rounded-xl border-2 transition-all text-sm font-medium capitalize ${
                        role === r
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl h-12 text-base font-semibold"
              disabled={loading}
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setErrors({});
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
