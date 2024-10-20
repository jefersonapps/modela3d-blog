"use client";

import { Separator } from "@/components/ui/separator";
import { ListUserPosts } from "./list-user-posts";
import { ListUserComments } from "./list-user-comments";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const TABS = [
  {
    key: "posts",
    label: "Postagens",
    component: ListUserPosts,
  },
  {
    key: "comments",
    label: "Comentários",
    component: ListUserComments,
  },
] as const;

export function ProfileContent({ userId }: { userId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getInitialTab = () => {
    const tabParam = searchParams.get("tab");
    return TABS.find((tab) => tab.key === tabParam)?.key || "posts";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  const handleTabClick = (key: (typeof TABS)[number]["key"]) => {
    setActiveTab(key);

    const newParams = new URLSearchParams(window.location.search);
    newParams.set("tab", key);
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const initialTab = getInitialTab();
    setActiveTab(initialTab);
  }, [searchParams]);

  const renderActiveTabContent = () => {
    const ActiveComponent = TABS.find(
      (tab) => tab.key === activeTab
    )?.component;
    return ActiveComponent ? <ActiveComponent userId={userId} /> : null;
  };

  return (
    <div>
      <div>
        <div className="flex justify-around text-zinc-500">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              data-active={activeTab === tab.key}
              className="py-2 px-4 border-b-2 border-transparent data-[active=true]:border-blue-500 data-[active=true]:text-white font-semibold"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <Separator />

      {renderActiveTabContent()}
    </div>
  );
}
