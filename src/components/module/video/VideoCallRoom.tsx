/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Video,
  Mic,
  PhoneOff,
  Settings,
  Users,
  MessageSquare,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface VideoCallRoomProps {
  videoCallId: string;
  appointmentId?: string;
}

const VideoCallRoom: React.FC<VideoCallRoomProps> = ({ videoCallId }) => {
  const router = useRouter();
  const { user } = useUser();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  console.log(localVideoRef, remoteVideoRef);

  // Role-based configuration
  const getRoleBasedConfig = (userRole: string) => {
    switch (userRole) {
      case "DOCTOR":
        return {
          waitingText: "Waiting for patient to join...",
          redirectPath: "/dashboard/doctor/appointments",
          remoteUserType: "patient",
          localUserType: "doctor",
        };
      case "PATIENT":
        return {
          waitingText: "Waiting for doctor to join...",
          redirectPath: "/dashboard/patient/appointments",
          remoteUserType: "doctor",
          localUserType: "patient",
        };
      default:
        return {
          waitingText: "Waiting for other participant to join...",
          redirectPath: "/dashboard",
          remoteUserType: "participant",
          localUserType: "you",
        };
    }
  };

  // Debug logging
  // useEffect(() => {
  //   console.log("VideoCallRoom mounted with:", {
  //     videoCallId,
  //     appointmentId,
  //     user: user ? { id: user.id, role: user.role, name: user.name } : null,
  //   });

  //   setDebugInfo({
  //     videoCallId,
  //     appointmentId,
  //     user: user ? { id: user.id, role: user.role, name: user.name } : null,
  //     timestamp: new Date().toISOString(),
  //   });
  // }, [videoCallId, appointmentId, user]);

  const handleJoinCall = async () => {
    console.log("Attempting to join call...");
    setIsConnecting(true);
    setConnectionError(null);

    try {
      // Simulate connection attempt
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For now, just show a success message
      toast.success("Connected to video call (Demo)");
      setIsConnecting(false);
    } catch (error: any) {
      console.error("Failed to join call:", error);
      setConnectionError(error.message || "Failed to connect to video call");
      toast.error("Failed to connect to video call");
      setIsConnecting(false);
    }
  };

  const handleEndCall = async () => {
    try {
      toast.success("Call ended");
      const config = getRoleBasedConfig(user?.role as string);
      router.push(config.redirectPath);
    } catch (error) {
      console.error("Error ending call:", error);
      const config = getRoleBasedConfig(user?.role as string);
      router.push(config.redirectPath);
    }
  };

  // Check if component is rendering

  if (!user) {
    console.log("No user found, showing login prompt");
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto" />
            <p className="text-muted-foreground">
              Please login to join the video call
            </p>
            <Button onClick={() => router.push("/auth/login")}>Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (connectionError) {
    console.log("Showing connection error:", connectionError);
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Connection Error
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <p className="text-muted-foreground text-sm">{connectionError}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleJoinCall} disabled={isConnecting}>
                {isConnecting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Retry Connection
              </Button>
              <Button variant="outline" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log("Rendering main video call interface");

  return (
    <div className="h-[600px] bg-gray-900 text-white relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-lg font-semibold">
                {user.role === "DOCTOR"
                  ? "Patient Consultation"
                  : "Doctor Consultation"}
              </h1>
              <p className="text-sm text-gray-300">
                {isConnecting ? "Connecting..." : `Call ID: ${videoCallId}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
              <Users className="h-4 w-4" />
              <span className="text-sm">1</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-600 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-sm">Demo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="h-full flex items-center justify-center">
        {isConnecting ? (
          <Card className="w-96 bg-white text-gray-900">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg font-medium">Connecting to video call...</p>
              <p className="text-sm text-muted-foreground mt-2">
                Please wait while we establish the connection
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="relative w-full h-full">
            {/* Remote Video Area (Doctor) */}
            <div className="w-full h-full bg-gray-800 relative">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="h-16 w-16 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium">
                    {getRoleBasedConfig(user.role).waitingText}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Video Call ID: {videoCallId}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    User: {user.name} ({user.role})
                  </p>
                </div>
              </div>
            </div>

            {/* Local Video (Patient) - Picture in Picture */}
            <div className="absolute top-20 right-4 w-48 h-36 bg-gray-700 rounded-lg border-2 border-white/20 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Video className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400">
                    {getRoleBasedConfig(user.role).localUserType === "you"
                      ? "You"
                      : `You (${getRoleBasedConfig(user.role).localUserType})`}
                  </p>
                </div>
              </div>
            </div>

            {/* Debug Info Panel */}
            {/* <div className="absolute top-20 left-4 bg-black/70 text-white p-4 rounded-lg text-xs max-w-xs">
              <h4 className="font-semibold mb-2">Debug Info:</h4>
              <pre className="whitespace-pre-wrap text-xs">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div> */}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center justify-center gap-4">
          {/* Audio Toggle */}
          <Button
            variant="default"
            size="lg"
            onClick={() => toast.info("Audio toggle (Demo)")}
            className="w-14 h-14 rounded-full"
          >
            <Mic className="h-6 w-6" />
          </Button>

          {/* Video Toggle */}
          <Button
            variant="default"
            size="lg"
            onClick={() => toast.info("Video toggle (Demo)")}
            className="w-14 h-14 rounded-full"
          >
            <Video className="h-6 w-6" />
          </Button>

          {/* Join/End Call */}
          {!isConnecting ? (
            <Button
              variant="default"
              size="lg"
              onClick={handleJoinCall}
              className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700"
            >
              <Video className="h-6 w-6" />
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="lg"
              onClick={handleEndCall}
              className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          )}

          {/* Settings */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => toast.info("Settings (Demo)")}
            className="w-14 h-14 rounded-full bg-white/20 border-white/30"
          >
            <Settings className="h-6 w-6" />
          </Button>

          {/* Chat */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => toast.info("Chat (Demo)")}
            className="w-14 h-14 rounded-full bg-white/20 border-white/30"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallRoom;
