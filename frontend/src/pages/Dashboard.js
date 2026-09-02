import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "./Dashboard.css";

function Dashboard() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("library-theme") === "dark"
  );

  const [dashboard, setDashboard] = useState({
    totalBooks: 0,
    totalStudents: 0,
    issuedBooks: 0,
    availableBooks: 0,
  });

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
    loadIssues();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "library-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const loadDashboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard`);

      if (response.data?.data) {
        setDashboard(response.data.data);
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  const loadIssues = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/issues`);

      setIssues(response.data?.data || []);
    } catch (error) {
      console.error("Issues error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalBooks = Number(dashboard.totalBooks) || 0;
  const availableBooks = Number(dashboard.availableBooks) || 0;
  const issuedBooks = Number(dashboard.issuedBooks) || 0;
  const totalStudents = Number(dashboard.totalStudents) || 0;

  const availability =
    totalBooks > 0
      ? Math.round((availableBooks / totalBooks) * 100)
      : 0;

  const formatDate = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStudentName = (issue) =>
    issue?.student?.name ||
    issue?.studentName ||
    issue?.studentId?.name ||
    "Student";

  const getBookName = (issue) =>
    issue?.book?.title ||
    issue?.bookTitle ||
    issue?.bookId?.title ||
    "Library Book";

  const getInitial = (name) =>
    name ? name.charAt(0).toUpperCase() : "S";

  const getStatus = (issue) => {
    if (issue?.status === "Returned") {
      return <span className="status returned">✓ Returned</span>;
    }

    if (
      issue?.dueDate &&
      new Date(issue.dueDate) < new Date()
    ) {
      return <span className="status overdue">! Overdue</span>;
    }

    return <span className="status issued">● Issued</span>;
  };

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>

      {/* TOP BAR */}
      <div className="dashboard-topbar">
        <div className="brand-mini">
          <div className="brand-logo">L</div>
          <div>
            <strong>LIBRARY</strong>
            <span>Library Management</span>
          </div>
        </div>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          <span className="theme-icon">{darkMode ? "☀️" : "🌙"}</span>
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>

      {/* HERO */}

      <section className="hero-section">

        <div className="hero-orb orb-one"></div>
        <div className="hero-orb orb-two"></div>

        <div className="hero-content">

          <div className="welcome-pill">
            <span></span>
            LIBRARY MANAGEMENT SYSTEM
          </div>

          <h1>
            Welcome back,
            <br />
            <span>Librarian</span>
          </h1>

          <p>
            Manage your books, students and transactions
            <br />
            from one intelligent workspace.
          </p>

          <div className="hero-buttons">

            <Link to="/books" className="primary-btn">
              📚 Explore Books
              <b>→</b>
            </Link>

            <Link to="/issue-book" className="outline-btn">
              Issue Book
            </Link>

          </div>

        </div>


        {/* BOOK ILLUSTRATION */}

        <div className="hero-books">

          <div className="book-shadow"></div>

          <div className="floating-book book-a">
            <span>READ</span>
          </div>

          <div className="floating-book book-b">
            <span>LEARN</span>
          </div>

          <div className="floating-book book-c">
            <span>GROW</span>
          </div>

          <div className="floating-info info-one">
            <div>📚</div>
            <section>
              <strong>{totalBooks}</strong>
              <small>Total Books</small>
            </section>
          </div>

          <div className="floating-info info-two">
            <div className="success-icon">✓</div>
            <section>
              <strong>{availableBooks}</strong>
              <small>Available</small>
            </section>
          </div>

        </div>

      </section>


      {/* STATS */}

      <section className="stats-section">

        <div className="section-heading">

          <div>
            <span>OVERVIEW</span>
            <h2>Library Statistics</h2>
          </div>

          <div className="live">
            <i></i>
            Live
          </div>

        </div>


        <div className="stats-grid">

          <div className="stat-card purple">

            <div className="stat-top">
              <div className="stat-icon">📚</div>
              <span>01</span>
            </div>

            <small>TOTAL BOOKS</small>

            <h3>{totalBooks}</h3>

            <div className="stat-bottom">
              <span>Collection</span>
              <b>↗</b>
            </div>

          </div>


          <div className="stat-card green">

            <div className="stat-top">
              <div className="stat-icon">👥</div>
              <span>02</span>
            </div>

            <small>TOTAL STUDENTS</small>

            <h3>{totalStudents}</h3>

            <div className="stat-bottom">
              <span>Members</span>
              <b>↗</b>
            </div>

          </div>


          <div className="stat-card orange">

            <div className="stat-top">
              <div className="stat-icon">📖</div>
              <span>03</span>
            </div>

            <small>ISSUED BOOKS</small>

            <h3>{issuedBooks}</h3>

            <div className="stat-bottom">
              <span>Borrowed</span>
              <b>●</b>
            </div>

          </div>


          <div className="stat-card blue">

            <div className="stat-top">
              <div className="stat-icon">✓</div>
              <span>04</span>
            </div>

            <small>AVAILABLE BOOKS</small>

            <h3>{availableBooks}</h3>

            <div className="stat-bottom">
              <span>Ready to issue</span>
              <b>✓</b>
            </div>

          </div>

        </div>

      </section>


      {/* CONTENT */}

      <section className="main-grid">

        {/* RECENT ACTIVITY */}

        <div className="glass-panel activity">

          <div className="panel-header">

            <div>
              <span>TRANSACTIONS</span>
              <h2>Recent Activity</h2>
              <p>Latest library transactions</p>
            </div>

            <Link to="/issue-book">
              View all →
            </Link>

          </div>


          <div className="activity-head">
            <span>MEMBER</span>
            <span>BOOK</span>
            <span>DATE</span>
            <span>STATUS</span>
          </div>


          {loading ? (

            <div className="loading">
              <div className="loader"></div>
              Loading transactions...
            </div>

          ) : issues.length === 0 ? (

            <div className="no-data">

              <div>📚</div>

              <h3>No transactions yet</h3>

              <p>
                Your recent book activity will appear here.
              </p>

              <Link to="/issue-book">
                Issue a Book
              </Link>

            </div>

          ) : (

            issues.slice(0, 5).map((issue) => {

              const studentName =
                getStudentName(issue);

              return (
                <div
                  className="activity-row"
                  key={issue._id}
                >

                  <div className="member">

                    <div className="avatar">
                      {getInitial(studentName)}
                    </div>

                    <div>
                      <strong>{studentName}</strong>
                      <small>Library Member</small>
                    </div>

                  </div>


                  <div className="book-name">
                    📕
                    <span>
                      {getBookName(issue)}
                    </span>
                  </div>


                  <span className="date">
                    {formatDate(
                      issue.issueDate ||
                      issue.createdAt
                    )}
                  </span>


                  {getStatus(issue)}

                </div>
              );
            })

          )}

        </div>


        {/* QUICK ACTIONS */}

        <div className="glass-panel quick">

          <div className="panel-header">

            <div>
              <span>SHORTCUTS</span>
              <h2>Quick Actions</h2>
              <p>Frequently used tools</p>
            </div>

            <div className="magic">✦</div>

          </div>


          <div className="quick-list">

            <Link to="/books">

              <div className="quick-icon purple-bg">
                📚
              </div>

              <section>
                <strong>Manage Books</strong>
                <small>
                  Add and organize books
                </small>
              </section>

              <b>→</b>

            </Link>


            <Link to="/student">

              <div className="quick-icon green-bg">
                👨‍🎓
              </div>

              <section>
                <strong>Manage Students</strong>
                <small>
                  View student records
                </small>
              </section>

              <b>→</b>

            </Link>


            <Link to="/issue-book">

              <div className="quick-icon orange-bg">
                📖
              </div>

              <section>
                <strong>Issue a Book</strong>
                <small>
                  Create new transaction
                </small>
              </section>

              <b>→</b>

            </Link>


            <Link to="/issue-book">

              <div className="quick-icon blue-bg">
                ↩
              </div>

              <section>
                <strong>Return a Book</strong>
                <small>
                  Process book return
                </small>
              </section>

              <b>→</b>

            </Link>

          </div>

        </div>

      </section>


      {/* BOTTOM */}

      <section className="bottom-grid">

        {/* AVAILABILITY */}

        <div className="glass-panel availability">

          <div className="panel-header">

            <div>
              <span>COLLECTION</span>
              <h2>Book Availability</h2>
              <p>Current collection status</p>
            </div>

          </div>


          <div className="availability-content">

            <div
              className="donut"
              style={{
                "--percent": `${availability}%`,
              }}
            >

              <div>
                <strong>{availability}%</strong>
                <span>Available</span>
              </div>

            </div>


            <div className="availability-list">

              <div>
                <span>
                  <i className="dot green-dot"></i>
                  Available
                </span>

                <b>{availableBooks}</b>
              </div>

              <div>
                <span>
                  <i className="dot orange-dot"></i>
                  Issued
                </span>

                <b>{issuedBooks}</b>
              </div>

              <div>
                <span>
                  <i className="dot purple-dot"></i>
                  Total
                </span>

                <b>{totalBooks}</b>
              </div>

            </div>

          </div>

        </div>


        {/* MOTIVATION CARD */}

        <div className="quote-card">

          <div className="quote-decoration">“</div>

          <div className="quote-content">

            <span>LIBRARY • DIGITAL LIBRARY</span>

            <h2>
              Every book opens
              <br />
              a <em>new world.</em>
            </h2>

            <p>
              Organize knowledge. Empower students.
              Build a smarter library.
            </p>

            <Link to="/books">
              Explore Collection →
            </Link>

          </div>

          <div className="quote-books">
            📚
          </div>

        </div>

      </section>


      <footer>
        <span>© 2026 Library Management</span>
        <span>Smart • Simple • Organized</span>
      </footer>

    </div>
  );
}

export default Dashboard;