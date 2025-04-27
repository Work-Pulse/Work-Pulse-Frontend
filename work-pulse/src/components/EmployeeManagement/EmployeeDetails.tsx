import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // 👈 useParams to get ID from URL
import { FaArrowLeft, FaEdit, FaSave, FaPlus, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import bg from "../../assets/images/bg.png";
import axios from "axios";

const EmployeeDetails = () => {
const id = localStorage.getItem("employeeId");

const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    joinDate: "",
    birthday: "",
    officeMail: "",
    personalMail: "",
    officePhone: "",
    personalPhone: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [noteText, setNoteText] = useState("");
  const [tasks, setTasks] = useState([
    { text: "Complete project report", completed: false },
    { text: "Attend team meeting", completed: false },
    { text: "Follow up with client", completed: false },
    { text: "Submit weekly timesheet", completed: false },
  ]);

  // Fetch employee details
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3030/employee/employees/${id}`);
        
        setEmployee(res.data.employee); // 👈 IMPORTANT: access `employee` inside response
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };
    fetchEmployeeDetails();
  }, [id]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  // Add a new note
  const handleAddNote = () => {
    if (noteText.trim() !== "") {
      setNotes([...notes, noteText]);
      setNoteText("");
    }
  };

  // Delete a note
  const handleDeleteNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  // Toggle task completion
  const handleToggleTask = (index: number) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex items-start justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Back Button */}
      <Link to="/employeedashboard" className="absolute top-6 left-6">
        <button className="flex items-center gap-2 text-black text-lg font-semibold p-3 bg-black-600 rounded-lg hover:bg-black-700 transition duration-300">
          <FaArrowLeft size={20} /> Back
        </button>
      </Link>

      <div className="flex gap-6 w-full max-w-6xl">
        {/* Left Side - Employee Details & Notes */}
        <div className="w-2/3">
          <div className="bg-[#C6D2D5] p-10 rounded-2xl shadow-xl w-full">
            <h2 className="text-[#122D3B] text-3xl font-bold text-center mb-6">Employee Details</h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <label className="font-bold text-[#122D3B]">First Name:</label>
                <input type="text" name="firstName" value={employee.firstName} onChange={handleChange} disabled={!isEditing} className="p-3 rounded-lg w-full" />

                <label className="font-bold text-[#122D3B]">Office Email:</label>
                <input type="email" name="officeMail" value={employee.officeMail} onChange={handleChange} disabled={!isEditing} className="p-3 rounded-lg w-full" />

                <label className="font-bold text-[#122D3B]">Office Phone:</label>
                <input type="tel" name="officePhone" value={employee.officePhone} onChange={handleChange} disabled={!isEditing} className="p-3 rounded-lg w-full" />
                
                <label className="font-bold text-[#122D3B]">Birthday:</label>
                <input type="date" name="birthday" value={employee.birthday} onChange={handleChange} disabled={!isEditing} className="p-3 rounded-lg w-full" />
               
              </div>

              <div className="flex flex-col gap-4">
                <label className="font-bold text-[#122D3B]">Last Name:</label>
                <input type="text" name="lastName" value={employee.lastName} onChange={handleChange} disabled={!isEditing} className="p-3 rounded-lg w-full" />

                <label className="font-bold text-[#122D3B]">Personal Email:</label>
                <input type="email" name="personalMail" value={employee.personalMail} onChange={handleChange} disabled={!isEditing} className="p-3 rounded-lg w-full" />
                
               
                <label className="font-bold text-[#122D3B]">Personal Phone:</label>
                <input type="tel" name="personalPhone" value={employee.personalPhone} onChange={handleChange} disabled={!isEditing} className="p-3 rounded-lg w-full" />

                {/* <label className="font-bold text-[#122D3B]">Join Date:</label>
                <input type="date" name="joinDate" value={employee.joinDate} onChange={handleChange} disabled={!isEditing} className="p-3 rounded-lg w-full" />
               */}
              </div>

              <div className="col-span-2">
                <label className="font-bold text-[#122D3B]">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={employee.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="p-3 rounded-lg w-full"
                />
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 bg-[#122D3B] text-white px-8 py-2 rounded-lg hover:bg-[#0e1f2c] transition"
              >
                {isEditing ? (
                  <>
                    <FaSave size={18} /> Save
                  </>
                ) : (
                  <>
                    <FaEdit size={18} /> Edit
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Add Note Section */}
          <div className="bg-[#C6D2D5] p-6 rounded-2xl shadow-lg w-full mt-6">
            <h3 className="text-[#122D3B] text-2xl font-semibold mb-4">Add Note</h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write a note..."
              className="w-full p-3 rounded-lg border border-gray-300"
            ></textarea>
            <button
              onClick={handleAddNote}
              className="flex items-center gap-2 bg-[#122D3B] text-white px-6 py-2 rounded-lg mt-4 hover:bg-[#0e1f2c] transition"
            >
              <FaPlus /> Add Note
            </button>

            {/* Notes List */}
            <ul className="mt-4 space-y-2">
              {notes.map((note, index) => (
                <li key={index} className="bg-white p-3 rounded-lg shadow flex justify-between items-center">
                  {note}
                  <button onClick={() => handleDeleteNote(index)} className="text-red-600 hover:text-red-800">
                    <FaTrash size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side - Task List */}
        <div className="w-1/3 bg-[#C6D2D5] p-6 rounded-2xl shadow-lg">
          <h3 className="text-[#122D3B] text-2xl font-semibold mb-4">Task List</h3>
          <ul className="space-y-2">
            {tasks.map((task, index) => (
              <li key={index} className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(index)}
                  className="w-5 h-5"
                />
                <span className={task.completed ? "line-through text-gray-500" : ""}>
                  {task.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeDetails;
