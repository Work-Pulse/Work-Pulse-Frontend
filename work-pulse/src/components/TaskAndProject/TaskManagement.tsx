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
import Swal from "sweetalert2";
import bg from "../../assets/images/bg.png";

interface TaskType {
  id: string;               // local-only ID
  _id?: string;             // MongoDB ID
  userId: string;
  userName?: string;
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
  // -- State --
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
  const [newTasks, setNewTasks] = useState<TaskType[]>([]);
  const [userTasks, setUserTasks] = useState<UserTasks>({});
  const [activeView, setActiveView] = useState<"form" | "summary">("form");

  // Form inputs
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [durationHours, setDurationHours] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [deadline, setDeadline] = useState("");

  // New-user inputs
  const [newUserName, setNewUserName] = useState("");
  const [newUserId, setNewUserId] = useState("");

  // Editing state for summary
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    priority: "Medium" as "High" | "Medium" | "Low",
    durationHours: "",
    durationMinutes: "",
    description: "",
    deadline: "",
  });

  // -- Helpers --
  const getPriorityStars = (p: TaskType["priority"]) =>
    p === "High" ? "★★★" : p === "Medium" ? "★★" : "★";

  const statusBadge = (completed: boolean) =>
    completed ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-sm font-semibold rounded bg-green-100 text-green-800">
        <FaPlay /> Completed
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-sm font-semibold rounded bg-yellow-100 text-yellow-800">
        <FaClock /> Pending
      </span>
    );

  // -- API calls --
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3030/employee/employees");
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const emps = await res.json();
      setUsers(emps.map((e: any) => ({ id: e.employeeId.toString(), name: e.name })));
    } catch (e) {
      console.error(e);
    }
  };

  const getAllTasks = async () => {
    try {
      const res = await fetch("http://localhost:3030/api/get-all-tasks");
      const all: TaskType[] = await res.json();
      const grouped: UserTasks = {};
      all.forEach((t) => {
        grouped[t.userId] = grouped[t.userId] || [];
        grouped[t.userId].push(t);
      });
      setUserTasks(grouped);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTasks = async (uid: string) => {
    try {
      const res = await fetch(`http://localhost:3030/api/get-tasks/${uid}`);
      const data: TaskType[] = await res.json();
      setUserTasks({ [uid]: data });
    } catch (e) {
      console.error(e);
    }
  };

  // -- Lifecycle --
  useEffect(() => {
    fetchUsers();
  }, []);

  // -- Handlers --
  const handleAddUser = async () => {
    if (!newUserId.trim() || !newUserName.trim()) {
      Swal.fire({ icon: "error", title: "Enter both ID & Name" });
      return;
    }
    try {
      const res = await fetch("http://localhost:3030/api/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: newUserId.trim(), name: newUserName.trim() }),
      });
      if (res.ok) {
        setNewUserId("");
        setNewUserName("");
        await fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTask = () => {
    if (!selectedUser) {
      Swal.fire({ icon: "warning", title: "Select a user first" });
      return;
    }
    if (!taskName.trim()) {
      Swal.fire({ icon: "error", title: "Task name required" });
      return;
    }
    if (!durationHours && !durationMinutes) {
      Swal.fire({ icon: "error", title: "Enter duration" });
      return;
    }
    if (!deadline) {
      Swal.fire({ icon: "error", title: "Select deadline" });
      return;
    }

    const t: TaskType = {
      id: crypto.randomUUID(),
      userId: selectedUser.id,
      userName: selectedUser.name,
      name: taskName.trim(),
      priority,
      duration: `${Number(durationHours) || 0}h ${Number(durationMinutes) || 0}m`,
      description: description.trim() || "No description",
      deadline,
      completed: false,
    };
    setNewTasks((p) => [...p, t]);
    setTaskName("");
    setDescription("");
    setPriority("Medium");
    setDurationHours("");
    setDurationMinutes("");
    setDeadline("");
  };

  const deleteLocal = (id: string) => {
    Swal.fire({
      title: "Delete this new task?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((r) => {
      if (r.isConfirmed) {
        setNewTasks((p) => p.filter((t) => t.id !== id));
        Swal.fire({ icon: "success", title: "Deleted" });
      }
    });
  };

  const submitLocal = async (task: TaskType) => {
    try {
      const res = await fetch("http://localhost:3030/api/add-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: task.userId,
          userName: task.userName,
          name: task.name,
          priority: task.priority,
          duration: task.duration,
          description: task.description,
          deadline: task.deadline,
        }),
      });
      if (!res.ok) throw new Error("Submit failed");
      const { task: saved } = await res.json();
      setUserTasks((p) => ({
        ...p,
        [task.userId]: [...(p[task.userId] || []), saved],
      }));
      setNewTasks((p) => p.filter((t) => t.id !== task.id));
      Swal.fire({ icon: "success", title: "Task submitted" });
    } catch (e: any) {
      Swal.fire({ icon: "error", title: e.message });
    }
  };

  const deletePersisted = async (taskId: string, userId: string) => {
    Swal.fire({
      title: "Delete from database?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (r) => {
      if (!r.isConfirmed) return;
      try {
        const res = await fetch(`http://localhost:3030/api/delete-task/${taskId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error(await res.text());
        Swal.fire({ icon: "success", title: "Deleted" });
        setUserTasks((p) => ({
          ...p,
          [userId]: (p[userId] || []).filter((t) => t._id !== taskId),
        }));
      } catch (e: any) {
        Swal.fire({ icon: "error", title: e.message });
      }
    });
  };

  const handleEditClick = (task: TaskType) => {
    setEditingTaskId(task._id!);
    setEditingUserId(task.userId);
    const [h, m] = task.duration.split("h").map((s) => s.replace("m", "").trim());
    setEditForm({
      name: task.name,
      priority: task.priority,
      durationHours: h,
      durationMinutes: m,
      description: task.description,
      deadline: task.deadline,
    });
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingUserId(null);
  };

  const saveEdit = async () => {
    if (!editingTaskId || !editingUserId) return;
    if (!editForm.name.trim()) {
      Swal.fire({ icon: "error", title: "Name required" });
      return;
    }
    if (!editForm.deadline) {
      Swal.fire({ icon: "error", title: "Deadline required" });
      return;
    }
    const payload = {
      name: editForm.name.trim(),
      priority: editForm.priority,
      duration: `${Number(editForm.durationHours) || 0}h ${
        Number(editForm.durationMinutes) || 0
      }m`,
      description: editForm.description.trim(),
      deadline: editForm.deadline,
    };
    try {
      const res = await fetch(`http://localhost:3030/api/update/${editingTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      const updatedTask = await res.json();
      Swal.fire({ icon: "success", title: "Updated" });
      setUserTasks((p) => ({
        ...p,
        [editingUserId]: (p[editingUserId] || []).map((t) =>
          t._id === editingTaskId ? { ...t, ...updatedTask } : t
        ),
      }));
      cancelEdit();
    } catch (e: any) {
      Swal.fire({ icon: "error", title: e.message });
    }
  };

  const selectUserForSummary = (uid: string, name: string) => {
    if (!uid) {
      setSelectedUser(null);
      getAllTasks();
    } else {
      setSelectedUser({ id: uid, name });
      fetchTasks(uid);
    }
  };

  // Determine groups for summary
  const groups: UserTasks = selectedUser
    ? { [selectedUser.id]: userTasks[selectedUser.id] || [] }
    : userTasks;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center min-h-screen p-6 bg-cover bg-center overflow-auto"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Link to='/managerdashboard' className="absolute top-2 left-6">
        <button className="flex items-center gap-2 text-text text-xl font-extrabold p-3 bg-red-500 rounded-lg hover:text-reject transition duration-300">
          <FaArrowLeft size={20} /> Back
        </button>
      </Link>

      <h1 className="text-4xl font-bold mb-6 text-text">Task Manager</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveView("form")}
          className={`px-6 py-2 font-semibold rounded-l ${
            activeView === "form" ? "bg-text text-white" : "bg-white text-text"
          }`}
        >
          Add Tasks
        </button>
        <button
          onClick={() => {
            setActiveView("summary");
            getAllTasks();
          }}
          className={`px-6 py-2 font-semibold rounded-r ${
            activeView === "summary" ? "bg-text text-white" : "bg-white text-text"
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
            className="w-full max-w-5xl bg-white rounded shadow p-6 grid grid-cols-2 gap-6"
          >
            {/* User Info */}
            <div>
              <h2 className="font-bold mb-2">User Information</h2>
              <input
                type="text"
                placeholder="User ID"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Username"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <button
                onClick={handleAddUser}
                className="w-full mb-4 py-2 bg-text text-white rounded"
              >
                Add User
              </button>
              {users.length > 0 && (
                <>
                  <label className="block mb-1 font-semibold">Select User</label>
                  <select
                    value={selectedUser?.id || ""}
                    onChange={(e) => {
                      const u = users.find((u) => u.id === e.target.value);
                      if (u) setSelectedUser(u);
                    }}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">-- Select --</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>

            {/* New Task Form */}
            <div>
              <h2 className="font-bold mb-2">Add New Task</h2>
              <input
                type="text"
                placeholder="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mb-2 p-2 border rounded h-20"
              />
              <div className="flex gap-2 mb-2">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="p-2 border rounded"
                >
                  <option value="High">High ★★★</option>
                  <option value="Medium">Medium ★★</option>
                  <option value="Low">Low ★</option>
                </select>
                <input
                  type="number"
                  placeholder="Hrs"
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
              <label className="block mb-1 font-semibold">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              />
              <button
                onClick={handleAddTask}
                className="w-full py-2 bg-text text-white rounded"
              >
                Add Task
              </button>
            </div>

            {/* Pending Tasks */}
            <div className="col-span-2 mt-6">
              <h2 className="font-bold mb-2">Pending Tasks</h2>
              {selectedUser ? (
                newTasks.filter((t) => t.userId === selectedUser.id).length > 0 ? (
                  <ul className="space-y-4">
                    {newTasks
                      .filter((t) => t.userId === selectedUser.id)
                      .map((t) => (
                        <li
                          key={t.id}
                          className="relative p-4 border rounded flex flex-col"
                        >
                          <div className="flex items-start">
                            <div className="flex-1">
                              <p className="font-bold">
                                {t.name} {getPriorityStars(t.priority)}
                              </p>
                              <p>Duration: {t.duration}</p>
                              <p>Deadline: {t.deadline}</p>
                            </div>
                            <button
                              onClick={() => deleteLocal(t.id)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500"
                            >
                              <FaTrash />
                            </button>
                          </div>
                          <button
                            onClick={() => submitLocal(t)}
                            className="mt-2 w-1/2 py-1 bg-text text-white rounded"
                          >
                            Submit
                          </button>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p>No new tasks.</p>
                )
              ) : (
                <p>Please select a user.</p>
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
            className="w-full max-w-5xl bg-white rounded shadow p-6"
          >
            <h2 className="font-bold mb-4">Task Assignment Summary</h2>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Filter by User</label>
              <select
                value={selectedUser?.id || ""}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v) selectUserForSummary("", "");
                  else {
                    const u = users.find((u) => u.id === v)!;
                    selectUserForSummary(u.id, u.name);
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

            {Object.entries(groups).map(([uid, tasks]) => {
              const owner = users.find((u) => u.id === uid)?.name || "Unknown";
              return (
                <div key={uid} className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{owner}'s Tasks</h3>
                  {tasks.length > 0 ? (
                    <ul className="space-y-4">
                      {tasks.map((task) => (
                        <li
                          key={task._id}
                          className="relative p-4 border rounded bg-gray-50"
                        >
                          {editingTaskId === task._id ? (
                            <>
                              <h4 className="font-semibold mb-2">
                                Edit form of {owner}'s
                              </h4>
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) =>
                                  setEditForm((f) => ({ ...f, name: e.target.value }))
                                }
                                className="w-full mb-2 p-2 border rounded"
                              />
                              <select
                                value={editForm.priority}
                                onChange={(e) =>
                                  setEditForm((f) => ({
                                    ...f,
                                    priority: e.target.value as any,
                                  }))
                                }
                                className="w-full mb-2 p-2 border rounded"
                              >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                              </select>
                              <div className="flex gap-2 mb-2">
                                <input
                                  type="number"
                                  placeholder="Hrs"
                                  value={editForm.durationHours}
                                  onChange={(e) =>
                                    setEditForm((f) => ({
                                      ...f,
                                      durationHours: e.target.value,
                                    }))
                                  }
                                  className="w-1/2 p-2 border rounded"
                                />
                                <input
                                  type="number"
                                  placeholder="Mins"
                                  value={editForm.durationMinutes}
                                  onChange={(e) =>
                                    setEditForm((f) => ({
                                      ...f,
                                      durationMinutes: e.target.value,
                                    }))
                                  }
                                  className="w-1/2 p-2 border rounded"
                                />
                              </div>
                              <input
                                type="date"
                                value={editForm.deadline}
                                onChange={(e) =>
                                  setEditForm((f) => ({ ...f, deadline: e.target.value }))
                                }
                                className="w-full mb-2 p-2 border rounded"
                              />
                              <textarea
                                value={editForm.description}
                                onChange={(e) =>
                                  setEditForm((f) => ({
                                    ...f,
                                    description: e.target.value,
                                  }))
                                }
                                className="w-full mb-2 p-2 border rounded h-20"
                              />
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={saveEdit}
                                  className="px-4 py-2 bg-text text-white rounded"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="px-4 py-2 bg-reject text-white rounded"
                                >
                                  Cancel
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-start">
                              <div className="flex-1">
                                <p className="font-bold flex items-center gap-2">
                                  {task.name} {getPriorityStars(task.priority)}{" "}
                                  {statusBadge(task.completed)}
                                </p>
                                <p>Duration: {task.duration}</p>
                                <p>Deadline: {task.deadline}</p>
                              </div>
                              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-2">
                                <button onClick={() => handleEditClick(task)}>
                                  <FaEdit className="text-blue-500" />
                                </button>
                                <button
                                  onClick={() => deletePersisted(task._id!, uid)}
                                >
                                  <FaTrash className="text-red-500" />
                                </button>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">{owner} has no tasks.</p>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
