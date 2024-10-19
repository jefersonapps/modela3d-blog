import { Header } from "./components/header";
import { ProfileContent } from "./components/profile-content";

export default function Page({ params }: { params: { userId: string } }) {
  if (!params.userId) return null;
  return (
    <div>
      <Header userId={params.userId} />
      <ProfileContent userId={params.userId} />
    </div>
  );
}
