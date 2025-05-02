import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import bg from "../../assets/images/bg.png";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import Swal from 'sweetalert2'

const EmployeeDetails = () => {
  const [officeMail, setOfficeMail] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState<any>(null);

  const [formData, setFormData] = useState({
    designation: "",
    department: "",
    personalMail: "",
    personalPhone: "",
    address: "",
  });

  // Fetch logged-in employee data
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        const token = await firebaseUser.getIdToken();
        setOfficeMail(firebaseUser.email);
        fetchEmployeeData(firebaseUser.email, token);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchEmployeeData = async (email: string, token: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3030/employee/employee/data/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployeeData(response.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    if (employeeData) {
      setFormData({
        designation: employeeData.designation || "",
        department: employeeData.department || "",
        personalMail: employeeData.personalMail || "",
        personalPhone: employeeData.personalPhone || "",
        address: employeeData.address || "",
      });
    }
  }, [employeeData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) return;

    const token = await user.getIdToken();

    try {
      // Update employee details
      await axios.put(
        `http://localhost:3030/employee/employee/update/${user.email}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refetch updated data
      await fetchEmployeeData(user.email, token);
      Swal.fire({
            title: 'Updated Successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#4CAF50'  // any valid CSS color
          })
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const [tasks, setTasks] = useState([
    { text: "Complete project report", completed: false },
    { text: "Attend team meeting", completed: false },
    { text: "Follow up with client", completed: false },
    { text: "Submit weekly timesheet", completed: false },
  ]);

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
      <Link to="/employeedashboard" className="absolute top-6 left-6">
        <button className="flex items-center gap-2 text-text text-lg font-semibold p-3 rounded-lg hover:reject transition duration-300 hover:text-reject">
          <FaArrowLeft size={20} /> Back
        </button>
      </Link>

      <div className="flex gap-6 w-full max-w-6xl">
        <div className="w-2/3">
          <div className="bg-gray bg-opacity-20 p-10 rounded-2xl shadow-xl w-full">
            <h2 className="text-[#122D3B] text-3xl font-bold text-center mb-6">
              Employee Details
            </h2>
            <h2 className="text-[#122D3B] text-xl text-center mb-6">
              Office Mail: <span className="text-reject font-bold">{officeMail || "Loading..."}</span>
            </h2>

            {employeeData && (
              <div className="text-[#122D3B] text-lg space-y-2 font-medium bg-white p-4 rounded-lg">
                <p><b>Name:</b> {employeeData.firstName} {employeeData.lastName}</p>
                <p><b>Designation:</b> {employeeData.designation}</p>
                <p><b>Department:</b> {employeeData.department}</p>
                <p><b>Office Mail:</b> {employeeData.officeMail}</p>
                <p><b>Personal Mail:</b> {employeeData.personalMail}</p>
                <p><b>Office Phone:</b> {employeeData.officePhone}</p>
                <p><b>Personal Phone:</b> {employeeData.personalPhone}</p>
                <p><b>Birthday:</b> {employeeData.birthday ? new Date(employeeData.birthday).toISOString().split("T")[0] : "N/A"}</p>
                <p><b>Join Date:</b> {employeeData.joinDate ? new Date(employeeData.joinDate).toISOString().split("T")[0] : "N/A"}</p>
                <p><b>Address:</b> {employeeData.address}</p>
              </div>
            )}

            <div className="mt-5 mb-5 font-bold">
              <h2>Update Personal Details</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <label className="font-medium text-[#122D3B]">New Designation:</label>
                <input
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="p-3 rounded-lg w-full"
                />
                <label className="font-medium text-[#122D3B]">New Personal Email:</label>
                <input
                  name="personalMail"
                  value={formData.personalMail}
                  onChange={handleChange}
                  className="p-3 rounded-lg w-full"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="font-medium text-[#122D3B]">New Department:</label>
                <input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="p-3 rounded-lg w-full"
                />
                <label className="font-medium text-[#122D3B]">New Personal Phone:</label>
                <input
                  name="personalPhone"
                  value={formData.personalPhone}
                  onChange={handleChange}
                  className="p-3 rounded-lg w-full"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="font-medium text-[#122D3B]">New Address:</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="p-3 rounded-lg w-full"
                />
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 bg-[#122D3B] text-white px-8 py-2 rounded-lg hover:bg-reject transition mr-5"
              >
                <FaEdit size={20} /> Update Personal Details
              </button>
              <button className="flex items-center gap-2 bg-reject text-white px-8 py-2 rounded-lg hover:bg-[#0e1f2c] transition">
                <FaTrash size={20} /> I will resign from this Company
              </button>
            </div>
          </div>
        </div>

        <div className="w-1/3 bg-gray bg-opacity-20 p-6 rounded-2xl shadow-lg">
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
