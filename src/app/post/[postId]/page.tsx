import { PostDetails } from "./components/post-details";
import { BackButton } from "./components/back-button";
import { ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: { params: { postId: string } },
  parent: ResolvingMetadata
) {
  const { postId } = params;

  const previousImages = (await parent).openGraph?.images || [];

  const post = await fetch(
    `https://modela3dblog.vercel.app/api/posts/get-post?postId=${postId}&userId=jefersonapps`
  ).then((res) => res.json());

  return {
    title: `${post ? post[0].author : "Usuário"} no Modela3D | Blog`,
    description: post
      ? post[0].content
      : "Acesse para visualizar o conteúdo da postagem",
    openGraph: {
      images: [
        post
          ? post[0].userImageUrl
          : "https://modela3dblog.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffavicon.28c6f610.ico&w=48&q=75",
        ...previousImages,
      ],
    },
  };
}

export default function Page({ params }: { params: { postId: string } }) {
  return (
    <div>
      <div className="flex items-center gap-4 sticky top-[78px] bg-card/50 backdrop-blur-sm z-10 py-2 px-2">
        <BackButton />
        <h2 className="font-semibold text-lg">Publicação</h2>
      </div>
      <PostDetails postId={params.postId} />
    </div>
  );
}
