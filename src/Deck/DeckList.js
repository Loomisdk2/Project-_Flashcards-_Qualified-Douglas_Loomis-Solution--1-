import React from "react";
import { Link } from "react-router-dom";
import { deleteDeck } from "../utils/api/index.js";

export default function Decklist({ decks }) {
  // Handle delete function
  async function handleDelete(id) {
    const abortCon = new AbortController();
    try {
      // Window to confirm deletion
      const result = window.confirm(
        "Delete this deck?\n\n\nYou will not be able to recover it."
      );
      // If user confirms deletion, then...
      if (result) {
        await deleteDeck(id, abortCon.signal);
        // reload page
        window.location.reload();
      }
      // throw any errors
    } catch (err) {
      throw err;
    }
    // Cleanup function
    return () => abortCon.abort();
  }

  return (
    <>
      {decks.map((deck) => (
        <div className="card " key={deck.id}>
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div className="flex-item">
                <h2 className="card-title">{deck.name}</h2>
              </div>
              <div className="flex-item">
                <p className="text-muted">
                  <small>{deck.cards.length} cards</small>
                </p>
              </div>
            </div>
            <p className="card-info">{deck.description}</p>
            <div className="d-flex justify-content-between">
              <div className="">
                <Link
                  className="btn btn-secondary mr-2"
                  to={`decks/${deck.id}`}
                >
                  <i className="fas fa-eye mr-1"></i> View
                </Link>
                <Link
                  className="btn btn-primary  mr-2"
                  to={`/decks/${deck.id}/study`}
                >
                  <i className="fas fa-book mr-1"></i> Study
                </Link>
              </div>
              <div className="">
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => handleDelete(deck.id)}
                >
                  <i className="fas fa-trash-alt mr-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
