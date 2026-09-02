import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import "./LibraryPage.css";

const API = `${API_BASE_URL}/students`;

function Students() {
  const emptyStudent = { rollNo:"", name:"", gender:"", department:"", year:"", section:"", email:"", phone:"", address:"", status:"Active" };
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState(emptyStudent);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try { const res = await axios.get(API); setStudents(res.data?.data || []); }
    catch (err) { console.error("Students error:", err); }
  };

  const handleChange = (e) => setStudent({ ...student, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await axios.put(`${API}/${editId}`, student); alert("Student Updated Successfully"); }
      else { await axios.post(API, student); alert("Student Added Successfully"); }
      setStudent(emptyStudent); setEditId(null); fetchStudents();
    } catch (error) { alert(error.response?.data?.message || "Unable to save student"); }
  };

  const editStudent = (data) => {
    setStudent({ ...emptyStudent, ...data }); setEditId(data._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try { await axios.delete(`${API}/${id}`); alert("Student Deleted Successfully"); fetchStudents(); }
    catch (error) { alert(error.response?.data?.message || "Delete Failed"); }
  };

  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return students;
    return students.filter((s) => [s.name,s.rollNo,s.department,s.email,s.phone].some(v => String(v || "").toLowerCase().includes(q)));
  }, [students, search]);

  const active = students.filter(s => s.status === "Active").length;
  const departments = new Set(students.map(s => s.department).filter(Boolean)).size;
  const years = new Set(students.map(s => s.year).filter(Boolean)).size;

  return (
    <div className="library-page">
      <section className="page-hero">
        <div><span className="page-kicker">MEMBERS • LIBRA</span><h1>Students Management</h1><p>Manage student profiles and library membership records.</p></div>
        <div className="page-hero-actions"><span className="page-count">{students.length} MEMBERS</span></div>
      </section>

      <section className="neon-grid">
        <div className="mini-stat"><span>TOTAL STUDENTS</span><strong>{students.length}</strong><small>Registered members</small></div>
        <div className="mini-stat"><span>ACTIVE</span><strong>{active}</strong><small>Current members</small></div>
        <div className="mini-stat"><span>DEPARTMENTS</span><strong>{departments}</strong><small>Academic groups</small></div>
        <div className="mini-stat"><span>YEARS</span><strong>{years}</strong><small>Year groups</small></div>
      </section>

      <section className="neon-panel">
        <div className="panel-title"><div><h2>{editId ? "Update Student" : "Add Student"}</h2><p>{editId ? "Modify the selected member record." : "Register a new library member."}</p></div>{editId && <span className="badge purple">EDITING RECORD</span>}</div>
        <form className="neon-form" onSubmit={handleSubmit}>
          <div className="form-grid three">
            <div className="form-field"><label>Roll Number</label><input name="rollNo" value={student.rollNo} onChange={handleChange} required /></div>
            <div className="form-field"><label>Student Name</label><input name="name" value={student.name} onChange={handleChange} required /></div>
            <div className="form-field"><label>Gender</label><select name="gender" value={student.gender} onChange={handleChange} required><option value="">Select Gender</option><option>Male</option><option>Female</option><option>Other</option></select></div>
            <div className="form-field"><label>Department</label><input name="department" value={student.department} onChange={handleChange} required /></div>
            <div className="form-field"><label>Year</label><select name="year" value={student.year} onChange={handleChange} required><option value="">Select Year</option><option value="1">1 Year</option><option value="2">2 Year</option><option value="3">3 Year</option><option value="4">4 Year</option></select></div>
            <div className="form-field"><label>Section</label><input name="section" value={student.section} onChange={handleChange} required /></div>
            <div className="form-field"><label>Email</label><input type="email" name="email" value={student.email} onChange={handleChange} required /></div>
            <div className="form-field"><label>Phone</label><input name="phone" value={student.phone} onChange={handleChange} required /></div>
            <div className="form-field full"><label>Address</label><textarea name="address" value={student.address} onChange={handleChange} required /></div>
          </div>
          <div className="form-actions"><button className="neon-btn" type="submit">{editId ? "Update Student" : "Save Student"}</button>{editId && <button className="neon-btn secondary" type="button" onClick={() => { setStudent(emptyStudent); setEditId(null); }}>Cancel</button>}</div>
        </form>
      </section>

      <section className="neon-panel">
        <div className="panel-title"><div><h2>Students List</h2><p>Live member records from the database.</p></div><div className="table-tools"><div className="search-box"><input placeholder="Search name, roll no, department..." value={search} onChange={(e) => setSearch(e.target.value)} /></div></div></div>
        <div className="table-wrap">
          <table className="neon-table">
            <thead><tr><th>#</th><th>MEMBER</th><th>ROLL NO</th><th>DEPARTMENT</th><th>YEAR</th><th>SECTION</th><th>EMAIL</th><th>PHONE</th><th>STATUS</th><th>ACTIONS</th></tr></thead>
            <tbody>
              {filteredStudents.length === 0 ? <tr><td colSpan="10"><div className="table-empty"><div className="empty-icon">👨‍🎓</div><h3>No Students Found</h3><p>Add a student or change your search.</p></div></td></tr> : filteredStudents.map((item,index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td><div className="student-cell"><div className="avatar-mini">{String(item.name || "S").charAt(0).toUpperCase()}</div><strong>{item.name}</strong></div></td>
                  <td>{item.rollNo}</td><td>{item.department}</td><td>{item.year}</td><td>{item.section}</td><td>{item.email}</td><td>{item.phone}</td>
                  <td><span className={`badge ${item.status === "Active" ? "green" : "orange"}`}>{item.status || "Active"}</span></td>
                  <td><button className="neon-btn small orange" onClick={() => editStudent(item)}>Edit</button>{" "}<button className="neon-btn small danger" onClick={() => deleteStudent(item._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Students;
