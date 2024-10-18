import { PostDetails } from "./components/post-details";
import { BackButton } from "./components/back-button";

export default function Page({ params }: { params: { postId: string } }) {
  return (
    <div>
      <div className="flex items-center gap-4 sticky top-[81px] bg-card/50 backdrop-blur-sm z-10 py-2 px-2">
        <BackButton />
        <h2 className="font-semibold text-lg">Publicação</h2>
      </div>
      <PostDetails postId={params.postId} />
    </div>
  );
}
