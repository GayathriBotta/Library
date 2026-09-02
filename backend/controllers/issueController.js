const Issue = require("../models/Issue");
const Book = require("../models/Book");
const Student = require("../models/Student");

const FINE_PER_DAY = 5;

// =======================================
// Issue Book
// =======================================
exports.issueBook = async (req, res) => {
    try {
        const { student, book, dueDate } = req.body;

        // Check Student
        const studentData = await Student.findById(student);

        if (!studentData) {
            return res.status(404).json({
                success: false,
                message: "Student Not Found"
            });
        }

        // Check Book
        const bookData = await Book.findById(book);

        if (!bookData) {
            return res.status(404).json({
                success: false,
                message: "Book Not Found"
            });
        }

        // Check Availability
        if (bookData.availableCopies <= 0) {
            return res.status(400).json({
                success: false,
                message: "Book Not Available"
            });
        }

        // Create Issue Record
        const issue = await Issue.create({
            student,
            book,
            dueDate,
            fine: 0
        });

        // Reduce Available Copies
        bookData.availableCopies -= 1;

        await bookData.save();

        res.status(201).json({
            success: true,
            message: "Book Issued Successfully",
            data: issue
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =======================================
// Get All Issued Books
// =======================================
exports.getIssuedBooks = async (req, res) => {
    try {
        const issues = await Issue.find()
            .populate("student")
            .populate("book")
            .sort({ createdAt: -1 });

        // Calculate current overdue fine for books
        // that are still issued
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const updatedIssues = issues.map(issue => {

            let currentFine = issue.fine || 0;

            if (issue.status === "Issued" && issue.dueDate) {

                const due = new Date(issue.dueDate);
                due.setHours(0, 0, 0, 0);

                if (today > due) {
                    const overdueDays = Math.ceil(
                        (today - due) / (1000 * 60 * 60 * 24)
                    );

                    currentFine = overdueDays * FINE_PER_DAY;
                } else {
                    currentFine = 0;
                }
            }

            return {
                ...issue.toObject(),
                fine: currentFine
            };
        });

        res.status(200).json({
            success: true,
            count: updatedIssues.length,
            data: updatedIssues
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =======================================
// Return Book
// =======================================
exports.returnBook = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue Record Not Found"
            });
        }

        if (issue.status === "Returned") {
            return res.status(400).json({
                success: false,
                message: "Book Already Returned"
            });
        }

        // Calculate fine
        const returnDate = new Date();

        const due = new Date(issue.dueDate);
        due.setHours(0, 0, 0, 0);

        const returned = new Date(returnDate);
        returned.setHours(0, 0, 0, 0);

        let fine = 0;

        if (returned > due) {
            const overdueDays = Math.ceil(
                (returned - due) / (1000 * 60 * 60 * 24)
            );

            fine = overdueDays * FINE_PER_DAY;
        }

        // Update issue
        issue.status = "Returned";
        issue.returnDate = returnDate;
        issue.fine = fine;

        await issue.save();

        // Increase Available Copies
        const book = await Book.findById(issue.book);

        if (book) {
            book.availableCopies += 1;
            await book.save();
        }

        res.status(200).json({
            success: true,
            message: fine > 0
                ? `Book Returned Successfully. Fine: ₹${fine}`
                : "Book Returned Successfully",
            fine: fine
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =======================================
// Delete Issue Record
// =======================================
exports.deleteIssue = async (req, res) => {
    try {
        const issue = await Issue.findByIdAndDelete(req.params.id);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue Record Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Issue Record Deleted"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};