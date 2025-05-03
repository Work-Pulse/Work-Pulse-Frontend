import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaTrash,
  FaClock,
  FaPlay,
  FaEdit,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import bg from "../../assets/images/bg.png";
import Swal from "sweetalert2";

interface TaskType {
  userId: string;
  _id?: string;
  name: string;
  priority: "High" | "Medium" | "Low";
  duration: string;
  description: string;
  deadline: string;
  completed: boolean;
}

interface UserTasks {
  [userId: string]: TaskType[];
}

export default function TaskManager() {
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [userTasks, setUserTasks] = useState<UserTasks>({});
  const [activeView, setActiveView] = useState<"form" | "summary">("form");

  // Task form state
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">(
    "Medium"
  );
  const [durationHours, setDurationHours] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [deadline, setDeadline] = useState("");
  // New user form
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  // Show the "Submit" button if there are new (incomplete) tasks
  const [showSubmit, setShowSubmit] = useState(false);

  // Fetch all users (for dropdown)
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3030/employee/employees");
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const employees = await res.json();
      setUsers(
        employees.map((emp: any) => ({
          id: emp.employeeId.toString(),
          name: emp.name,
        }))
      );
    } catch (err) {
      console.error("Fetch users failed:", err);
    }
  };

  // Fetch tasks for one user
  const fetchTasks = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:3030/api/get-tasks/${userId}`);
      const data: TaskType[] = await res.json();
      setUserTasks((prev) => ({
        ...prev,
        [userId]: data,
      }));
      // if any are not completed, show the Submit button
      setShowSubmit(data.some((t) => !t.completed));
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  // Fetch all tasks (for summary)
  const getAllTasks = async () => {
    try {
      const res = await fetch("http://localhost:3030/api/get-all-tasks");
      const allTasks: TaskType[] = await res.json();
      const grouped: UserTasks = {};
      allTasks.forEach((task) => {
        if (!grouped[task.userId]) grouped[task.userId] = [];
        grouped[task.userId].push(task);
      });
      setUserTasks(grouped);
    } catch (err) {
      console.error("Error fetching all tasks:", err);
    }
  };

  // Add a new user
  const addUser = async () => {
    if (!userId.trim() || !userName.trim()) return;
    try {
      const res = await fetch("http://localhost:3030/api/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId.trim(), name: userName.trim() }),
      });
      if (res.ok) {
        setUserId("");
        setUserName("");
        await fetchUsers();
      }
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  // Add a new task locally
  const addTask = () => {
    if (!selectedUser) {
      Swal.fire({
        icon: "warning",
        title: "No User Selected",
        text: "Please select a user first.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }
    if (!taskName.trim() || (!durationHours && !durationMinutes) || !deadline) {
      Swal.fire({
        icon: "error",
        title: "Incomplete Fields",
        text: "Please fill all required task fields.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }
    const newTask: TaskType = {
      userId: selectedUser.id,
      name: taskName.trim(),
      priority,
      duration: `${Number(durationHours) || 0}h ${Number(durationMinutes) ||
        0}m`,
      description: description.trim() || "No description",
      deadline,
      completed: false,
    };
    setUserTasks((prev) => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newTask],
    }));
    setShowSubmit(true);
    setTaskName("");
    setDescription("");
    setPriority("Medium");
    setDurationHours("");
    setDurationMinutes("");
    setDeadline("");
  };

  // Submit all new (incomplete) tasks to backend
  const submitTasks = async () => {
    if (!selectedUser) return;
    const tasksToSubmit = (userTasks[selectedUser.id] || []).filter(
      (t) => !t.completed
    );
    try {
      const updated = await Promise.all(
        tasksToSubmit.map(async (task) => {
          const res = await fetch("http://localhost:3030/api/add-task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task),
          });
          if (!res.ok) throw new Error(task.name);
          const data = await res.json();
          return { ...task, _id: data.task._id, completed: true };
        })
      );
      // merge back into state
      setUserTasks((prev) => ({
        ...prev,
        [selectedUser.id]: [
          // keep old completed ones
          ...(prev[selectedUser.id] || []).filter((t) => t.completed),
          // plus newly submitted
          ...updated,
        ],
      }));
      setShowSubmit(false);
      Swal.fire({
        icon: "success",
        title: "Tasks submitted!",
        confirmButtonColor: "#3085d6",
      });
    } catch (err) {
      console.error("Submit failed:", err);
      Swal.fire({
        icon: "error",
        title: "Submit failed",
        text: String(err),
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // Delete a task (both local & backend if already completed)
  const deleteTask = async (taskId: string, completed: boolean) => {
    if (!selectedUser) return;
    try {
      if (completed) {
        const res = await fetch(
          `http://localhost:3030/api/delete-task/${taskId}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error(await res.text());
      }
      setUserTasks((prev) => ({
        ...prev,
        [selectedUser.id]: (prev[selectedUser.id] || []).filter(
          (t) => t._id !== taskId
        ),
      }));
    } catch (err: any) {
      console.error("Delete failed:", err);
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err.message,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // Helper for priority stars
  const getPriorityStars = (pri: TaskType["priority"]) =>
    pri === "High" ? "★★★" : pri === "Medium" ? "★★" : "★";

  // On mount, load users
  useEffect(() => {
    fetchUsers();
  }, []);

  // When selecting from summary dropdown
  const selectUser = (id: string, name: string) => {
    setSelectedUser({ id, name });
    fetchTasks(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-cover p-6 overflow-auto"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Link to="/managerdashboard" className="absolute top-2 left-6">
        <button className="flex items-center gap-2 text-white bg-red-500 p-3 rounded-lg">
          <FaArrowLeft /> Back
        </button>
      </Link>

      <h1 className="text-4xl font-extrabold mb-6 text-white">
        Task Manager
      </h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveView("form")}
          className={`px-8 py-2 font-bold rounded-l-lg ${
            activeView === "form"
              ? "bg-white text-text"
              : "bg-gray-600 text-white"
          }`}
        >
          Add Tasks
        </button>
        <button
          onClick={() => {
            setActiveView("summary");
            getAllTasks();
          }}
          className={`px-6 py-2 font-bold rounded-r-lg ${
            activeView === "summary"
              ? "bg-white text-text"
              : "bg-gray-600 text-white"
          }`}
        >
          Task Summary
        </button>
      </div>

      <AnimatePresence>
        {activeView === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-5xl bg-white rounded-lg shadow-xl p-6 grid grid-cols-2 gap-6"
          >
            {/* User & Add */}
            <div>
              <h3 className="text-xl font-bold mb-3">User Information</h3>
              <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-2 border rounded mb-3"
              />
              <input
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-2 border rounded mb-3"
              />
              <button
                onClick={addUser}
                className="w-full p-3 bg-text text-white rounded-lg mb-6"
              >
                Add User
              </button>
              {users.length > 0 && (
                <div>
                  <label className="block mb-1 font-semibold">
                    Select User
                  </label>
                  <select
                    value={selectedUser?.id || ""}
                    onChange={(e) => {
                      const u = users.find((u) => u.id === e.target.value);
                      if (u) setSelectedUser(u);
                    }}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select a user</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Task Form */}
            <div>
              <h3 className="text-xl font-bold mb-3">Add New Task</h3>
              <input
                type="text"
                placeholder="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full p-2 border rounded mb-3"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded mb-3 h-20"
              />
              <div className="flex gap-3 mb-3">
               
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as TaskType["priority"])
                  }
                  className="p-2 border rounded"
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
                  className="p-2 border rounded w-1/4"
                />
                <input
                  type="number"
                  placeholder="Minutes"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="p-2 border rounded w-1/4"
                />
              </div>
              <label className="block mb-1 font-semibold">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2 border rounded mb-3"
              />
              <button
                onClick={addTask}
                className="w-full p-3 bg-text text-white rounded-lg"
              >
                Add Task
              </button>
            </div>

            {/* Task List */}
            <div className="col-span-2 mt-6">
              <h3 className="text-xl font-bold mb-3">Task List</h3>
              {selectedUser && userTasks[selectedUser.id]?.length ? (
                <>
                  <ul className="space-y-3">
                    {userTasks[selectedUser.id].map((task) => (
                      <li
                        key={task._id ?? task.name}
                        className={`p-3 border rounded-lg flex justify-between items-center ${
                          task.completed
                            ? "opacity-50 line-through"
                            : "bg-gray-100"
                        }`}
                      >
                        <div>
                          <p className="font-bold flex items-center gap-2">
                            {task.name} {getPriorityStars(task.priority)}
                            {task.completed ? ( 
                              <span className="flex items-center gap-1 text-green-600">
                                <FaPlay /> Completed
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-orange-500">
                                <FaClock /> Pending
                              </span>
                            )}
                          </p>
                          <p>Priority: {task.priority}</p>
                          <p>Duration: {task.duration}</p>
                          <p>Deadline: {task.deadline}</p>
                        </div>
                        <button
                          onClick={() =>
                            Swal.fire({
                              title: "Are you sure?",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#d33",
                              cancelButtonColor: "#3085d6",
                              confirmButtonText: "Yes, delete!",
                            }).then((res) => {
                              if (res.isConfirmed)
                                deleteTask(task._id!, task.completed);
                            })
                          }
                          className="text-red-500"
                        >
                          <FaTrash />
                        </button>
                      </li>
                    ))}
                  </ul>
                  {showSubmit && (
                    <button
                      onClick={submitTasks}
                      className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                      Submit New Tasks
                    </button>
                  )}
                </>
              ) : (
                <p className="text-gray-500">No tasks available</p>
              )}
            </div>
          </motion.div>
        )}

        {activeView === "summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-5xl bg-white rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-6">Task Assignment Summary</h2>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Select User</label>
              <select
                value={selectedUser?.id || ""}
                onChange={(e) => {
                  const id = e.target.value;
                  if (!id) {
                    setSelectedUser(null);
                  } else {
                    const u = users.find((u) => u.id === id);
                    if (u) selectUser(u.id, u.name);
                  }
                }}
                className="p-2 border rounded w-64"
              >
                <option value="">All Users</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              {selectedUser ? (
                <>
                  <h3 className="text-lg font-semibold mb-2">
                    {selectedUser.name}'s Tasks
                  </h3>
                  <ul className="space-y-2">
                    {(userTasks[selectedUser.id] || []).map((task) => (
                      <li
                        key={task._id}
                        className="bg-gray-100 p-3 rounded-lg border flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold flex items-center gap-2">
                            {task.name} {getPriorityStars(task.priority)}
                            {task.completed ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <FaPlay /> Completed
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-orange-500">
                                <FaClock /> Pending
                              </span>
                            )}
                          </p>
                          <p>Priority: {task.priority}</p>
                          <p>Duration: {task.duration}</p>
                          <p>Deadline: {task.deadline}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                Object.entries(userTasks).map(([uid, tasks]) => (
                  <div key={uid} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      {users.find((u) => u.id === uid)?.name}'s Tasks
                    </h3>
                    <ul className="space-y-2">
                      {tasks.map((task) => (
                        <li
                          key={task._id}
                          className="bg-gray-100 p-3 rounded-lg border flex justify-between items-center"
                        >
                          <div>
                            <p className="font-bold flex items-center gap-2">
                              {task.name} {getPriorityStars(task.priority)}
                              {task.completed ? (
                                <span className="flex items-center gap-1 text-green-600">
                                  <FaPlay /> Completed
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-orange-500">
                                  <FaClock /> Pending
                                </span>
                              )}
                            </p>
                            <p>Priority: {task.priority}</p>
                            <p>Duration: {task.duration}</p>
                            <p>Deadline: {task.deadline}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
