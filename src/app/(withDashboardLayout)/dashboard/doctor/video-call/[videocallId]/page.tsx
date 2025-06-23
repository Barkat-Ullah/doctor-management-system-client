import VideoCallRoom from "@/components/module/video/VideoCallRoom";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Params = Promise<{ videocallId: string }>;

const VideoCallPage = async ({ params }: { params: Params }) => {
  const { videocallId } = await params;

  if (!videocallId) {
    notFound();
  }

  return (
    <div className="h-screen w-full">
      <VideoCallRoom videoCallId={videocallId} />
    </div>
  );
};

export default VideoCallPage;
