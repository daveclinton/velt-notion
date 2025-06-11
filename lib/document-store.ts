import { create } from "zustand";
import { persist } from "zustand/middleware";

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

interface DocumentState {
  documents: Document[];

  // Actions
  getDocuments: (userId: string) => Document[];
  getDocumentById: (id: string) => Document | null;
  createDocument: (
    userId: string,
    title: string,
    parentDocumentId?: string
  ) => Document | null;
  updateDocument: (id: string, updates: Partial<Document>) => Document | null;
  deleteDocument: (id: string) => boolean;
  publishDocument: (id: string) => Document | null;
  restoreDocument: (id: string) => Document | null;
  archiveDocument: (id: string) => boolean;

  // Internal helpers
  _deleteDocumentRecursive: (id: string) => void;
  _archiveDocumentRecursive: (id: string) => void;
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      documents: [
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
      ],

      getDocuments: (userId: string) => {
        if (!userId) {
          throw new Error("User ID is required");
        }
        const { documents } = get();
        return documents.filter(
          (doc) => doc.userId === userId && !doc.isArchived
        );
      },

      getDocumentById: (id: string) => {
        if (!id) {
          return null;
        }
        const { documents } = get();
        return documents.find((doc) => doc.id === id) || null;
      },

      createDocument: (
        userId: string,
        title: string,
        parentDocumentId?: string
      ) => {
        if (!userId) {
          throw new Error("User ID is required");
        }

        const { documents, getDocumentById } = get();

        if (parentDocumentId) {
          const parent = getDocumentById(parentDocumentId);
          if (!parent) {
            return null;
          }
        }

        const newDoc: Document = {
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

        set((state) => ({
          documents: [...state.documents, newDoc],
        }));

        return newDoc;
      },

      updateDocument: (id: string, updates: Partial<Document>) => {
        const { documents } = get();
        const docIndex = documents.findIndex((doc) => doc.id === id);

        if (docIndex === -1) {
          return null;
        }

        const updatedDoc = {
          ...documents[docIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          documents: state.documents.map((doc, index) =>
            index === docIndex ? updatedDoc : doc
          ),
        }));

        return updatedDoc;
      },

      deleteDocument: (id: string) => {
        const { documents, _deleteDocumentRecursive } = get();
        const docExists = documents.some((doc) => doc.id === id);

        if (!docExists) {
          return false;
        }

        _deleteDocumentRecursive(id);
        return true;
      },

      _deleteDocumentRecursive: (id: string) => {
        const { documents } = get();

        // Find and delete children first
        const children = documents.filter((doc) => doc.parentDocumentId === id);
        children.forEach((child) => {
          get()._deleteDocumentRecursive(child.id);
        });

        // Delete the document itself
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
        }));
      },

      publishDocument: (id: string) => {
        const { updateDocument } = get();
        return updateDocument(id, { isPublished: true });
      },

      restoreDocument: (id: string) => {
        const { updateDocument } = get();
        return updateDocument(id, { isArchived: false });
      },

      archiveDocument: (id: string) => {
        const { documents, _archiveDocumentRecursive } = get();
        const docExists = documents.some((doc) => doc.id === id);

        if (!docExists) {
          return false;
        }

        _archiveDocumentRecursive(id);
        return true;
      },

      _archiveDocumentRecursive: (id: string) => {
        const { documents, updateDocument } = get();

        // Archive the document
        updateDocument(id, { isArchived: true });

        // Recursively archive children
        const children = documents.filter((doc) => doc.parentDocumentId === id);
        children.forEach((child) => {
          get()._archiveDocumentRecursive(child.id);
        });
      },
    }),
    {
      name: "documents-storage",
      partialize: (state) => ({ documents: state.documents }),
    }
  )
);

export const useDocuments = (userId: string) => {
  return useDocumentStore((state) => state.getDocuments(userId));
};

export const useDocument = (id: string) => {
  return useDocumentStore((state) => state.getDocumentById(id));
};

export const useDocumentActions = () => {
  return useDocumentStore((state) => ({
    createDocument: state.createDocument,
    updateDocument: state.updateDocument,
    deleteDocument: state.deleteDocument,
    publishDocument: state.publishDocument,
    restoreDocument: state.restoreDocument,
    archiveDocument: state.archiveDocument,
  }));
};
