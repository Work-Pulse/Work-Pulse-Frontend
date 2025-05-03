import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import bg from "../../assets/images/bg.png";
import axios from "axios";
import Swal from 'sweetalert2'

const LeaveRequestForm = () => {
  const navigate = useNavigate();
  const [officeMail, setOfficeMail] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState({
    firstName: '',
    lastName: '',
    designation: '',
    department: '',
  });

  const auth = getAuth();

  // Updated Form state
  const [formData, setFormData] = useState({
    firstName: "",
    officeMail: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    leaveTime: "",
  });

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
              id: response.data.id || 0,
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

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (officeMail) {
      setFormData((prev) => ({ ...prev, officeMail }));
    }
  }, [officeMail]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (startDate < today || endDate < today) {
      Swal.fire({
        icon: 'warning',
        title: 'Start Date and End Date must be today or a future date.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f1c40f'  // a warning‐style color, but you can customize this
      });
      return;
    }

    if (endDate < startDate) {
      Swal.fire({
        title: 'End Date cannot be earlier than Start Date.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f1c40f'  // any valid CSS color
      })
      return;
    }

    // Include the firstName in the form data
    const requestData = {
      ...formData,
      firstName: employeeData.firstName, // Add firstName here
    };

    axios.post("http://localhost:3030/leave/leaves", requestData)
      .then((res) => {
        console.log("Success:", res.data);
        Swal.fire({
          title: 'Leave Added Successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#4CAF50'  // any valid CSS color
        })
        navigate("/leavedashboard");
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Submit failed");
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Back Button */}
      <Link to="/leavedashboard" className="absolute top-6 left-6">
        <button className="flex items-center gap-2 text-text text-xl font-extrabold p-3 bg-red-500 rounded-lg hover:text-reject transition duration-300">
          <FaArrowLeft size={20} /> Back
        </button>
      </Link>

      <div className="bg-[#C6D2D5] p-8 rounded-2xl shadow-xl w-full max-w-3xl">
        <h1 className="text-center text-[#122D3B] text-3xl font-bold mb-2">Leave Request Form</h1>

        {/* Employee Name */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <label className="font-medium mb-5 text-[#122D3B]">
              Name : {employeeData.firstName} {employeeData.lastName}
            </label>

            <label className="font-medium mb-5 text-[#122D3B]">
              My Office Mail : {officeMail}
            </label>

            {/* Leave Type */}
            <label className="font-medium text-[#122D3B]">
              Leave Reason
              <input
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                required
              />
                
            </label>

            {/* End Date */}
            <label className="font-medium text-[#122D3B]">
              End Date
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                required
              />
            </label>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            {/* Start Date */}
            <label className="font-medium text-[#122D3B]">
              Start Date
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                required
              />
            </label>

            {/* Leave Time */}
            {formData.leaveType === "Half Day" && (
              <div className="col-span-2">
                <label className="font-medium text-[#122D3B]">
                  Leave Time
                  <input
                    type="time"
                    name="leaveTime"
                    value={formData.leaveTime}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="col-span-2">
            <button
              type="submit"
              className="text-white text-lg font-semibold p-3 bg-[#122D3B] rounded-lg hover:bg-white hover:text-[#122D3B] transition duration-300 w-full"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default LeaveRequestForm;
