
import { Link,useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaSave, FaPlus, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import bg from "../../assets/images/bg.png";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeDetails = () => {
  const navigate = useNavigate();
  const [officeMail, setOfficeMail] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState({
      id: 0, 
      firstName:'',
      lastName:'',
      officeMail:'',
      personalMail:'',
      officePhone:'',
      personalPhone:'',
      joinDate:'',
      birthday:'',
      address:'',
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

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setOfficeMail(firebaseUser.email);
        // Get Firebase ID Token
        const token = await firebaseUser.getIdToken();

        // Fetch employee data after setting officeMail
        if (firebaseUser.email) {
          try {
            const response = await axios.get(
              `http://localhost:3030/employee/employee/data/${firebaseUser.email}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,  
                },
              }
            );
            // Assuming the API response has an 'id' field
            setEmployeeData({
              ...response.data,
              id: response.data.id ,  
            });
          } catch (error) {
            console.error('Error fetching employee data:', error);
          }
        }
      } else {
        navigate('/employeelogin'); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);


  //Handle input changes
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
   };

  
  };

  // Add a new note
  const handleAddNote = () => {
    if (noteText.trim() !== "") {
      setNotes([...notes, noteText]);
      setNoteText(""); // Clear input field
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
        <button className="flex items-center gap-2 text-white text-lg font-semibold p-3 bg-red-600 rounded-lg hover:bg-red-700 transition duration-300">
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
                <label className="font-medium text-[#122D3B]">First Name:</label>
                <input type="text" name="firstName" value={employeeData.firstName} onChange={handleChange} disabled={!isEditing} className="p-3 rounded-lg w-full" />

                <label className="font-medium text-[#122D3B]">Office Email:</label>
                <input type="email" name="officeMail" value={employeeData.officeMail} onChange={handleChange} disabled={!isEditing} className="p-3 rounded-lg w-full" />

                <label className="font-medium text-[#122D3B]">Birthday:</label>
                <input type="date" name="birthday" value={employeeData.birthday} onChange={handleChange} disabled={!isEditing} className="p-3 rounded-lg w-full" />
                
                <label className="font-medium text-[#122D3B]">Office Phone:</label>
                <input type="tel" name="officePhone" value={employeeData.officePhone} onChange={handleChange} disabled={!isEditing} className="p-3 rounded-lg w-full" />

              </div>

              <div className="flex flex-col gap-4">

                <label className="font-medium text-[#122D3B]">Last Name:</label>
                <input type="text" name="lastName" value={employeeData.lastName} onChange={handleChange} disabled={!isEditing} className="p-3 rounded-lg w-full" />
              
                <label className="font-medium text-[#122D3B]">Personal Email:</label>
                <input type="text" name="personalMail" value={employeeData.personalMail} onChange={handleChange} disabled={!isEditing} className="p-3 rounded-lg w-full" />

                <label className="font-medium text-[#122D3B]">Join Date:</label>
                <input type="date" name="joinDate" value={employeeData.joinDate} onChange={handleChange} disabled={!isEditing} className="p-3 rounded-lg w-full" />
                                             
                <label className="font-medium text-[#122D3B]">Personal Phone:</label>
                <input type="tel" name="personalPhone" value={employeeData.personalPhone} onChange={handleChange} disabled={!isEditing} className="p-3 rounded-lg w-full" />
                
                
              </div>
              {/* Address Field */}
                <div className="col-span-2">
                  <label className="font-medium text-[#122D3B]">Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={employeeData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="p-3 rounded-lg w-full"
                  />
                </div>
                {officeMail && (
              <div className="text-text mb-1 opacity-50">
                <p>Logged in as: {officeMail}</p>
              </div>
                )}
            </div>
           

            <div className="flex justify-center mt-6">
            <button
                  onClick={() => {
                    if (isEditing) {
                      handleSave(); // Save the changes
                    } else {
                      setIsEditing(true); // Enable editing mode
                    }
                  }}
                  className="flex items-center gap-2 bg-[#122D3B] text-white px-8 py-2 rounded-lg hover:bg-[#0e1f2c] transition"
                >
                  {isEditing ? <><FaSave size={18} /> Save</> : <><FaEdit size={18} /> Edit</>}
                </button>

            </div>
          </div>

          {/* Add Note Section */}
          <div className="bg-[#C6D2D5] p-6 rounded-2xl shadow-lg w-full mt-6">
            <h3 className="text-[#122D3B] text-2xl font-semibold mb-4">Add Note</h3>
            <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Write a note..." className="w-full p-3 rounded-lg border border-gray-300"></textarea>
            <button onClick={handleAddNote} className="flex items-center gap-2 bg-[#122D3B] text-white px-6 py-2 rounded-lg mt-4 hover:bg-[#0e1f2c] transition">
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
                <span className={task.completed ? "line-through text-gray-500" : ""}>{task.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeDetails;