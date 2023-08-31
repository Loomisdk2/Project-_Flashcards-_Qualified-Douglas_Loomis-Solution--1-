import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { createDeck, readDeck, updateDeck } from "../utils/api";

export default function DeckForm({ mode }) {
  // Access to browsers history API
  const history = useHistory();
  // Extract deckId parameter from the URL
  const { deckId } = useParams();
  // Inital form data structure
  const initialFormData = {
    name: "",
    description: "",
  };

  // State for holding form data
  const [formData, setFormData] = useState({ ...initialFormData });

  // Handler for form changes
  const handleChange = ({ target }) =>
    setFormData({ ...formData, [target.name]: target.value });

  // Effect hook to load deck data when in edit mode
  useEffect(() => {
    const abortCon = new AbortController();

    // Function to fetch and set the from data when in edit mode
    async function getEditDeck() {
      try {
        const deckToEdit = await readDeck(deckId, abortCon.signal);
        setFormData({ ...deckToEdit });
        // Throw any errors
      } catch (err) {
        throw err;
      }
    }
    // Checks if in edit mode and fetch data accordingly
    if (mode === "edit") {
      getEditDeck();
    }
    // Cleanup function
    return () => abortCon.abort();
  }, [deckId, mode]);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const abortCon = new AbortController();

    // Create new deck
    async function createNewDeck() {
      try {
        const newDeck = await createDeck(formData, abortCon.signal);
        setFormData({ ...initialFormData });
        history.push(`/decks/${newDeck.id}`);
      } catch (err) {
        throw err;
      }
    }

    // Function to edit existing deck
    async function editDeck() {
      try {
        await updateDeck(formData, abortCon.signal);
        history.push(`/decks/${deckId}`);
      } catch (err) {
        throw err;
      }
    }

    // Call appropriate function based on mode
    mode === "create" ? createNewDeck() : editDeck();

    // Cleanup function
    return () => abortCon.abort();
  };

  return (
    <div className="d-flex flex-column">
      <form className="col-12" onSubmit={handleSubmit}>
        <div className="row form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control form-control-lg"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Deck Name"
          />
        </div>
        <div className="row form-group">
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            className="form-control form-control-lg"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the deck"
          />
        </div>
        <div className="row">
          <Link
            to={mode === "create" ? "/" : `/decks/${deckId}`}
            className="btn btn-secondary mr-2"
          >
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
