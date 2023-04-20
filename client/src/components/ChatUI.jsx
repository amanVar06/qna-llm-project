import { useState } from "react";
import axios from "axios";
import bot from "../assets/bot.jpg";

const BASE_URL = "http://localhost:8000";

const getAnswer = async (query) => {
  console.log(`${BASE_URL}/answer`);
  const response = await axios.post(
    `${BASE_URL}/answer`,
    JSON.stringify(query),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

const transcribe = async (url) => {
  console.log(`${BASE_URL}/transcribe`);
  const response = await axios.post(
    `${BASE_URL}/transcribe`,
    JSON.stringify(url),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

const ChatUI = () => {
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [isTransribing, setIsTransribing] = useState(false);
  const [isQuering, setIsQuering] = useState(false);

  function onQueryInputChange(e) {
    setQuery(e.target.value);
  }

  function onUrlInputChange(e) {
    setUrl(e.target.value);
  }

  async function generateTranscribe(e) {
    setIsTransribing(true);
    e.preventDefault();
    console.log(url);
    const response = await transcribe({
      url: url,
    });

    console.log(response);
    if (response) setIsTransribing(false);
  }

  async function handleSubmit(e) {
    setIsQuering(true);
    e.preventDefault();
    console.log(query);
    const response = await getAnswer({
      query: query,
    });
    // console.log(response.data);
    setAnswer(response?.data);
    if (response?.data) setIsQuering(false);
  }

  return (
    <article>
      <div className="query-form">
        <label className="query-label" htmlFor="query-input">
          Paste Youtube video URL Here.
        </label>
        <input
          type="text"
          id="query-input"
          name="query-input"
          className="query-input"
          value={url}
          onChange={onUrlInputChange}
          autoComplete="off"
        />

        <button
          className="btn-submit"
          type="button"
          onClick={generateTranscribe}
        >
          Start Transcription
        </button>
        <p>This may take few minutes depending upon the size of the video.</p>
        <p>50 min video usually takes 10-12 minutes.</p>
        {isTransribing && <p>Transcribing....</p>}
      </div>
      <form onSubmit={handleSubmit} className="query-form">
        <label className="query-label" htmlFor="query-input">
          Write your question here.
        </label>
        <input
          type="text"
          id="query-input"
          name="query-input"
          className="query-input"
          value={query}
          onChange={onQueryInputChange}
          autoComplete="off"
        />

        <button className="btn-submit" type="submit">
          Ask Question
        </button>
        <p>This may take a while.</p>
        {isQuering && <p>Fetching Answer....</p>}
      </form>
      {answer && (
        <section className="chat-section">
          <div className="user-section">
            <img
              src={bot}
              alt="bot"
              width="40px"
              height="40px"
              loading="lazy"
            />
            <div className="asked-question">
              <p className="user">You</p>
              <p>{query}</p>
            </div>
          </div>
          <div className="bot-section">
            <img
              src={bot}
              alt="bot"
              width="40px"
              height="40px"
              loading="lazy"
            />
            <div className="bot-answer">
              <p className="user">Answer</p>
              <p>{answer}</p>
            </div>
          </div>
        </section>
      )}
    </article>
  );
};
export default ChatUI;
