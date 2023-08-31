import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../Layout/NavBar";
import { readDeck } from "../utils/api";
import DeckForm from "./DeckForm";

export default function EditDeck() {
  // State to store current deck data
  const [deck, setDeck] = useState({});
  // Extract deckId parameter form the URL
  const { deckId } = useParams();

  // Fetch and set current deck data
  useEffect(() => {
    // Abort controller for cleanup
    const abortCon = new AbortController();
    // Fetch current deck data
    async function getCurrentDeck() {
      try {
        // Fetch deck data using readDeck function from API
        const currentDeck = await readDeck(deckId, abortCon.signal);
        setDeck({ ...currentDeck });
        // Catch and throw any errors
      } catch (err) {
        throw err;
      }
    }
    // Call function to fetch current deck data
    getCurrentDeck();

    // Cleanup function
    return () => {
      abortCon.abort();
    };
  }, [deckId]);

  return (
    <div>
      <div className="d-flex">
        <NavBar
          linkName={deck.name}
          link={`/decks/${deck.id}`}
          pageName={"Edit Deck"}
        />
      </div>
      <div className="d-flex flex-column">
        <h2>Edit Deck</h2>
        <DeckForm mode="edit" />
      </div>
    </div>
  );
}
