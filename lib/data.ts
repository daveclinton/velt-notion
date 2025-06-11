export interface Document {
  id: string;
  title: string;
  content: string;
  userId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
  icon?: string;
}

let documents: Document[] = [
  {
    id: "doc_1",
    title: "Sample Document",
    content: "This is a sample document.",
    userId: "user_123",
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    coverImage: "/documents.png",
    icon: "📄",
  },
];

export function createDocument(userId: string, title: string): Document {
  const doc: Document = {
    id: `doc_${Math.random().toString(36).slice(2)}`,
    title,
    content: "",
    userId,
    isPublished: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  documents.push(doc);
  return doc;
}

export function getDocuments(userId: string): Document[] {
  return documents.filter((doc) => doc.userId === userId);
}

export function getDocumentById(id: string): Document | null {
  return documents.find((doc) => doc.id === id) || null;
}

export function updateDocument(
  id: string,
  updates: Partial<Document>
): Document | null {
  const doc = documents.find((doc) => doc.id === id);
  if (doc) {
    Object.assign(doc, { ...updates, updatedAt: new Date().toISOString() });
    return doc;
  }
  return null;
}

export function deleteDocument(id: string): boolean {
  const index = documents.findIndex((doc) => doc.id === id);
  if (index !== -1) {
    documents.splice(index, 1);
    return true;
  }
  return false;
}

export function publishDocument(id: string): Document | null {
  const doc = documents.find((doc) => doc.id === id);
  if (doc) {
    doc.isPublished = true;
    doc.updatedAt = new Date().toISOString();
    return doc;
  }
  return null;
}
