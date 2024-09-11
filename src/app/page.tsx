import { CreatePost } from "./components/create-post";
import { ListPosts } from "./components/list-posts";
import { TopBar } from "./components/top-bar";
export default async function Home() {
  return (
    <div>
      <main className="space-y-4 p-4 max-w-6xl mx-auto">
        <TopBar />
        <CreatePost />
        <ListPosts />
      </main>
    </div>
  );
}
