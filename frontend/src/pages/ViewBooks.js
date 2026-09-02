import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import "./LibraryPage.css";

const API = `${API_BASE_URL}/books`;

function ViewBooks() {
  const emptyBook = {
    title: "", author: "", publisher: "", isbn: "", category: "",
    totalCopies: "", availableCopies: ""
  };

  const [books, setBooks] = useState([]);
  const [book, setBook] = useState(emptyBook);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(API);
      setBooks(response.data?.data || []);
    } catch (error) {
      console.error("Books error:", error);
    }
  };

  const handleChange = (e) => setBook({ ...book, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, book);
        alert("Book Updated Successfully");
      } else {
        await axios.post(API, book);
        alert("Book Added Successfully");
      }
      setBook(emptyBook);
      setEditId(null);
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to save book");
    }
  };

  const editBook = (selectedBook) => {
    setBook({
      title: selectedBook.title || "",
      author: selectedBook.author || "",
      publisher: selectedBook.publisher || "",
      isbn: selectedBook.isbn || "",
      category: selectedBook.category || "",
      totalCopies: selectedBook.totalCopies ?? "",
      availableCopies: selectedBook.availableCopies ?? ""
    });
    setEditId(selectedBook._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      alert("Book Deleted Successfully");
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  const filteredBooks = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return books;
    return books.filter((b) =>
      [b.title, b.author, b.publisher, b.isbn, b.category]
        .some((value) => String(value || "").toLowerCase().includes(q))
    );
  }, [books, search]);

  const available = books.reduce((sum, b) => sum + (Number(b.availableCopies) || 0), 0);
  const total = books.reduce((sum, b) => sum + (Number(b.totalCopies) || 0), 0);
  const issued = Math.max(total - available, 0);
  const categories = new Set(books.map((b) => b.category).filter(Boolean)).size;

  return (
    <div className="library-page">
      <section className="page-hero">
        <div>
          <span className="page-kicker">COLLECTION • LIBRA</span>
          <h1>Books Management</h1>
          <p>Add, update, search and organize your library collection.</p>
        </div>
        <div className="page-hero-actions">
          <span className="page-count">{books.length} TITLES</span>
        </div>
      </section>

      <section className="neon-grid">
        <div className="mini-stat"><span>TITLES</span><strong>{books.length}</strong><small>Unique books</small></div>
        <div className="mini-stat"><span>TOTAL COPIES</span><strong>{total}</strong><small>In collection</small></div>
        <div className="mini-stat"><span>AVAILABLE</span><strong>{available}</strong><small>Ready to issue</small></div>
        <div className="mini-stat"><span>CATEGORIES</span><strong>{categories}</strong><small>{issued} copies issued</small></div>
      </section>

      <section className="neon-panel">
        <div className="panel-title">
          <div>
            <h2>{editId ? "Update Book" : "Add New Book"}</h2>
            <p>{editId ? "Modify the selected book record." : "Create a new book record for the collection."}</p>
          </div>
          {editId && <span className="badge purple">EDITING RECORD</span>}
        </div>
        <form className="neon-form" onSubmit={handleSubmit}>
          <div className="form-grid three">
            <div className="form-field"><label>Book Title</label><input name="title" value={book.title} onChange={handleChange} required /></div>
            <div className="form-field"><label>Author</label><input name="author" value={book.author} onChange={handleChange} required /></div>
            <div className="form-field"><label>Publisher</label><input name="publisher" value={book.publisher} onChange={handleChange} required /></div>
            <div className="form-field"><label>ISBN</label><input name="isbn" value={book.isbn} onChange={handleChange} required /></div>
            <div className="form-field"><label>Category</label><input name="category" value={book.category} onChange={handleChange} required /></div>
            <div className="form-field"><label>Total Copies</label><input type="number" min="0" name="totalCopies" value={book.totalCopies} onChange={handleChange} required /></div>
            <div className="form-field"><label>Available Copies</label><input type="number" min="0" name="availableCopies" value={book.availableCopies} onChange={handleChange} required /></div>
          </div>
          <div className="form-actions">
            <button className="neon-btn" type="submit">{editId ? "Update Book" : "Save Book"}</button>
            {editId && <button className="neon-btn secondary" type="button" onClick={() => { setBook(emptyBook); setEditId(null); }}>Cancel</button>}
          </div>
        </form>
      </section>

      <section className="neon-panel">
        <div className="panel-title">
          <div><h2>Books List</h2><p>Live collection records from the database.</p></div>
          <div className="table-tools"><div className="search-box"><input placeholder="Search title, author, ISBN..." value={search} onChange={(e) => setSearch(e.target.value)} /></div></div>
        </div>
        <div className="table-wrap">
          <table className="neon-table">
            <thead><tr><th>#</th><th>BOOK</th><th>AUTHOR</th><th>PUBLISHER</th><th>ISBN</th><th>CATEGORY</th><th>TOTAL</th><th>AVAILABLE</th><th>ACTIONS</th></tr></thead>
            <tbody>
              {filteredBooks.length === 0 ? (
                <tr><td colSpan="9"><div className="table-empty"><div className="empty-icon">📚</div><h3>No Books Found</h3><p>Add a book or change your search.</p></div></td></tr>
              ) : filteredBooks.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td><div className="book-title-cell"><div className="row-icon">📖</div><strong>{item.title}</strong></div></td>
                  <td>{item.author}</td><td>{item.publisher}</td><td>{item.isbn}</td><td><span className="badge purple">{item.category}</span></td>
                  <td>{item.totalCopies}</td><td><span className={`badge ${Number(item.availableCopies) > 0 ? "green" : "red"}`}>{item.availableCopies}</span></td>
                  <td><button className="neon-btn small orange" onClick={() => editBook(item)}>Edit</button>{" "}<button className="neon-btn small danger" onClick={() => deleteBook(item._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default ViewBooks;
