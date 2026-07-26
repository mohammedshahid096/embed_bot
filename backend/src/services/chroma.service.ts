import { Chroma } from "@langchain/community/vectorstores/chroma";
import { Embeddings } from "@langchain/core/embeddings";
import config from "../config/index.config";
import { embeddings_model_names } from "../constants/aimodel.constant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

type EmbeddingsFor = "gemini" | "openai";
interface ChromaServiceOptions {
  collectionName: string;
  embeddingFor?: EmbeddingsFor;
}

const embeddingCollections: Record<EmbeddingsFor, Embeddings> = {
  gemini: new GoogleGenerativeAIEmbeddings({
    model: embeddings_model_names["gemini-embedding-001"], // 768 dimensions
    // apiVersion: "v1",
  }),
  openai: new GoogleGenerativeAIEmbeddings({
    model: embeddings_model_names["gemini-embedding-001"], // 768 dimensions
    // apiVersion: "v1",
  }),
};

class ChromaService {
  private collectionName: string;
  private vectorStore: Chroma | null;
  private embeddings: Embeddings | null;

  constructor({
    collectionName,
    embeddingFor = "gemini",
  }: ChromaServiceOptions) {
    this.collectionName = collectionName;
    this.embeddings = embeddingCollections[embeddingFor];
    this.vectorStore = null;
  }

  async initialize(): Promise<Chroma | null> {
    if (!this.vectorStore && this.collectionName && this.embeddings) {
      this.vectorStore = new Chroma(this.embeddings, {
        collectionName: this.collectionName,
        host: config.chromadb.CHROMA_HOST,
        ssl: config.chromadb.CHROMA_SSL,
        port: config.chromadb.CHROMA_PORT,
      } as any);

      await this.vectorStore.ensureCollection();
      console.log(
        `✅ Vector store initialized with collection: ${this.collectionName}`,
      );
    }
    return this.vectorStore;
  }

  private async ensureVectorStore(): Promise<Chroma> {
    if (!this.vectorStore) {
      await this.initialize();
    }
    if (!this.vectorStore) {
      throw new Error(
        "Vector store not initialized. Please provide embeddings and collection name.",
      );
    }
    return this.vectorStore;
  }

  async getCollectionInfo(): Promise<{
    count: number;
    collectionName: string;
    docIds: any;
  } | null> {
    try {
      const vectorStore = await this.ensureVectorStore();
      const collection = await vectorStore.collection;
      const count = await collection?.count();
      const docs = await collection?.get();
      return {
        count: count ?? 0,
        collectionName: this.collectionName,
        docIds: docs?.ids,
      };
    } catch (error) {
      console.error("Error getting collection info:", error);
      return null;
    }
  }

  async deleteCollection(): Promise<boolean> {
    try {
      await this.ensureVectorStore();
      //   await this.vectorStore?.deleteCollection();
      await (this.vectorStore as any)?.deleteCollection?.();
      console.log(
        `✅ Collection "${this.collectionName}" deleted successfully`,
      );
      this.vectorStore = null;
      return true;
    } catch (error) {
      console.error("❌ Error deleting collection:", error);
      return false;
    }
  }

  async emptyCollection(): Promise<boolean> {
    try {
      const vectorStore = await this.ensureVectorStore();
      const collection = await vectorStore.collection;
      const allDocs = (await collection?.get()) ?? null;

      if (allDocs?.ids && allDocs.ids.length > 0) {
        await collection?.delete({ ids: allDocs.ids });
        console.log(
          `✅ Removed ${allDocs.ids.length} documents from collection "${this.collectionName}"`,
        );
      } else {
        console.log(`📂 Collection "${this.collectionName}" is already empty`);
      }

      return true;
    } catch (error) {
      console.error("❌ Error emptying collection:", error);
      return false;
    }
  }
}

export default ChromaService;
