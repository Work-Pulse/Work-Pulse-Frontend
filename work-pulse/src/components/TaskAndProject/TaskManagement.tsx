import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaTrash, FaClock } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import bg from "../../assets/images/bg.png";

interface TaskType {
  userId: any;
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
  const [activeView, setActiveView] = useState<'form' | 'summary'>('form');


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
  
      // alert("Tasks submitted successfully!");
  
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
  
 // Get all tasks
 const getAllTasks = async () => {
  try {
    const res = await fetch('http://localhost:3030/api/get-all-tasks');
    if (!res.ok) throw new Error('Failed to fetch tasks');

    const allTasks: (TaskType & { userId: string })[] = await res.json();

    // Group tasks by userId
    const grouped: UserTasks = {};
    for (const task of allTasks) {
      if (!grouped[task.userId]) grouped[task.userId] = [];
      grouped[task.userId].push({ ...task, submitted: true });
    }

    setUserTasks(grouped);
  } catch (error) {
    console.error("Error fetching all tasks:", error);
  }
};


// Get all users
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3030/employee/employees");
  
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
  
      const employees = await res.json(); // No .employees, it's just an array
  
      const formattedUsers = employees.map((emp: any) => ({
        id: emp.employeeId.toString(),
        name: emp.name,
      }));
  
