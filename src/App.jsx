import { useEffect, useState } from "react";
import QuotationForm from "./components/quotation/QuotationForm";
import QuotationPreview from "./components/quotation/QuotationPreview";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { getSavedQuotes, saveQuote, deleteQuote } from "./utils/storage";

export default function App() {
  const [quote, setQuote] = useState(null);
  const [editingQuote, setEditingQuote] = useState(null);
  const [savedQuotes, setSavedQuotes] = useState([]);

  useEffect(() => {
    setSavedQuotes(getSavedQuotes());
  }, []);

  const handleGenerate = (newQuote) => {
    const updated = saveQuote(newQuote);
    setSavedQuotes(updated);
    setQuote(newQuote);
    setEditingQuote(null);
  };

  const handleSelect = (q) => {
    setQuote(q);
    setEditingQuote(null);
  };

  const handleDelete = (ref) => {
    const updated = deleteQuote(ref);
    setSavedQuotes(updated);
    if (quote?.ref === ref) setQuote(null);
  };

  const handleNew = () => {
    setQuote(null);
    setEditingQuote(null);
  };

  const handleEdit = () => {
    setEditingQuote(quote);
    setQuote(null);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar
        savedQuotes={savedQuotes}
        activeRef={quote?.ref}
        onSelect={handleSelect}
        onNew={handleNew}
        onDelete={handleDelete}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <div style={{ flex: 1 }}>
          {quote ? (
            <QuotationPreview quote={quote} onEdit={handleEdit} />
          ) : (
            <QuotationForm key={editingQuote?.ref || "new"} initialData={editingQuote} onSubmit={handleGenerate} />
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
