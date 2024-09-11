import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDateString = (dateString: Date | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const formattedDate = format(date, "dd 'de' MMMM 'de' yyyy, 'às' HH:mm'h'", {
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
