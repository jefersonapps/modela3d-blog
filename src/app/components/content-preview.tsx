"use client";

import { MdPreview, config } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import PT_BR from "../utils/locale/pt-br";
import { Post, UnauthenticatedPosts } from "../db/actions";
import { useCurrentTheme } from "../hooks/use-current-theme";

config({
  editorConfig: {
    languageUserDefined: {
      "pt-br": PT_BR,
    },
  },
});

interface ContentPreviewProps {
  post: Post | UnauthenticatedPosts;
}

export function ContentPreview({ post }: ContentPreviewProps) {
  const theme = useCurrentTheme();
  return (
    <MdPreview
      editorId="content"
      modelValue={post.content}
      theme={theme}
      language="pt-br"
      className="rounded-md"
    />
  );
}
