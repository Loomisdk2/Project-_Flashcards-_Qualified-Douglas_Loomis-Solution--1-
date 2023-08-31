import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { createCard, readCard, updateCard } from "../utils/api";

export default function CardForm({ mode = "create" }) {
  const history = useHistory();
  const { deckId, cardId } = useParams();
  // Inital form data with empty front and back
  const initialFormData = {
    front: "",
    back: "",
  };

  // State hook to manage form data
  const [formData, setFormData] = useState({ ...initialFormData });

  // Event handler to update form data
  const handleChange = ({ target }) =>
    setFormData({ ...formData, [target.name]: target.value });

  // Effect hook to fetch and populate form data when editing
  useEffect(() => {
    const abortCon = new AbortController();
    async function getEditCard() {
      try {
        // Fetch card data to edit
        const cardToEdit = await readCard(cardId, abortCon.signal);
        setFormData({ ...cardToEdit });
      } catch (err) {
        throw err;
      }
    }
    //If editing fetch card data
    if (mode === "edit") {
      getEditCard();
    }
    // Cleanup function to abort any ongoing fetch
    return () => abortCon.abort();
  }, [cardId, mode]);

  // Submission handler
  const handleSubmit = (event) => {
    event.preventDefault();
    const abortCon = new AbortController();

    // Function to add new card
    async function addCard() {
      try {
        // API call to create new card for specified deck
        await createCard(deckId, formData, abortCon.signal);
        // Reset for data to inital values
        setFormData({ ...initialFormData });
        // Throw any errors
      } catch (err) {
        throw err;
      }
    }

    // Function to edit cards
    async function editCard() {
      try {
        // API call to update card with new data
        await updateCard(formData, abortCon.signal);
        // Redirect to the decks page after edit
        history.push(`/decks/${deckId}`);
        // Throw any errors
      } catch (err) {
        throw err;
      }
    }
    // Call either edit or create
    mode === "edit" ? editCard() : addCard();
  };

  return (
    <div className="d-flex flex-column">
      <form className="col-12" onSubmit={handleSubmit}>
        <div className="row form-group">
          <label htmlFor="front">Front</label>
          <textarea
            type="text"
            className="form-control form-control-lg"
            id="front"
            name="front"
            value={formData.front}
            onChange={handleChange}
            placeholder="front side of card"
          />
        </div>
        <div className="row form-group">
          <label htmlFor="back">Back</label>
          <textarea
            type="text"
            className="form-control form-control-lg"
            id="back"
            name="back"
            value={formData.back}
            onChange={handleChange}
            placeholder="Back side of card"
          />
        </div>
        <div className="row">
          <Link to={`/deck/${deckId}`} className="btn btn-secondary mr-2">
            {mode === "edit" ? "Cancel" : "Done"}
          </Link>
          <button type="submit" className="btn btn-primary">
            {mode === "edit" ? "submit" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
