// Agora.io configuration
export const agoraConfig = {
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID || "your-agora-app-id",
  // For production, you should generate token from your backend
  // For development, you can use null (less secure)
  token: null as string | null,
};

// Generate channel name from appointment/videoCallId
export const generateChannelName = (videoCallId: string): string => {
  // Use videoCallId as channel name
  // Channel name should be alphanumeric and under 64 characters
  return `video-call-${videoCallId.replace(/[^a-zA-Z0-9]/g, "")}`;
};

// Generate user ID from user data
export const generateUserId = (
  userId: string,
  role: "patient" | "doctor"
): number => {
  // Convert string ID to number for Agora
  // You can use a hash function or simple conversion
  const hash = userId.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  // Ensure positive number and add role prefix
  const baseId = Math.abs(hash);
  return role === "patient" ? baseId + 1000000 : baseId + 2000000;
};
