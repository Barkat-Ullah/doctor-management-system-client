/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import AgoraRTC, {
  type IAgoraRTCClient,
  type ICameraVideoTrack,
  type IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { agoraConfig } from "@/lib/agura-config";

export interface UseAgoraClientProps {
  channelName: string;
  userId: number;
  onUserJoined?: (userId: number) => void;
  onUserLeft?: (userId: number) => void;
}

export const useAgoraClient = ({
  channelName,
  userId,
  onUserJoined,
  onUserLeft,
}: UseAgoraClientProps) => {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] =
    useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Initialize Agora client
  useEffect(() => {
    const agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    setClient(agoraClient);

    // Event listeners
    agoraClient.on("user-published", async (user, mediaType) => {
      await agoraClient.subscribe(user, mediaType);

      if (mediaType === "video") {
        setRemoteUsers((prev) => {
          const existingUser = prev.find((u) => u.uid === user.uid);
          if (existingUser) {
            return prev.map((u) =>
              u.uid === user.uid ? { ...u, videoTrack: user.videoTrack } : u
            );
          }
          return [
            ...prev,
            {
              uid: user.uid,
              videoTrack: user.videoTrack,
              audioTrack: user.audioTrack,
            },
          ];
        });
      }

      if (mediaType === "audio") {
        setRemoteUsers((prev) => {
          const existingUser = prev.find((u) => u.uid === user.uid);
          if (existingUser) {
            return prev.map((u) =>
              u.uid === user.uid ? { ...u, audioTrack: user.audioTrack } : u
            );
          }
          return [
            ...prev,
            {
              uid: user.uid,
              videoTrack: user.videoTrack,
              audioTrack: user.audioTrack,
            },
          ];
        });
        user.audioTrack?.play();
      }
    });

    agoraClient.on("user-unpublished", (user) => {
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    });

    agoraClient.on("user-joined", (user) => {
      onUserJoined?.(user.uid as number);
    });

    agoraClient.on("user-left", (user) => {
      onUserLeft?.(user.uid as number);
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    });

    return () => {
      agoraClient.removeAllListeners();
    };
  }, [onUserJoined, onUserLeft]);

  // Join channel
  const joinChannel = useCallback(async () => {
    if (!client) return;

    try {
      // Join the channel
      await client.join(
        agoraConfig.appId,
        channelName,
        agoraConfig.token,
        userId
      );

      // Create and publish local tracks
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

      setLocalVideoTrack(videoTrack);
      setLocalAudioTrack(audioTrack);

      // Publish tracks
      await client.publish([videoTrack, audioTrack]);

      setIsJoined(true);
      console.log("Successfully joined channel:", channelName);
    } catch (error) {
      console.error("Failed to join channel:", error);
      throw error;
    }
  }, [client, channelName, userId]);

  // Leave channel
  const leaveChannel = useCallback(async () => {
    if (!client || !isJoined) return;

    try {
      // Stop and close local tracks
      localVideoTrack?.stop();
      localVideoTrack?.close();
      localAudioTrack?.stop();
      localAudioTrack?.close();

      // Leave the channel
      await client.leave();

      setLocalVideoTrack(null);
      setLocalAudioTrack(null);
      setRemoteUsers([]);
      setIsJoined(false);

      console.log("Successfully left channel");
    } catch (error) {
      console.error("Failed to leave channel:", error);
    }
  }, [client, isJoined, localVideoTrack, localAudioTrack]);

  // Toggle video
  const toggleVideo = useCallback(async () => {
    if (!localVideoTrack) return;

    if (isVideoEnabled) {
      await localVideoTrack.setEnabled(false);
    } else {
      await localVideoTrack.setEnabled(true);
    }

    setIsVideoEnabled(!isVideoEnabled);
  }, [localVideoTrack, isVideoEnabled]);

  // Toggle audio
  const toggleAudio = useCallback(async () => {
    if (!localAudioTrack) return;

    if (isAudioEnabled) {
      await localAudioTrack.setEnabled(false);
    } else {
      await localAudioTrack.setEnabled(true);
    }

    setIsAudioEnabled(!isAudioEnabled);
  }, [localAudioTrack, isAudioEnabled]);

  return {
    client,
    localVideoTrack,
    localAudioTrack,
    remoteUsers,
    isJoined,
    isVideoEnabled,
    isAudioEnabled,
    joinChannel,
    leaveChannel,
    toggleVideo,
    toggleAudio,
  };
};
