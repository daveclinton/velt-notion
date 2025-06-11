export interface Document {
  id: string;
  title: string;
  content: string;
  userId: string;
  isPublished: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
  icon?: string;
  parentDocumentId?: string;
}

let documents: Document[] = [
  {
    id: "doc_1",
    title: "Sample Document",
    content: "This is a sample document.",
    userId: "user_123",
    isPublished: true,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    coverImage: "/documents.png",
    icon: "📄",
  },
  {
    id: "doc_2",
    title: "Child Document",
    content: "This is a child document.",
    userId: "user_123",
    isPublished: false,
    isArchived: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    icon: "📄",
    parentDocumentId: "doc_1",
  },
  {
    id: "doc_3",
    title: "Test Document",
    content: "Test content.",
    userId: "user_123",
    isPublished: false,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    icon: "📄",
  },
];

export function getDocuments(userId: string): Document[] {
  if (!userId) {
    throw new Error("User ID is required");
  }
  return documents.filter((doc) => doc.userId === userId && !doc.isArchived);
}

export function getDocumentById(id: string): Document | null {
  if (!id) {
    return null;
  }
  return documents.find((doc) => doc.id === id) || null;
}

export function createDocument(
  userId: string,
  title: string,
  parentDocumentId?: string
): Document | null {
  if (!userId) {
    throw new Error("User ID is required");
  }
  if (parentDocumentId) {
    const parent = getDocumentById(parentDocumentId);
    if (!parent) {
      return null;
    }
  }
  const doc: Document = {
    id: `doc_${Math.random().toString(36).slice(2)}`,
    title: title || "Untitled",
    content: "",
    userId,
    isPublished: false,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    parentDocumentId,
    icon: "📄",
  };
  documents.push(doc);
  saveDocuments(documents);
  return doc;
}

export function updateDocument(
  id: string,
  updates: Partial<Document>
): Document | null {
  const doc = documents.find((doc) => doc.id === id);
  if (!doc) {
    return null;
  }
  Object.assign(doc, { ...updates, updatedAt: new Date().toISOString() });
  saveDocuments(documents);
  return doc;
}

export function deleteDocument(id: string): boolean {
  const index = documents.findIndex((doc) => doc.id === id);
  if (index !== -1) {
    documents.splice(index, 1);
    const children = documents.filter((d) => d.parentDocumentId === id);
    children.forEach((child) => deleteDocument(child.id));
    saveDocuments(documents);
    return true;
  }
  return false;
}

export function publishDocument(id: string): Document | null {
  const doc = documents.find((doc) => doc.id === id);
  if (!doc) {
    return null;
  }
  doc.isPublished = true;
  doc.updatedAt = new Date().toISOString();
  saveDocuments(documents);
  return doc;
}

export function restoreDocument(id: string): Document | null {
  const doc = documents.find((doc) => doc.id === id);
  if (!doc) {
    return null; // Document not found
  }
  doc.isArchived = false;
  doc.updatedAt = new Date().toISOString();
  saveDocuments(documents);
  return doc;
}

export function archiveDocument(id: string): boolean {
  const doc = documents.find((doc) => doc.id === id);
  if (!doc) {
    return false; // Document not found
  }
  doc.isArchived = true;
  doc.updatedAt = new Date().toISOString();
  // Recursively archive child documents
  const children = documents.filter((d) => d.parentDocumentId === id);
  children.forEach((child) => archiveDocument(child.id));
  saveDocuments(documents);
  return true;
}

// LocalStorage persistence
function loadDocuments(): Document[] {
  try {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("documents");
      return saved ? JSON.parse(saved) : [];
    }
  } catch (error) {
    console.error("Failed to load documents from localStorage:", error);
  }
  return [];
}

function saveDocuments(docs: Document[]) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("documents", JSON.stringify(docs));
    }
  } catch (error) {
    console.error("Failed to save documents to localStorage:", error);
  }
}

documents = loadDocuments();
