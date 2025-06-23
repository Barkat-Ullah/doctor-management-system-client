import VideoCallRoom from "@/components/module/video/VideoCallRoom";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Params = Promise<{ videocallId: string }>;

const VideoCallPage = async ({ params }: { params: Params }) => {
  const { videocallId } = await params;

  console.log("VideoCallPage rendering with videoCallId:", videocallId);

  if (!videocallId) {
    console.log("No videoCallId provided, returning 404");
    notFound();
  }

  return (
    <div className="h-screen w-full">
      <VideoCallRoom videoCallId={videocallId} />
    </div>
  );
};

export default VideoCallPage;
