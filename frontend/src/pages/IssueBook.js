import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import "./LibraryPage.css";

const BOOK_API = `${API_BASE_URL}/books`;
const STUDENT_API = `${API_BASE_URL}/students`;
const ISSUE_API = `${API_BASE_URL}/issues`;

function IssueBook() {
  const emptyIssue = { student: "", book: "", dueDate: "" };

  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [issues, setIssues] = useState([]);
  const [issue, setIssue] = useState(emptyIssue);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBooks();
    fetchStudents();
    fetchIssues();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(BOOK_API);
      setBooks(res.data?.data || []);
    } catch (err) {
      console.error("Books error:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(STUDENT_API);
      setStudents(res.data?.data || []);
    } catch (err) {
      console.error("Students error:", err);
    }
  };

  const fetchIssues = async () => {
    try {
      const res = await axios.get(ISSUE_API);
      setIssues(res.data?.data || []);
    } catch (err) {
      console.error("Issues error:", err);
    }
  };

  const handleChange = (e) => {
    setIssue({
      ...issue,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(ISSUE_API, issue);

      alert(response.data.message);

      setIssue(emptyIssue);

      await Promise.all([
        fetchBooks(),
        fetchIssues()
      ]);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to issue book"
      );
    }
  };

  const returnBook = async (id) => {
    if (!window.confirm("Mark this book as returned?")) return;

    try {
      const response = await axios.put(`${ISSUE_API}/${id}`);

      alert(response.data.message);

      await Promise.all([
        fetchBooks(),
        fetchIssues()
      ]);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to return book"
      );
    }
  };

  const deleteIssue = async (id) => {
    if (!window.confirm("Delete this issue record?")) return;

    try {
      await axios.delete(`${ISSUE_API}/${id}`);

      alert("Issue Record Deleted");

      fetchIssues();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Delete Failed"
      );
    }
  };

  const filteredIssues = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return issues;

    return issues.filter((item) =>
      [
        item.student?.name,
        item.student?.rollNo,
        item.book?.title,
        item.status
      ].some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q)
      )
    );
  }, [issues, search]);

  const activeIssues = issues.filter(
    (i) => i.status === "Issued"
  ).length;

  const returnedIssues = issues.filter(
    (i) => i.status === "Returned"
  ).length;

  const availableBooks = books.reduce(
    (sum, b) =>
      sum + (Number(b.availableCopies) || 0),
    0
  );

  const totalFine = issues.reduce(
    (sum, item) =>
      sum + (Number(item.fine) || 0),
    0
  );

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        })
      : "--";

  const isOverdue = (item) => {
    if (
      item.status !== "Issued" ||
      !item.dueDate
    ) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(item.dueDate);
    due.setHours(0, 0, 0, 0);

    return today > due;
  };

  return (
    <div className="library-page">

      {/* HERO */}
      <section className="page-hero">

        <div>
          <span className="page-kicker">
            TRANSACTIONS • LIBRA
          </span>

          <h1>Issue & Return</h1>

          <p>
            Issue books, process returns and track
            every library transaction.
          </p>
        </div>

        <div className="page-hero-actions">
          <span className="page-count">
            {activeIssues} ACTIVE
          </span>
        </div>

      </section>


      {/* STATISTICS */}
      <section className="neon-grid">

        <div className="mini-stat">
          <span>ACTIVE ISSUES</span>
          <strong>{activeIssues}</strong>
          <small>Currently borrowed</small>
        </div>

        <div className="mini-stat">
          <span>RETURNED</span>
          <strong>{returnedIssues}</strong>
          <small>Completed transactions</small>
        </div>

        <div className="mini-stat">
          <span>TRANSACTIONS</span>
          <strong>{issues.length}</strong>
          <small>Total records</small>
        </div>

        <div className="mini-stat">
          <span>AVAILABLE</span>
          <strong>{availableBooks}</strong>
          <small>Copies ready to issue</small>
        </div>

      </section>


      {/* ISSUE BOOK */}
      <section className="neon-panel">

        <div className="panel-title">

          <div>
            <h2>Issue New Book</h2>

            <p>
              Select a member, choose an available
              book and set the due date.
            </p>
          </div>

          <span className="badge purple">
            NEW TRANSACTION
          </span>

        </div>


        <form
          className="neon-form"
          onSubmit={handleSubmit}
        >

          <div className="form-grid three">

            <div className="form-field">

              <label>Select Student</label>

              <select
                name="student"
                value={issue.student}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Student
                </option>

                {students.map((s) => (
                  <option
                    key={s._id}
                    value={s._id}
                  >
                    {s.rollNo} — {s.name}
                  </option>
                ))}

              </select>

            </div>


            <div className="form-field">

              <label>Select Book</label>

              <select
                name="book"
                value={issue.book}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Book
                </option>

                {books.map((b) => (
                  <option
                    key={b._id}
                    value={b._id}
                    disabled={
                      Number(b.availableCopies) <= 0
                    }
                  >
                    {b.title} — Available:{" "}
                    {b.availableCopies}
                  </option>
                ))}

              </select>

            </div>


            <div className="form-field">

              <label>Due Date</label>

              <input
                type="date"
                name="dueDate"
                value={issue.dueDate}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          <div className="form-actions">

            <button
              className="neon-btn green"
              type="submit"
            >
              Issue Book →
            </button>

          </div>

        </form>

      </section>


      {/* TRANSACTION HISTORY */}
      <section className="neon-panel">

        <div className="panel-title">

          <div>
            <h2>Transaction History</h2>

            <p>
              Latest issue and return activity.
            </p>
          </div>


          <div className="table-tools">

            <div className="search-box">

              <input
                placeholder="Search student, roll no, book..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>

        </div>


        <div className="table-wrap">

          <table className="neon-table">

            <thead>

              <tr>
                <th>#</th>
                <th>MEMBER</th>
                <th>ROLL NO</th>
                <th>BOOK</th>
                <th>ISSUE DATE</th>
                <th>DUE DATE</th>
                <th>STATUS</th>
                <th>FINE</th>
                <th>ACTIONS</th>
              </tr>

            </thead>


            <tbody>

              {filteredIssues.length === 0 ? (

                <tr>

                  <td colSpan="9">

                    <div className="table-empty">

                      <div className="empty-icon">
                        📖
                      </div>

                      <h3>
                        No Transactions Found
                      </h3>

                      <p>
                        Your issue and return
                        activity will appear here.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredIssues.map(
                  (item, index) => (

                    <tr key={item._id}>

                      <td>
                        {index + 1}
                      </td>


                      <td>

                        <div className="student-cell">

                          <div className="avatar-mini">

                            {String(
                              item.student?.name ||
                              "S"
                            )
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <strong>
                            {item.student?.name ||
                              "Student"}
                          </strong>

                        </div>

                      </td>


                      <td>
                        {item.student?.rollNo ||
                          "--"}
                      </td>


                      <td>
                        <strong>
                          {item.book?.title ||
                            "Library Book"}
                        </strong>
                      </td>


                      <td>
                        {formatDate(
                          item.issueDate
                        )}
                      </td>


                      <td>
                        {formatDate(
                          item.dueDate
                        )}
                      </td>


                      <td>

                        {item.status ===
                        "Returned" ? (

                          <span className="badge green">
                            ✓ Returned
                          </span>

                        ) : isOverdue(item) ? (

                          <span className="badge red">
                            ! Overdue
                          </span>

                        ) : (

                          <span className="badge purple">
                            ● Issued
                          </span>

                        )}

                      </td>


                      {/* FINE */}
                      <td>

                        {Number(item.fine) > 0 ? (

                          <span className="badge red">
                            ₹{item.fine}
                          </span>

                        ) : (

                          <span className="badge green">
                            ₹0
                          </span>

                        )}

                      </td>


                      {/* ACTIONS */}
                      <td>

                        {item.status ===
                          "Issued" && (

                          <button
                            className="neon-btn small green"
                            onClick={() =>
                              returnBook(
                                item._id
                              )
                            }
                          >
                            Return
                          </button>

                        )}

                        {" "}

                        <button
                          className="neon-btn small danger"
                          onClick={() =>
                            deleteIssue(
                              item._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

export default IssueBook;