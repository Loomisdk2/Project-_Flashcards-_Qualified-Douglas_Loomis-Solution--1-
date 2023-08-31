import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeckList from "../Deck/DeckList";
import { listDecks } from "../utils/api";

export default function Home() {
  const [decks, setDecks] = useState([]); // State to hold decks

  // Effect hook
  useEffect(() => {
    const abortCon = new AbortController(); // Abort controller for cleanup

    // Function to load decks
    async function loadDecks() {
      try {
        const loadedDecks = await listDecks(); // Fetch list of decks
        setDecks([...loadedDecks]); // Update state with fetched deck data
        // Catch and throw errors
      } catch (err) {
        throw err;
      }
    }
    // Call function to fetch and update deck data
    loadDecks();
    // Cleanup function
    return abortCon.abort();
  }, []); // empty dependancy array to assure effect only runs once

  return (
    <div className="d-flex flex-column">
      <div className="mb-2">
        <Link className="btn btn-secondary" to="/decks/new">
          <i className="fas fa-plus"></i> Create Deck
        </Link>
      </div>
      <div>
        <DeckList decks={decks} />
      </div>
    </div>
  );
}
