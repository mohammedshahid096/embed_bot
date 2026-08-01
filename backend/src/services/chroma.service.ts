import { Chroma } from "@langchain/community/vectorstores/chroma";
import { Embeddings } from "@langchain/core/embeddings";
import config from "../config/index.config";
import { embeddings_model_names } from "../constants/aimodel.constant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import chromaClient from "../config/chroma.config";
import { Document } from "@langchain/core/documents";

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
    // console.log(this.vectorStore, this.collectionName, this.embeddings);
    if (!this.vectorStore && this.collectionName && this.embeddings) {
      this.vectorStore = new Chroma(this.embeddings, {
        collectionName: this.collectionName,
        clientParams: {
          host: config.chromadb.CHROMA_HOST,
          ssl: config.chromadb.CHROMA_SSL,
          port: config.chromadb.CHROMA_PORT,
        },
      });

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
    documents: any;
    metadatas: any;
  } | null> {
    try {
      const vectorStore = await this.ensureVectorStore();
      const collection = await vectorStore.collection;

      const count = (await collection?.count()) ?? 0;
      const docs = await collection?.get();

      return {
        count,
        collectionName: this.collectionName,
        docIds: docs?.ids,
        documents: docs?.documents,
        metadatas: docs?.metadatas,
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

  async insertToCollection(
    chunks: Document[],
  ): Promise<{ collectionCount: number; chunkCount: number }> {
    try {
      const vectorStore = await this.ensureVectorStore();

      if (!this.embeddings) {
        throw new Error("Embeddings not provided.");
      }

      const validChunks = chunks.filter(
        (chunk) => chunk?.pageContent && chunk?.pageContent?.trim().length > 0,
      );

      console.log(`Embedding ${validChunks.length} chunks...`);

      const vectors: number[][] = [];
      const successfulChunks: Document[] = [];

      for (let i = 0; i < validChunks.length; i++) {
        try {
          const chunk = validChunks[i]; // TypeScript now knows this is defined
          console.log(`Processing chunk ${i + 1}/${validChunks.length}`);
          const vector = await this.embeddings.embedQuery(chunk!.pageContent);
          vectors.push(vector);
          successfulChunks.push(chunk!);
        } catch (error: any) {
          console.log(`Error on chunk ${i}:`, error?.message);
        }
      }

      console.log("Generated vectors count:", vectors.length);

      if (vectors.length > 0) {
        await vectorStore.addVectors(vectors, successfulChunks);
        console.log(
          `✅ Successfully inserted ${vectors.length} chunks into ChromaDB`,
        );

        const collection = await vectorStore.collection;
        const count = await collection?.count();
        console.log(`📊 Collection now has ${count} documents`);
        return {
          collectionCount: count ?? 0,
          chunkCount: successfulChunks.length,
        };
      } else {
        console.log("❌ No vectors were generated");
        return {
          collectionCount: 0,
          chunkCount: 0,
        };
      }
    } catch (error: any) {
      console.error("error received -->", error?.message);
      throw error;
    }
  }

  async listAllCollection(): Promise<
    { collectionId: string; name: string }[] | null
  > {
    try {
      const collections = await chromaClient.listCollections();

      return collections.map((collection) => ({
        collectionId: collection.id,
        name: collection.name,
      }));
    } catch (error) {
      console.error("❌ Error listing collections:", error);
      return null;
    }
  }

  async query(queryText: string, nResults: number = 5): Promise<Document[]> {
    try {
      const vectorStore = await this.ensureVectorStore();
      const results = await vectorStore.similaritySearch(queryText, nResults);
      return results;
    } catch (error) {
      console.error("❌ Error querying collection:", error);
      return [];
    }
  }

  async deleteWebsiteChunksByUrl(url: string): Promise<boolean> {
    try {
      const vectorStore = await this.ensureVectorStore();
      const collection = await vectorStore.collection;
      await collection?.delete({
        where: { source: url },
      });
      return true;
    } catch (error) {
      console.error("❌ Error deleting website chunks by URL:", error);
      return false;
    }
  }
}

export default ChromaService;
