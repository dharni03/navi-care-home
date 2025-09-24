import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Stethoscope, User, Building2, ArrowLeft } from "lucide-react";
import { z } from "zod";

interface Location {
  id: string;
  name: string;
  type: string;
  state: string;
}

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
});

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userType, setUserType] = useState<'patient' | 'hospital'>('patient');
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
    phone: '',
    locationId: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    try {
      authSchema.parse(formData);
      if (isSignUp && !formData.locationId) {
        throw new Error("Please select a location");
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          description: error.issues[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          description: error instanceof Error ? error.message : "Validation failed",
        });
      }
      return false;
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: formData.username,
            full_name: formData.fullName,
            phone: formData.phone,
            user_type: userType,
            location_id: formData.locationId,
          }
        }
      });

      if (error) throw error;

      toast({
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message || "An error occurred during sign up",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!formData.email || !formData.password) {
      toast({
        variant: "destructive",
        description: "Please enter email and password",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message || "An error occurred during sign in",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Stethoscope className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Rural Health Navigator</h1>
          <p className="text-muted-foreground mt-2">Healthcare Access for Rural Communities</p>
        </div>

        <Card className="shadow-xl border-2 border-primary/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription>
              {isSignUp 
                ? 'Sign up to access healthcare services' 
                : 'Sign in to your account'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {isSignUp && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={userType === 'patient' ? 'default' : 'outline'}
                    onClick={() => setUserType('patient')}
                    className="flex items-center gap-2 h-12"
                  >
                    <User className="h-4 w-4" />
                    Patient
                  </Button>
                  <Button
                    type="button"
                    variant={userType === 'hospital' ? 'default' : 'outline'}
                    onClick={() => setUserType('hospital')}
                    className="flex items-center gap-2 h-12"
                  >
                    <Building2 className="h-4 w-4" />
                    Hospital
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={formData.locationId} onValueChange={(value) => handleInputChange('locationId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}, {location.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <Button
              onClick={isSignUp ? handleSignUp : handleSignIn}
              disabled={loading}
              className="w-full h-12 text-lg font-semibold"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;