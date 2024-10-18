import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Comment } from "../db/actions";

export const formatDateString = (dateString: Date | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const formattedDate = format(date, "dd 'de' MMMM 'de' yyyy, 'às' HH:mm'h'", {
    locale: ptBR,
  });
  return formattedDate;
};

export const formatDateStringWithoutTime = (
  dateString: Date | null
): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const formattedDate = format(date, "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });
  return formattedDate;
};

export const slugifySentences = (sentence: string): string => {
  const slug = sentence
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  // Generate 5 random letters
  const randomLetters = Array.from({ length: 5 }, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26))
  ).join("");

  return `${slug}-${randomLetters}`;
};

export const insertLinks = (markdown: string) => {
  if (!markdown) return "";
  return markdown.replace(/```(\w*)([^`]*)```/gim, (match, lang, code) => {
    const encodedCode = encodeURIComponent(code.trim());

    let link = "";

    if (lang === "js" || lang === "javascript") {
      link = `
<center>
<a href="http://modela3d.vercel.app//physics?code=${encodedCode}&autoplay=true" target="_blank">Rodar no Modela 3D (JavaScript)</a>
</center>`;
    } else if (lang === "py" || lang === "python") {
      link = `
<center>
<a href="http://modela3d.vercel.app//python?code=${encodedCode}&autoplay=true" target="_blank">Rodar no Modela 3D (Python)</a>
</center>`;
    } else {
      link = "";
    }

    return `${match}\n${link}`;
  });
};

export interface CommentWithChildren extends Comment {
  children: CommentWithChildren[];
}

export function buildCommentTree(comments: Comment[]): CommentWithChildren[] {
  const commentMap = new Map<string, CommentWithChildren>();

  comments.forEach((comment) => {
    if (!comment.id) return;
    commentMap.set(comment.id, { ...comment, children: [] });
  });

  const commentTree: CommentWithChildren[] = [];

  comments.forEach((comment) => {
    if (comment.parentCommentId === null && comment.id) {
      commentTree.push(commentMap.get(comment.id)!);
    } else if (comment.parentCommentId) {
      const parentComment = commentMap.get(comment.parentCommentId);
      if (parentComment && comment.id) {
        parentComment.children.push(commentMap.get(comment.id)!);
      }
    }
  });

  return commentTree;
}
