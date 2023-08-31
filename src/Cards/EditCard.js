import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../Layout/NavBar";
import { readDeck } from "../utils/api";
import CardForm from "./CardForm";

export default function EditCard() {
  // Params hook to get deckId and CardId from URl
  const { deckId, cardId } = useParams();
  // Create state variable using useState hook
  const [deck, setDeck] = useState({});

  // Fetch and set deck info
  useEffect(() => {
    // Abort controller created
    const abortCon = new AbortController();
    // Function to get deck info
    async function getDeck() {
      try {
        // If deckId exists, then...
        if (deckId) {
          // Fetch deck info using readDeck function from API
          const gotDeck = await readDeck(deckId, abortCon.signal);
          // Update deck state with fetched deck info
          setDeck({ ...gotDeck });
        }
        // Throw any errors
      } catch (err) {
        throw err;
      }
    }
    // Call getDeck to initate fetch
    getDeck();
    // Return clean up function
    return () => abortCon.abort();
  }, [deckId]);

  return (
    <div>
      <div className="d-flex">
        <NavBar
          linkName={`Deck ${deck.name}`}
          link={`/decks/${deck.id}`}
          pageName={`Edit Card ${cardId}`}
        />
      </div>
      <div className="d-flex flex-column">
        <h2>Edit Card</h2>
        <CardForm mode="edit" />
      </div>
    </div>
  );
}
