# Question Answering System with LLM

## Overview

The Question Answering System with LLM is a web application that allows users to ask questions related to the content of a YouTube video. The application uses OpenAI's Whisper API to generate transcriptions of YouTube videos, which are stored in a MongoDB database. The transcriptions are then used to generate documents with Langchain, and their embeddings are stored in Pinecone for faster query. The LLM model is used to answer user questions based on the stored documents.

https://user-images.githubusercontent.com/98205162/233610021-4c9a07f3-42c0-414d-9f4a-896609b248e4.mp4

## Backend

### Transcription Generation

The first step in the backend process is to download the YouTube video using the `youtube-dl-exec` npm package. The video is then divided into smaller chunks of a specific duration using the `fluent-ffmpeg` package. Each chunk is then read and sent to the OpenAI Whisper API using the `whisper-1` model to generate transcriptions. The generated transcription for each chunk is stored in a MongoDB database.

### Document Generation

To generate documents, the `transcription.txt` file is created by compiling all the transcription chunks together. The `RecursiveCharacterTextSplitter` in Langchain is used to split the transcription text into multiple documents. These documents are then used to generate embeddings with Pinecone, which provides the semantic meaning to the documents.

### Question Answering

The LLM model is used to answer user questions based on the stored documents. The `StuffDocumentsChain` is used to create a chain of documents, which is then used as the context for answering questions.

## Frontend

The frontend of the application is built using React. I used `axios` for data fetching and other api requests. Users can input their questions and receive answers in real-time.

## Installation

To install the Question Answering System with LLM, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/qa-system.git`
2. First go to server directory `cd server`
3. Install dependencies: `npm install`
4. Create a `.env` file with the following variables:

   - OPENAI_API_KEY=YOUR_OPENAI_API_KEY
   - PINECONE_API_KEY=YOUR_PINECONE_API_KEY
   - PINECONE_INDEX=YOUR_PINECONE_INDEX_NAME
   - PINECONE_ENVIRONMENT=YOUR_PINECONE_ENVIRONMENT
   - DATABASE_URI=YOUR_MONGODB_URI

5. Start the application: `npm start`
6. Now, In the another terminal Go to client directory `cd .. && cd client`
7. Install dependencies: `npm install`
8. Start the application: `npm run dev`

## Usage

To use the Question Answering System with LLM, follow these steps:

1. Enter the YouTube video URL in the input field
2. Wait for the transcription process to finish
3. Enter your question in the input field
4. Receive the answer in real-time

## Contributing

Contributions to the Question Answering System with LLM are welcome! To contribute, follow these guidelines:

1. Submit bug reports and feature requests via the GitHub issue tracker
2. Fork the repository and create a branch for your changes
3. Submit a pull request with your changes

## License

The Question Answering System with LLM is released under the MIT License. See LICENSE.md for details.

## Credits

The following packages were used in the development of this application:

- `youtube-dl-exec`
- `fluent-ffmpeg`
- `openai`
- Langchain
- Pinecone
- React
- `axios`
