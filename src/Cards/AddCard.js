import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { readDeck } from "../utils/api";
import NavBar from "../Layout/NavBar";
import CardForm from "./CardForm";

export default function AddCard() {
  // State hook for current deck
  const [currentDeck, setCurrentDeck] = useState({});
  const { deckId } = useParams();

  useEffect(() => {
    // Abort controller created
    const abortCon = new AbortController();
    async function getDeck() {
      try {
        // Check if deckId exists
        if (deckId) {
          const gotDeck = await readDeck(deckId, abortCon.signal);
          // Update the currentDeck with the data from haveDeck
          setCurrentDeck({ ...gotDeck });
        }
        // Throw any errors
      } catch (err) {
        throw err;
      }
    }
    // Calls getDeck function
    getDeck();
    // Returns a cleanup function
    return () => abortCon.abort();
  }, [deckId]);

  return (
    <>
      <div className="d-flex">
        <NavBar
          linkName={currentDeck.name}
          link={`decks/${currentDeck.id}`}
          pageName={"Add Card"}
        />
      </div>
      <div className="d-flex flex-column">
        <h2>{currentDeck.name}: Add Card</h2>
        <CardForm />
      </div>
    </>
  );
}
