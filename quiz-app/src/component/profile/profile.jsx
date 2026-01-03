import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("User not logged in");
        return;
      }

      setProfile({
        name: user.user_metadata?.full_name || "Not set",
        email: user.email,
        accout_creation:user.created_at
      });

      setLoading(false);
    };

    fetchProfile();
  }, []);

  

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Your Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={profile.name} disabled />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile.email} disabled />
          </div>

          <div className="space-y-2">
            <Label>Accout Creation Date</Label>
            <Input value={new Date(profile.accout_creation).toDateString()} disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
