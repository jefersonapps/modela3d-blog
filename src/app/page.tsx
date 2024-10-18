import { CreatePost } from "./components/create-post";
import { ListPosts } from "./components/list-posts";
export default async function Home() {
  return (
    <div>
      <main>
        <CreatePost />
        <ListPosts />
      </main>
    </div>
  );
}
