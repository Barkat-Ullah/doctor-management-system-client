"use client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  PhoneIcon,
  MailIcon,
  PencilIcon,
  UserIcon,
  ShieldIcon,
} from "lucide-react";
import { formatDate } from "@/lib/formDate";

export type Profile = {
  id: string | number;
  name: string;
  profilePhoto?: string | null;
  role: string;
  status: string;
  email: string;
  contactNumber: string;
  createdAt?: string;
  updatedAt?: string;
  needPasswordChange?: boolean;
};

export default function AdminProfilePage({ profile }: { profile: Profile }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/admin/profile/${profile?.id}`);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-green-500 to-emerald-600"></div>
            <div className="flex justify-center -mt-16">
              <Avatar className="h-32 w-32 border-4 border-white">
                <AvatarImage
                  src={
                    profile?.profilePhoto ||
                    "https://i.ibb.co/WpH6qBCM/images-8.jpg"
                  }
                  alt={profile?.name || "image"}
                />
                <AvatarFallback className="text-3xl bg-emerald-100 text-emerald-600">
                  {profile?.name}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardContent className="text-center pt-4">
              <h2 className="text-2xl font-bold">{profile?.name}</h2>
              <div className="flex justify-center mt-2">
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {profile?.role}
                </Badge>
                <Badge
                  variant="outline"
                  className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  {profile?.status}
                </Badge>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <MailIcon className="h-4 w-4" />
                  <span>{profile?.email}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <PhoneIcon className="h-4 w-4" />
                  <span>{profile?.contactNumber}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    Joined {profile?.createdAt && formatDate(profile.createdAt)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button
                onClick={handleEdit}
                className="bg-green-600 hover:bg-green-700"
              >
                <PencilIcon className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldIcon className="mr-2 h-5 w-5 text-green-600" />
                Admin Information
              </CardTitle>
              <CardDescription>
                Detailed information about your admin account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </p>
                  <p className="font-semibold">{profile?.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Email Address
                  </p>
                  <p className="font-semibold">{profile?.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Contact Number
                  </p>
                  <p className="font-semibold">{profile?.contactNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Role
                  </p>
                  <p className="font-semibold">{profile?.role}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Account Status
                  </p>
                  <p className="font-semibold">{profile?.status}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Password Status
                  </p>
                  <p className="font-semibold">
                    {profile?.needPasswordChange
                      ? "Needs Update"
                      : "Up to Date"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Created At
                  </p>
                  <p className="font-semibold">
                    {profile?.createdAt && formatDate(profile.createdAt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </p>
                  <p className="font-semibold">
                    {profile?.updatedAt && formatDate(profile.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => console.log("Password change clicked")}
              >
                Change Password
              </Button>
              <Button
                onClick={handleEdit}
                className="bg-green-600 hover:bg-green-700"
              >
                Update Profile
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserIcon className="mr-2 h-5 w-5 text-green-600" />
                Account Activity
              </CardTitle>
              <CardDescription>
                Recent activity and account statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-green-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">24</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Active Sessions
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-emerald-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-emerald-600">156</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Total Logins
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-teal-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-teal-600">7</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Days Active
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
