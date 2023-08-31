import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams, useRouteMatch } from "react-router-dom";
import { readDeck, deleteDeck } from "../utils/api";
import NavBar from "../Layout/NavBar";
import CardList from "../Cards/CardList";

export default function Deck() {
  const { deckId } = useParams(); // Get deckId parameters from the URL
  const history = useHistory(); // Access browser's history API
  const { url } = useRouteMatch(); // Get URL or current route
  const [deck, setDeck] = useState({}); // State for holding deck data

  // Effect hook to fetch and set deck data
  useEffect(() => {
    // Abort controller for cleanup
    const abortCon = new AbortController();
    // Fetch and set deck data
    async function getDeck() {
      try {
        if (deckId) {
          const gotDeck = await readDeck(deckId, abortCon.signal);
          setDeck({ ...gotDeck });
        }
        // Catch and throw any errors
      } catch (err) {
        throw err;
      }
    }
    // Calls fucntion to get deck data
    getDeck();
    // Cleanup function
    return () => abortCon.abort();
  }, [deckId]);

  // Function to handle deck delete
  async function handleDelete(id) {
    try {
      // Window to confirm deletion
      const result = window.confirm(
        "Delete this deck?\n\n\nYou will not be able to recover it."
      );
      // If delete selected, then...
      if (result) {
        const abortCon = new AbortController(); // abort controller for cleanup
        await deleteDeck(id, abortCon.signal); // call API to delete the deck
        history.push("/"); // navigate to homepage
      }
      // catch and throw any errorss
    } catch (err) {
      throw err;
    }
  }

  return (
    <>
      <NavBar pageName={deck.name} />
      {!deck.id ? (
        <>
          <h2>Loading deck...</h2>
        </>
      ) : (
        <>
          <div className="d-flex flex-column">
            <div className="d-flex flex-column">
              <h2>{deck.name}</h2>
              <p>{deck.description}</p>
            </div>
            <div className="d-flex justify-content-between">
              <div className="flex-item">
                <Link
                  className="btn btn-secondary mr-2"
                  to={`/decks/${deck.id}/edit`}
                >
                  <i className="fas fa-pencil"></i> Edit
                </Link>
                <Link
                  className="btn btn-primary  mr-2"
                  to={`/decks/${deck.id}/study`}
                >
                  <i className="fas fa-book mr-1"></i> Study
                </Link>
                <Link className="btn btn-primary" to={`${url}/cards/new`}>
                  <i className="fas fa-plus"></i> Add Cards
                </Link>
              </div>
              <div className="flex-item">
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => handleDelete(deck.id)}
                >
                  <i className="fas fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column mt-4">
            <h2>Cards</h2>
            <CardList cards={deck.cards} />
          </div>
        </>
      )}
    </>
  );
}
