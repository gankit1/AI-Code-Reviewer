"use client";

import { useState } from "react";
import { Github } from "@/components/icons";
import {
  User,
  Bell,
  Shield,
  Palette,
  Key,
  Mail,
  Smartphone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [slackNotifs, setSlackNotifs] = useState(false);
  const [autoReview, setAutoReview] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Github className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user?.email || ""} disabled />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{user?.plan || "free"} plan</Badge>
                <Badge variant="outline">{user?.role || "developer"}</Badge>
              </div>
              <Button className="animated-gradient text-white border-0">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive review results via email</p>
                  </div>
                </div>
                <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Slack Notifications</p>
                    <p className="text-xs text-muted-foreground">Post review summaries to Slack</p>
                  </div>
                </div>
                <Switch checked={slackNotifs} onCheckedChange={setSlackNotifs} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                    <Palette className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Auto-Review on PR</p>
                    <p className="text-xs text-muted-foreground">Automatically review new pull requests</p>
                  </div>
                </div>
                <Switch checked={autoReview} onCheckedChange={setAutoReview} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>GitHub Integration</CardTitle>
              <CardDescription>Manage your GitHub connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-accent/30">
                <div className="flex items-center gap-3">
                  <Github className="h-8 w-8" />
                  <div>
                    <p className="font-medium text-sm">GitHub</p>
                    <p className="text-xs text-muted-foreground">
                      Connected as <span className="text-foreground font-medium">@{user?.githubUsername || "username"}</span>
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Connected</Badge>
              </div>
              <Button variant="outline" size="sm" className="text-destructive">
                Disconnect GitHub
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button variant="outline">
                <Key className="mr-2 h-4 w-4" />
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
