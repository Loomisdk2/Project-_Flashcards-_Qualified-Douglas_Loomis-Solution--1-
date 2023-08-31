import React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { deleteCard } from "../utils/api";

export default function CardList({ cards }) {
  // Get browesers history object and URL
  const history = useHistory();
  const { url } = useRouteMatch();

  // Handle delete card
  async function handleDelete(id) {
    // Abort controller for handling abort signals
    const abortCon = new AbortController();
    try {
      // Display confirmation text to user
      const result = window.confirm(
        "Delete this card?\n\n\nYou will not be able to recover it."
      );
      // If user confirms deletion, then...
      if (result) {
        // Call deletCard API function with card id and the abort signal
        await deleteCard(id, abortCon.signal);
        // Reload window to show updated card list
        window.location.reload();
      }
      // Throw error if there are any
    } catch (err) {
      throw err;
    }
  }

  return (
    cards && (
      <div className="d-flex flex-column">
        {cards.map((card) => (
          <div className="card" key={card.id}>
            <div className="card-body d-flex">
              <div className="card-text w-50 m-2">
                <p>{card.front}</p>
              </div>
              <div className="card-text w-50 m-2">
                <p>{card.back}</p>
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-secondary mr-2"
                    type="button"
                    onClick={() => history.push(`${url}/cards/${card.id}/edit`)}
                  >
                    <i className="fas fa-pencil"></i> Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => handleDelete(card.id)}
                  >
                    <i className="fas fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  );
}
