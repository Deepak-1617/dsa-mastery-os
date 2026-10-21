export interface SearchDocument {
  id: string;
  type: "topic" | "lesson" | "problem" | "plan" | "tag";
  title: string;
  description: string;
  href: string;
}

export function searchDocuments(documents: SearchDocument[], query: string, limit = 12): SearchDocument[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored = documents
    .map((doc) => {
      const title = doc.title.toLowerCase();
      const description = doc.description.toLowerCase();
      let score = 0;
      if (title === q) score = 100;
      else if (title.startsWith(q)) score = 80;
      else if (title.includes(q)) score = 60;
      else if (description.includes(q)) score = 30;
      return { doc, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title));
  return scored.slice(0, limit).map((item) => item.doc);
}
