import { ChromaClient } from "chromadb";
import config from "./index.config";

const chromaClient = new ChromaClient({
  port: config.chromadb.CHROMA_PORT,
  host: config.chromadb.CHROMA_HOST,
  ssl: config.chromadb.CHROMA_SSL,
});

export default chromaClient;
