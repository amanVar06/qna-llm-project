const { TextLoader } = require("langchain/document_loaders/fs/text");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { PineconeClient } = require("@pinecone-database/pinecone");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeStore } = require("langchain/vectorstores/pinecone");
const { OpenAI } = require("langchain/llms/openai");
const { loadQAStuffChain } = require("langchain/chains");
const path = require("path");

const llm = new OpenAI({
  temperature: 0.9,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

async function getResponse(query) {
  console.log(query);
  const loader = new TextLoader(
    path.join(__dirname, "..", "transcription.txt")
  );
  const data = await loader.load();

  console.log(`You have ${data.length} document(s) in your data`);
  console.log(
    `There are ${data[0].pageContent.length} characters in your document`
  );

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 1,
  });

  const docs = await splitter.splitDocuments(data);
  console.log(`Now you have ${docs.length} documents`);

  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
  const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

  const vectorStore = await PineconeStore.fromDocuments(
    docs,
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    }),
    { pineconeIndex }
  );

  let results = await vectorStore.similaritySearch(query);
  // console.log(results);

  const chain = loadQAStuffChain(llm);
  const response = await chain.call({
    input_documents: results,
    question: query,
  });
  console.log({ response });

  return response;
}

module.exports = { getResponse };
