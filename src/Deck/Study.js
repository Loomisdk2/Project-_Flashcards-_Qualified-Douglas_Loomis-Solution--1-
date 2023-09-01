import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import NavBar from "../Layout/NavBar";
import { readDeck } from "../utils/api";
import Card from "../Cards/Card";
import NeedMoreCards from "../Cards/NeedMoreCards";

export default function Study() {
  // State variables
  const [deck, setDeck] = useState({}); // Deck info
  const [count, setCount] = useState(0); // Total number of cards
  const [cards, setCards] = useState([]); // List of all of the cards
  const [card, setCard] = useState({}); // Currently displayed card
  const [nextIndex, setNextIndex] = useState(1); // Index of next card to be displayed
  const [flipped, setFlipped] = useState(false); // State to manage the card flip

  const { deckId } = useParams(); // Extracts deckId parameter from URL
  const history = useHistory(); // Access to browser history API

  // An effect hook to load deck data and cards when deckId changes
  useEffect(() => {
    // Abort contoller for cleanup
    const abortCon = new AbortController();
    // Fetch and set deck card data
    async function getDeck() {
      try {
        if (deckId) {
          const gotDeck = await readDeck(deckId, abortCon.signal);
          setDeck({ ...gotDeck });
          setCount(gotDeck.cards.length);
          setCards([...gotDeck.cards]);
          if (gotDeck.cards.length > 0) {
            setCard(gotDeck.cards[0]);
          }
        }
        // Error catching and throwing
      } catch (err) {
        throw err;
      }
    }

    // Call function to fetch data
    getDeck();
    return () => abortCon.abort();
  }, [deckId]);

  // Function to handle flipping cards
  const handleFlip = () => {
    setFlipped(!flipped);
  };

  // Function to handle going to the next card
  const handleNext = () => {
    if (nextIndex < cards.length) {
      setCard(cards[nextIndex]);
      setNextIndex((currentIndex) => currentIndex + 1);
      handleFlip();
    } else {
      // Popup window to ask to restart cards or return home
      const response = window.confirm(
        "Restart cards\n\n\nClick 'cancel' to return to home page."
      );
      // Either resets cards or returns to home page
      response ? reset() : history.push("/");
    }
  };
  // Function to reset study session
  const reset = () => {
    setCard(cards[0]);
    setNextIndex(1);
    handleFlip();
  };

  return (
    <>
      <div className="d-flex">
        <NavBar
          linkName={deck.name}
          link={`/decks/${deck.id}`}
          pageName={"Study"}
        />
      </div>
      <h2>{deck.name}: Study</h2>
      {count < 3 || !count ? (
        <NeedMoreCards name={deck.name} id={deck.id} cards={count} />
      ) : (
        <Card
          card={card}
          count={count}
          index={nextIndex}
          flipped={flipped}
          flip={handleFlip}
          next={handleNext}
        />
      )}
    </>
  );
}
