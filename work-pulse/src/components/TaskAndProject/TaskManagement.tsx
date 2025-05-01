import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import bg from "../../assets/images/bg.png";

interface TaskType {
  id?: string; 
  _id?: string; 
  name: string;
  priority: "High" | "Medium" | "Low";
  duration: string;
  description: string;
  deadline: string;
  submitted?: boolean;

}

interface UserTasks {
  [userId: string]: TaskType[];
}

const TaskManager = () => {
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
  const [userTasks, setUserTasks] = useState<UserTasks>({});
  


// Task-related states
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [durationHours, setDurationHours] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [deadline, setDeadline] = useState("");  
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [showSubmit, setShowSubmit] = useState(false);

  // const submitTasks = async () => {
  //   if (!selectedUser) return;

  //   const tasksToSubmit = userTasks[selectedUser.id] || [];

  //   try {
  //     for (const task of tasksToSubmit) {
  //       const response = await fetch("http://localhost:3030/api/add-task", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           userId: selectedUser.id,
  //           userName: selectedUser.name, 
  //           name: task.name,
  //           priority: task.priority,
  //           duration: task.duration,
  //           description: task.description,
  //           deadline: task.deadline,
  //         }),
  //       });

  //       if (!response.ok) {
  //         console.error(`Failed to submit task "${task.name}"`);
  //       }
  //     }

  //     alert("Tasks submitted successfully!");
  //     setUserTasks((prev) => ({
  //       ...prev,
  //       [selectedUser.id]: prev[selectedUser.id].map((task) => ({
  //         ...task,
  //         submitted: true,
  //       })),
  //     }));

  const submitTasks = async () => {
    if (!selectedUser) return;
  
    const tasksToSubmit = userTasks[selectedUser.id] || [];
  
    try {
      const updatedTasks = await Promise.all(
        tasksToSubmit.map(async (task) => {
          // Skip already submitted tasks
          if (task.submitted) return task;
  
          const response = await fetch("http://localhost:3030/api/add-task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: selectedUser.id,
              userName: selectedUser.name,
              name: task.name,
              priority: task.priority,
              duration: task.duration,
              description: task.description,
              deadline: task.deadline,
            }),
          });
  
          if (response.ok) {
            const data = await response.json();
            return {
              ...task,
              _id: data.task._id, // store _id for deletion
              submitted: true,
            };
          } else {
            console.error(`Failed to submit task "${task.name}"`);
            return task;
          }
        })
      );
  
      alert("Tasks submitted successfully!");
  
      // Update userTasks state with the new _id values and submitted status
      setUserTasks((prev) => ({
        ...prev,
        [selectedUser.id]: updatedTasks,
      }));
      
      setShowSubmit(false);
    } catch (error) {
      console.error("Error submitting tasks:", error);
    }
  };

  const addUser = async () => {
    if (!userId.trim() || !userName.trim()) return;
  
    try {
      const response = await fetch("http://localhost:3030/api/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId.trim(), name: userName.trim() }),
      });
  
      const result = await response.json();
      console.log("New User Response:", result);
  
      if (response.ok && result.user) {
        await fetchUsers(); // Refresh the dropdown with all users
        setUserName("");
        setUserId("");
      }
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };
  


  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3030/api/get-users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Fetch users failed:", err);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  

  const selectUser = (id: string, name: string) => {
    setSelectedUser({ id, name });
    fetchTasks(id); // Load their submitted tasks
  };
  

  const fetchTasks = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:3030/api/get-tasks/${userId}`);
      const data = await res.json();
  
      // Add submitted: true to all tasks retrieved from DB
      const submittedTasks = data.map((task: TaskType) => ({
        ...task,
        submitted: true,
      }));
  
      setUserTasks((prev) => ({
        ...prev,
        [userId]: submittedTasks,
      }));
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };
  


  const addTask = () => {
    if (!selectedUser) {
      alert("Please select a user first.");
      return;
    }

    if (!taskName.trim() || (durationHours === "" && durationMinutes === "") || !deadline) {
      alert("Please fill all required task fields.");
      return;
    }

    const newTask: TaskType = {
      id: crypto.randomUUID(),
      name: taskName.trim(),
      priority,
      duration: `${Number(durationHours) || 0}h ${Number(durationMinutes) || 0}m`,
      description: description.trim() || "No description",
      deadline, 

    };

    setUserTasks((prev) => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newTask],
    }));


    setShowSubmit(true);

    // Reset form fields

    // Reset form

    setTaskName("");
    setDescription("");
    setPriority("Medium");
    setDurationHours("");
    setDurationMinutes("");
    setDeadline(""); 
    setShowSubmit(true);

  };

  const deleteTask = async (taskId: string, isSubmitted: boolean) => {
    if (isSubmitted) {
      // delete from backend
      try {
        const res = await fetch(`http://localhost:3030/api/delete-task/${taskId}`, {
          method: "DELETE",
        });
  
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
  
        // Remove from state
        setUserTasks((prev) => {
          const updatedTasks = (prev[selectedUser!.id] || []).filter(
            (task) => (task._id || task.id?.toString()) !== taskId
          );
          return {
            ...prev,
            [selectedUser!.id]: updatedTasks,
          };
        });
      } catch (err: any) {
        alert("Error deleting task: " + err.message);
      }
    } else {
      // delete only from local state
      setUserTasks((prev) => {
        const updatedTasks = (prev[selectedUser!.id] || []).filter(
          (task) => (task._id || task.id?.toString()) !== taskId
        );
        return {
          ...prev,
          [selectedUser!.id]: updatedTasks,
        };
      });
    }
  };
  
    
  useEffect(() => {
    console.log("User Tasks Updated:", userTasks);
  }, [userTasks]);


  // Function to get priority stars

  const getPriorityStars = (priority: "High" | "Medium" | "Low") => {
    return priority === "High" ? "★★★" : priority === "Medium" ? "★★" : "★";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6 overflow-auto"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Link to="/managerdashboard" className="absolute top-2 left-6">
        <button className="flex items-center gap-2 text-text text-xl font-extrabold p-3 bg-red-500 rounded-lg hover:text-reject transition duration-300">
          <FaArrowLeft size={20} /> Back
        </button>
      </Link>

      <div className="text-text text-4xl font-extrabold mb-6">Task Manager</div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-5xl p-6 bg-gray-100 rounded-lg shadow-xl">
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-300">
          <h3 className="text-xl font-bold text-[#122D3B] mb-3">User Information</h3>
          <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} className="w-full p-2 border rounded mb-3 shadow-sm" />
          <input type="text" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full p-2 border rounded mb-3 shadow-sm" />
          <button onClick={addUser} className="w-full p-3 bg-[#122D3B] text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md">Add User</button>
          {users.length > 0 && (
  <div className="mt-4">
    <label className="text-sm font-semibold text-gray-700 mb-1 block">Select User</label>
    <select
      value={selectedUser?.id || ""}
      onChange={(e) => {
        const user = users.find((u) => u.id === e.target.value);
        if (user) setSelectedUser(user);
      }}
      className="w-full p-2 border rounded shadow-sm"
    >
      <option value="">Select a user</option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </select>
  </div>
)}


        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-300">
          <h3 className="text-xl font-bold text-[#122D3B] mb-3">Add New Task</h3>
          <input type="text" placeholder="Task Name" value={taskName} onChange={(e) => setTaskName(e.target.value)} className="w-full p-2 border rounded mb-3 shadow-sm" />
          <textarea placeholder="Task Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded mb-3 h-20 resize-none shadow-sm" />
          <div className="flex gap-3 mb-3">
           <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as "High" | "Medium" | "Low")}
              className="w-1/2 p-2 border rounded"
            >

              <option value="High">High ★★★</option>
              <option value="Medium">Medium ★★</option>
              <option value="Low">Low ★</option>
            </select>

        
            
          <input 
            type="number" 
            placeholder="Hours" 
            value={durationHours} 
            onChange={(e) => setDurationHours(e.target.value)}
            className="w-1/4 p-2 border rounded"
          />
          <input 
            type="number" 
            placeholder="Mins" 
            value={durationMinutes} 
            onChange={(e) => setDurationMinutes(e.target.value)}
            className="w-1/4 p-2 border rounded"
          />        
            
          </div>
          <label className="text-text font-bold">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 border rounded mb-3 shadow-sm"></input>
          <button
            onClick={addTask}
            className="w-full p-3 bg-[#122D3B] text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Add Task
          </button>

        </div>
      </div>

      <div className="w-full max-w-5xl p-6 bg-white rounded-lg shadow-lg border-2 border-gray-300 mt-6 overflow-auto">
        <h3 className="text-xl font-bold text-text mb-3">Task List</h3>
        {selectedUser && userTasks[selectedUser.id]?.length > 0 ? (
          <ul className="space-y-3">
            {userTasks[selectedUser.id].map((task) => (
    <li key={(task._id ?? task.id ?? crypto.randomUUID()).toString()}className="p-3 bg-gray-100 border rounded-lg flex justify-between items-center">
      <div>
        <p className="font-bold flex items-center gap-2">
          {task.name} {getPriorityStars(task.priority)}
          {task.submitted && (
            <span className="text-green-600 text-sm font-semibold bg-green-100 px-2 py-1 rounded">
              Submitted
            </span>
          )}
        </p>
        <p className="text-gray-600 font-semibold">Priority: {task.priority}</p>
        <p className="text-gray-600 font-semibold">Duration: {task.duration}</p>
        <p className="text-gray-600 font-semibold">Deadline: {task.deadline}</p>
      </div>
     
      <button
        onClick={() => {
          const taskIdToDelete = task._id || task.id?.toString();
        
          if (!taskIdToDelete) {
            alert("Task ID not found. Cannot delete.");
            return;
          }
        
          const isSubmitted = !!task._id;
        
          if (window.confirm("Are you sure you want to delete this task?")) {
            deleteTask(taskIdToDelete, isSubmitted);
          }
        }}
        
        className="text-red-500"
      >
        <FaTrash />
      </button>
    </li>
  ))}
          </ul>

        ) : (<p className="text-gray-500">No tasks available</p>)}
       {showSubmit && selectedUser && userTasks[selectedUser.id]?.length > 0 && (
          <button
            onClick={submitTasks}
            className="mt-4 bg-text text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Submit
          </button>
        )}
        
      </div>
    </motion.div>
  );
};


export default TaskManager;