      setUsers(formattedUsers);
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
      // alert("Please select a user first.");
      return;
    }

    if (!taskName.trim() || (durationHours === "" && durationMinutes === "") || !deadline) {
      // alert("Please fill all required task fields.");
      return;
    }

    const newTask: TaskType = {
      id: crypto.randomUUID(),
      name: taskName.trim(),
      priority,
      duration: `${Number(durationHours) || 0}h ${Number(durationMinutes) || 0}m`,
      description: description.trim() || "No description",
      deadline,
      userId: undefined
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
    console.log("Delete function called with taskId:", taskId);  // Log taskId to see what's being passed
    console.log("Is Submitted:", isSubmitted);
  
    if (!selectedUser) {
      console.error("No user selected. Cannot delete task.");
      // alert("No user selected. Cannot delete task.");
      return;
    }
  
    console.log("Selected User:", selectedUser);  // Log selectedUser to make sure it's valid
  
    try {
      if (isSubmitted) {
        console.log("Deleting from backend...");  // Log this to see if we enter this block
        const res = await fetch(`http://localhost:3030/api/delete-task/${taskId}`, {
          method: "DELETE",
        });
  
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
      }
  
      // Remove task from local state
      setUserTasks((prev) => {
        const updatedTasks = (prev[selectedUser!.id] || []).filter(
          (task) => task._id !== taskId  // Use _id to filter tasks
        );
        console.log("Updated Tasks after deletion:", updatedTasks);  // Log updated tasks
        return {
          ...prev,
          [selectedUser!.id]: updatedTasks,
        };
      });
    } catch (err: any) {
      console.error("Error deleting task:", err);  // Log the error in detail
      // alert("Error deleting task: " + err.message);
    }
  };
    
        useEffect(() => {
          console.log("User Tasks Updated:", userTasks);
        }, [userTasks]);


 //Update tasks
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  
  const handleEditTask = (task: TaskType) => {
    setEditingTask(task);
    setUpdatedTaskData({ ...task }); // clone object to avoid reference issues
  };
  
  const getChangedFields = (
    original: TaskType,
    updated: Partial<TaskType>
  ): Partial<TaskType> => {
    const changed: Partial<TaskType> = {};
  
    (Object.keys(updated) as Array<keyof TaskType>).forEach((key) => {
      const updatedValue = updated[key];
      const originalValue = original[key];
  
      if (updatedValue !== undefined && updatedValue !== originalValue) {
        // Assign explicitly with proper typing
        changed[key] = updatedValue as TaskType[typeof key];
      }
    });
  
    return changed;
  };
  
  
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
  
    if (editingTask) {
      const changedFields = getChangedFields(editingTask, updatedTaskData);
      
      console.log("Payload being sent:", changedFields);
  
      if (Object.keys(changedFields).length === 0) {
        // alert("No changes to update.");
        return;
      }
  
      const res = await fetch(`http://localhost:3030/api/update/${editingTask._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changedFields),
      });
  
      if (res.ok) {
        const updated = await res.json();
        updateTaskInState({ ...updated, userId: editingTask.userId }); // 👈 add userId manually
        setEditingTask(null);
      } else {
        // alert("Failed to update task");
      }
    }
  };
  

const [updatedTaskData, setUpdatedTaskData] = useState<Partial<TaskType>>({
  name: '',
  priority: 'Medium',
  duration: '',
  description: '',
  deadline: '',
});


const updateTaskInState = (updatedTask: TaskType & { userId: string }) => {
  setUserTasks((prev) => {
    const existingTasks = prev[updatedTask.userId] || [];

    const updatedTasks = existingTasks.map((t) =>
      t._id === updatedTask._id ? { ...t, ...updatedTask } : t
    );

    const taskExists = existingTasks.some((t) => t._id === updatedTask._id);
    const newTasks = taskExists ? updatedTasks : [...existingTasks, updatedTask];

    return {
      ...prev,
      [updatedTask.userId]: newTasks,
    };
  });
};






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

                <div className="flex gap-4 mb-6 bg-white rounded-lg shadow-lg">
            <button
              onClick={() => setActiveView('form')}
              className={`px-8 py-2 text-text font-bold transition rounded-l-lg duration-300 ${
                activeView === 'form' ? 'bg-text text-white' : 'bg-gray-500 hover:bg-blue-400'
              }`}
            >
              Add Tasks
            </button>
            <button
              onClick={() => { 
                setActiveView('summary');
                getAllTasks();  
              }}
              className={`px-6 py-2 text-text font-bold rounded-r-lg transition duration-300 ${
                activeView === 'summary' ? 'bg-text text-white' : 'bg-gray-500 hover:bg-blue-400'
              }`}
            >
              Task Assignment Summary
            </button>
          </div>

          <AnimatePresence>
  {/* Add Tasks Section */}
  {activeView === 'form' && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid grid-cols-2 gap-6 w-full max-w-5xl p-6 bg-gray-100 rounded-lg shadow-xl">
        {/* User Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg ">
          <h3 className="text-xl font-bold text-[#122D3B] mb-3">User Information</h3>
          <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} className="w-full p-2 border rounded mb-3 shadow-sm" />
          <input type="text" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full p-2 border rounded mb-3 shadow-sm" />
          <button onClick={addUser} className="w-full p-3 bg-[#122D3B] text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md">Add User</button>
          
          {users.length > 0 && (
            <div className="mt-4">
              <label className="text-xl font-bold text-text mb-1 block">Select User</label>
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

        {/* Add Task Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg ">
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
            className="w-full p-2 border rounded mb-3 shadow-sm"
          />
          <button
            onClick={addTask}
            className="w-full p-3 bg-[#122D3B] text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Task List Section */}
<div className="w-full max-w-5xl p-6 bg-white rounded-lg shadow-lg  mt-6 overflow-auto">
  <h3 className="text-xl font-bold text-text mb-3">Task List</h3>

  {selectedUser && userTasks[selectedUser.id]?.length > 0 ? (
    <>
      <ul className="space-y-3">
        {userTasks[selectedUser.id].map((task) => {
          const taskStatus = task.submitted ? "Pending" : "Started"; // Task status logic

          return (
            <li
              key={(task._id ?? task.id ?? crypto.randomUUID()).toString()}
              className="p-3 bg-gray-100 border rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-bold flex items-center gap-2">
                  {task.name} {getPriorityStars(task.priority)}
                  <span className="text-sm font-semibold text-background bg-text px-2 py-1 rounded flex items-center gap-1">
                    <FaClock className="mr-1" />
                    {taskStatus}
                  </span>
                </p>
                <p className="text-gray-600 font-semibold">Priority: {task.priority}</p>
                <p className="text-gray-600 font-semibold">Duration: {task.duration}</p>
                <p className="text-gray-600 font-semibold">Deadline: {task.deadline}</p>
              </div>

              <button
                onClick={() => {
                  const taskIdToDelete = task._id || task.id?.toString();
                  if (!taskIdToDelete) {
                    // alert("Task ID not found. Cannot delete.");
                    return;
                  }
                  // const isSubmitted = !!task._id;
                  // if (window.confirm("Are you sure you want to delete this task?")) {
                  //   deleteTask(taskIdToDelete, isSubmitted);
                  // }
                }}
                className="text-red-500"
                disabled={taskStatus === "Started"}
              >
                <FaTrash />
              </button>
            </li>
          );
        })}
      </ul>

      {/* Submit Button - correctly placed here */}
      {showSubmit && (
        <button
          onClick={submitTasks}
          className="mt-4 bg-text text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Submit
        </button>
      )}
    </>
  ) : (
    <p className="text-gray-500">No tasks available</p>
  )}
</div>

    </motion.div>
  )}



          {/* Task Assignment Summary Report */}
          {activeView === 'summary' && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl w-full p-6 bg-white rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold text-text mb-6">Task Assignment Summary</h2>
          
            {/* User Selection Dropdown */}
          <div className="mb-4 w-64">
        <label className="block text-lg font-semibold text-text mb-2">Select User</label>
        <select
           value={selectedUser?.id || ""}
           onChange={(e) => {
      const selectedId = e.target.value;

      if (selectedId === "") {
        // Show all users
        setSelectedUser(null);
      } else {
        const user = users.find((u) => u.id === selectedId);
        if (user) {
          selectUser(user.id, user.name); // fetchTasks runs here
        }
      }
    }}
    className="w-full p-2 border rounded shadow-sm"
  >
    <option value="">All Users</option>
    {users.map((user) => (
      <option key={user.id} value={user.id}>{user.name}</option>
    ))}
  </select>
</div>
     
            
            {/* Task Summary Table/List */}
{selectedUser ? (
  userTasks[selectedUser.id]?.length > 0 ? (
    <div key={selectedUser.id} className="mb-6">
      <h3 className="text-lg font-semibold text-[#122D3B] mb-2">
        {users.find((u) => u.id === selectedUser.id)?.name}'s Tasks
      </h3>
      <ul className="space-y-2">
        {userTasks[selectedUser.id].map((task) => {
          const taskStatus = task.submitted ? "Pending" : "Started";
          const isEditable = taskStatus !== "Started";

          return (
            <li
              key={task._id || task.id}
              className="bg-gray-100 p-3 rounded-lg border flex justify-between items-center"
            >
              <div>
                <p className="font-bold">
                  {task.name} {getPriorityStars(task.priority)}
                </p>
                <p className="text-gray-600 font-semibold">Priority: {task.priority}</p>
                <p className="text-gray-600 font-semibold">Duration: {task.duration}</p>
                <p className="text-gray-600 font-semibold">Deadline: {task.deadline}</p>
                <p className="text-sm font-semibold text-background bg-text px-2 py-1 mt-1 rounded inline-flex items-center gap-1 w-fit">
                    <FaClock />
                    {task.submitted ? "Pending" : "Started"}
                  </p>
              </div>

              <div className="flex space-x-2">
                {/* Edit Button */}
                <button
                  onClick={() => {
                    if (isEditable) setEditingTask(task);
                  }}
                  className={`text-blue-500 hover:text-blue-700 ${!isEditable ? "opacity-50 cursor-not-allowed" : ""}`}
                  title="Edit Task"
                  disabled={!isEditable}
                >
                  <FaEdit />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => {
                    if (!isEditable) return;

                    const taskIdToDelete = task._id || task.id?.toString();
                    if (!taskIdToDelete) {
                      // alert("Task ID not found. Cannot delete.");
                      return;
                    }

                    // const isSubmitted = !!task._id;
                    // if (window.confirm("Are you sure you want to delete this task?")) {
                    //   deleteTask(taskIdToDelete, isSubmitted);
                    // }
                  }}
                  className={`text-red-500 hover:text-red-700 ${!isEditable ? "opacity-50 cursor-not-allowed" : ""}`}
                  title="Delete Task"
                  disabled={!isEditable}
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {editingTask && (
        <form onSubmit={handleSubmit} className="mt-6 p-4 bg-[#d6d3d1] shadow-lg border rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-text">
              Edit Task - {" "}
              <span className="text-text font-semibold">
                {users.find((u) => u.id === selectedUser.id)?.name}
              </span>
            </h3>



          {/* Name */}
          <div className="mb-3">
            <label className="block font-semibold mb-1">Task Name</label>
            <input
              type="text"
              value={updatedTaskData.name}
              onChange={(e) =>
                setUpdatedTaskData({ ...updatedTaskData, name: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Priority */}
          <div className="mb-3">
            <label className="block font-semibold mb-1">Priority</label>
            <select
              value={updatedTaskData.priority}
              onChange={(e) =>
                setUpdatedTaskData({
                  ...updatedTaskData,
                  priority: e.target.value as TaskType["priority"],
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Duration */}
          <div className="mb-3">
            <label className="block font-semibold mb-1">Duration</label>
            <div className="flex space-x-2">
            <input
  type="number"
  min="0"
  placeholder="Hours"
  value={
    updatedTaskData.duration
      ? parseInt((updatedTaskData.duration || '').split('h')[0]) || ''
      : ''
  }
  onChange={(e) => {
    const hours = e.target.value;
    const minutes = (updatedTaskData.duration || '').includes('min')
      ? (updatedTaskData.duration || '').split('h')[1]?.replace('min', '').trim()
      : '0';
    setUpdatedTaskData({
      ...updatedTaskData,
      duration: `${hours || '0'}h ${minutes || '0'}min`,
    });
  }}
  className="w-1/2 p-2 border rounded"
/>

        <input
          type="number"
          min="0"
          max="59"
          placeholder="Minutes"
          value={
            updatedTaskData.duration && updatedTaskData.duration.includes('min')
              ? parseInt(
                  (updatedTaskData.duration || '')
                    .split(' ')[1]
                    ?.replace('min', '') || ''
                ) || ''
              : ''
          }
          onChange={(e) => {
            const minutes = e.target.value;
            const hours = (updatedTaskData.duration || '').split('h')[0] || '0';
            setUpdatedTaskData({
              ...updatedTaskData,
              duration: `${hours.trim()}h ${minutes || '0'}min`,
            });
          }}
          className="w-1/2 p-2 border rounded"
        />

            </div>
          </div>

          {/* Deadline */}
          <div className="mb-3">
            <label className="block font-semibold mb-1">Deadline</label>
            <input
              type="date"
              value={updatedTaskData.deadline}
              onChange={(e) =>
                setUpdatedTaskData({ ...updatedTaskData, deadline: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              value={updatedTaskData.description}
              onChange={(e) =>
                setUpdatedTaskData({ ...updatedTaskData, description: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-text rounded-lg hover:bg-white hover:text-text"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditingTask(null)}
              className="px-4 py-2 font-bold text-white bg-reject rounded-lg hover:bg-white hover:text-reject"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  ) : (
    <p className="text-gray-500 mt-4">No tasks available for selected user.</p>
  )
) : (
  Object.entries(userTasks).map(([userId, tasks]) => (
    <div key={userId} className="mb-6">
      <h3 className="text-lg font-semibold text-[#122D3B] mb-2">
        {users.find((user) => user.id === userId)?.name}'s Tasks
      </h3>
      <ul className="space-y-2">
        {tasks.map((task) => {
          const taskStatus = task.submitted ? "Pending" : "Started";
          const isEditable = taskStatus !== "Started";

          return (
            <li
              key={task._id || task.id}
              className="bg-gray-100 p-3 rounded-lg border flex justify-between items-center"
            >
              <div>
                <p className="font-bold">
                  {task.name} {getPriorityStars(task.priority)}
                </p>
                <p className="text-gray-600 font-semibold">Priority: {task.priority}</p>
                <p className="text-gray-600 font-semibold">Duration: {task.duration}</p>
                <p className="text-gray-600 font-semibold">Deadline: {task.deadline}</p>
                <p className="text-sm font-semibold text-background bg-text px-2 py-1 mt-1 rounded inline-flex items-center gap-1 w-fit">
                    <FaClock />
                    {task.submitted ? "Pending" : "Started"}
                  </p>
              </div>

              <div className="flex space-x-2">
                {/* Edit Button */}
                <button
                  onClick={() => {
                    if (isEditable) handleEditTask(task);
                  }}
                  className={`text-blue-500 hover:text-blue-700 ${!isEditable ? "opacity-50 cursor-not-allowed" : ""}`}
                  title="Edit Task"
                  disabled={!isEditable}
                >
                  <FaEdit />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => {
                    if (!isEditable) return;

                    const taskIdToDelete = task._id || task.id?.toString();
                    if (!taskIdToDelete) {
                      // alert("Task ID not found. Cannot delete.");
                      return;
                    }

                    // const isSubmitted = !!task._id;

                    // if (window.confirm("Are you sure you want to delete this task?")) {
                    //   deleteTask(taskIdToDelete, isSubmitted);
                    // }
                  }}
                  className={`text-red-500 hover:text-red-700 ${!isEditable ? "opacity-50 cursor-not-allowed" : ""}`}
                  title="Delete Task"
                  disabled={!isEditable}
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  ))
)}



  </motion.div>
          
   )}
          

</AnimatePresence>
      </motion.div>
);
};


export default TaskManager;
