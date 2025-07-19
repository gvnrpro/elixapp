import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert } from "./ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAuth } from "./AuthContext";
import {
  LogIn,
  UserPlus,
  Zap,
  Shield,
  RefreshCw,
} from "lucide-react";
import {
  projectId,
  publicAnonKey,
} from "../utils/supabase/info";
import elixLogo from "figma:asset/11e609b1874b2a016ebd9df307f96ac57185e865.png";

export function LoginForm() {
  const { signIn, signUp, loading } = useAuth();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [demoLoading, setDemoLoading] = useState(false);

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    name: "",
    role: "site_manager",
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { error } = await signIn(
      signInData.email,
      signInData.password,
    );

    if (error) {
      setError(error);
    } else {
      setSuccess("Successfully signed in!");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { error } = await signUp(
      signUpData.email,
      signUpData.password,
      signUpData.name,
      signUpData.role,
    );

    if (error) {
      setError(error);
    } else {
      setSuccess("Account created and signed in successfully!");
    }
  };

  const loadDemoCredentials = async () => {
    setDemoLoading(true);
    setError("");
    setSuccess("");

    try {
      // First, try to create the demo user
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7a1baec9/create-demo-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Demo user ready!");
        setSignInData({
          email: "demo@elix.com",
          password: "demo123",
        });
      } else {
        // If demo user already exists, that's fine too
        if (
          data.message &&
          data.message.includes("already exists")
        ) {
          setSuccess("Demo user is ready!");
          setSignInData({
            email: "demo@elix.com",
            password: "demo123",
          });
        } else {
          setError(data.error || "Failed to prepare demo user");
        }
      }
    } catch (error) {
      console.error("Error creating demo user:", error);
      // Still load the credentials even if the API call fails
      setSignInData({
        email: "demo@elix.com",
        password: "demo123",
      });
      setError(
        "Demo credentials loaded, but please try creating an account if sign in fails",
      );
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Spatial Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_rgba(64,224,208,0.1)_60deg,_transparent_120deg)]"></div>
      </div>

      {/* Login Interface */}
      <div className="relative z-10 h-full flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Spatial Logo */}
          <div className="text-center mb-12 animate-illuminate">
            <div className="glass-puck w-24 h-24 flex items-center justify-center mx-auto mb-6 elix-glow-strong">
              <img
                src={elixLogo}
                alt="Elix"
                className="w-16 h-16 object-contain"
              />
            </div>
            <h1 className="sf-large-title illuminated-text mb-2">
              Elix
            </h1>
            <p className="sf-body text-white/70">
              Intelligent Asset Platform
            </p>
            <p className="sf-caption-1 text-white/50 mt-2">
              Spatial Command Center
            </p>
          </div>

          {/* Main Auth Panel */}
          <div className="glass-canvas p-8 floating-layer-2">
            <Tabs defaultValue="signin" className="w-full">
              {/* Tab Navigation */}
              <div className="glass-pill p-1 mb-8">
                <TabsList className="grid w-full grid-cols-2 bg-transparent border-0 gap-1">
                  <TabsTrigger
                    value="signin"
                    className="glass-pill data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-400 data-[state=active]:to-cyan-400 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 hover:text-white/90 transition-all duration-300"
                  >
                    <LogIn size={16} className="mr-2" />
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="glass-pill data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-400 data-[state=active]:to-cyan-400 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 hover:text-white/90 transition-all duration-300"
                  >
                    <UserPlus size={16} className="mr-2" />
                    Sign Up
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="glass-pill p-4 mb-6 border border-red-400/30 bg-red-500/10">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <p className="sf-callout text-red-400">
                      {error}
                    </p>
                  </div>
                </div>
              )}
              {success && (
                <div className="glass-pill p-4 mb-6 border border-green-400/30 bg-green-500/10">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <p className="sf-callout text-green-400">
                      {success}
                    </p>
                  </div>
                </div>
              )}

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-6">
                <form
                  onSubmit={handleSignIn}
                  className="space-y-6"
                >
                  <div>
                    <Label
                      htmlFor="signin-email"
                      className="sf-callout text-white/80 mb-2 block"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={signInData.email}
                      onChange={(e) =>
                        setSignInData({
                          ...signInData,
                          email: e.target.value,
                        })
                      }
                      placeholder="operations@company.com"
                      required
                      className="glass-pill border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-teal-400 focus:ring-teal-400 focus:ring-2 focus:ring-offset-0 h-12"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="signin-password"
                      className="sf-callout text-white/80 mb-2 block"
                    >
                      Password
                    </Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signInData.password}
                      onChange={(e) =>
                        setSignInData({
                          ...signInData,
                          password: e.target.value,
                        })
                      }
                      placeholder="Enter your password"
                      required
                      className="glass-pill border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-teal-400 focus:ring-teal-400 focus:ring-2 focus:ring-offset-0 h-12"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 glass-pill bg-gradient-to-r from-teal-400 to-cyan-400 text-white hover:from-teal-500 hover:to-cyan-500 border-0 elix-glow interactive-element"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <LogIn size={18} className="mr-2" />
                        Access Command Center
                      </>
                    )}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="glass-puck p-6 mt-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Zap size={16} className="text-teal-400" />
                    <h4 className="sf-callout text-white font-medium">
                      Demo Access
                    </h4>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="sf-caption-1 text-white/60">
                      Email: demo@elix.com
                    </p>
                    <p className="sf-caption-1 text-white/60">
                      Password: demo123
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full glass-pill border-teal-400/30 text-teal-400 hover:bg-teal-400/10 hover:border-teal-400/50"
                    onClick={loadDemoCredentials}
                    disabled={demoLoading}
                  >
                    {demoLoading ? (
                      <>
                        <RefreshCw
                          size={14}
                          className="mr-2 animate-spin"
                        />
                        Preparing Demo...
                      </>
                    ) : (
                      <>
                        <Shield size={14} className="mr-2" />
                        Load Demo Credentials
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-6">
                <form
                  onSubmit={handleSignUp}
                  className="space-y-6"
                >
                  <div>
                    <Label
                      htmlFor="signup-name"
                      className="sf-callout text-white/80 mb-2 block"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signUpData.name}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Ahmed Al-Mansouri"
                      required
                      className="glass-pill border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-teal-400 focus:ring-teal-400 focus:ring-2 focus:ring-offset-0 h-12"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="signup-email"
                      className="sf-callout text-white/80 mb-2 block"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signUpData.email}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          email: e.target.value,
                        })
                      }
                      placeholder="ahmed@company.com"
                      required
                      className="glass-pill border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-teal-400 focus:ring-teal-400 focus:ring-2 focus:ring-offset-0 h-12"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="signup-password"
                      className="sf-callout text-white/80 mb-2 block"
                    >
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signUpData.password}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          password: e.target.value,
                        })
                      }
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
                      className="glass-pill border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-teal-400 focus:ring-teal-400 focus:ring-2 focus:ring-offset-0 h-12"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="signup-role"
                      className="sf-callout text-white/80 mb-2 block"
                    >
                      Role
                    </Label>
                    <Select
                      value={signUpData.role}
                      onValueChange={(value) =>
                        setSignUpData({
                          ...signUpData,
                          role: value,
                        })
                      }
                    >
                      <SelectTrigger className="glass-pill border-white/20 bg-white/5 text-white h-12">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent className="glass-puck border-white/20 bg-black/90 text-white">
                        <SelectItem
                          value="operations_director"
                          className="hover:bg-white/10"
                        >
                          Operations Director
                        </SelectItem>
                        <SelectItem
                          value="site_manager"
                          className="hover:bg-white/10"
                        >
                          Site Manager
                        </SelectItem>
                        <SelectItem
                          value="technician"
                          className="hover:bg-white/10"
                        >
                          Technician
                        </SelectItem>
                        <SelectItem
                          value="admin"
                          className="hover:bg-white/10"
                        >
                          Administrator
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 glass-pill bg-gradient-to-r from-teal-400 to-cyan-400 text-white hover:from-teal-500 hover:to-cyan-500 border-0 elix-glow interactive-element"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} className="mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="sf-caption-1 text-white/50">
              Powered by spatial intelligence and predictive
              analytics
            </p>
            {/* Debug Info */}
            <div className="mt-4 glass-pill p-3">
              <p className="sf-caption-2 text-white/40 mb-1">
                Debug Info:
              </p>
              <p className="sf-caption-2 text-white/40">
                Project: {projectId}
              </p>
              <p className="sf-caption-2 text-white/40">
                Status: {loading ? "Loading..." : "Ready"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}