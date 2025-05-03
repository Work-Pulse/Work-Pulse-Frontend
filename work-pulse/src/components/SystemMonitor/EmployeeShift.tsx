import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import bg from "../../assets/images/bg.png"
import { motion } from "framer-motion"
import ChatWindow from "./SubComponents/ChatWindow"
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from "axios"
import Swal from 'sweetalert2'

dayjs.extend(duration)

const EmployeeShift = () => {
  const [shiftStarted, setShiftStarted] = useState(false)
  const [shiftPaused, setShiftPaused] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [pauseStart, setPauseStart] = useState(0)
  const [totalPausedDuration, setTotalPausedDuration] = useState(0)
  const [endTime, setEndTime] = useState("")
  const [usageMap, setUsageMap] = useState<Record<string, number>>({})

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (shiftStarted && !shiftPaused) {
      timer = setInterval(() => {
        setElapsedTime(dayjs().unix() - startTime - totalPausedDuration)
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [shiftStarted, shiftPaused, startTime, totalPausedDuration])

  useEffect(() => {
    const ipc = (window as any).ipcRenderer
    if (!ipc) return

    const appUsageListener = (_event: any, data: Record<string, number>) => {
      console.log("Received usage update:", data)
      setUsageMap(data)
    }

    ipc.on("app-usage-update", appUsageListener)

    return () => {
      ipc.off("app-usage-update", appUsageListener)
    }
  }, [])

  const formatTime = (seconds = 0) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`
  }

  const startShift = () => {
    const now = dayjs().unix()
    setStartTime(now)
    setElapsedTime(0)
    setShiftStarted(true)
    setShiftPaused(false)
    setPauseStart(0)
    setTotalPausedDuration(0)
    setUsageMap({})
    ;(window as any).ipcRenderer.send("start-tracking")
  }

  const pauseShift = () => {
    setShiftPaused(true)
    setPauseStart(dayjs().unix())
    ;(window as any).ipcRenderer.send("pause-tracking")
  }

  const resumeShift = () => {
    if (pauseStart) {
      const pauseDuration = dayjs().unix() - pauseStart
      setTotalPausedDuration((prev) => prev + pauseDuration)
    }
    setShiftPaused(false)
    setPauseStart(0)
    ;(window as any).ipcRenderer.send("resume-tracking")
  }

  const endShift = () => {
    setEndTime(dayjs().format("YYYY-MM-DD HH:mm:ss"))
    setShiftStarted(false)
    setShiftPaused(true)
    ;(window as any).ipcRenderer.send("stop-tracking")
    
    Swal.fire({
      title: 'Shift Ended Successfully!',
      text: `Total time: ${formatTime(elapsedTime)}`,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#4CAF50'
    }).then(() => {
      navigate('/employeedashboard');  // Redirect after user clicks "OK"
    });
  }

  const navigate = useNavigate();
  const [officeMail, setOfficeMail] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState({
    employeeId: 0, 
    firstName: '',
    lastName: '',
    designation: '',
    department: '',
  });

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

  const submit = async () => {
    setEndTime(dayjs().format("YYYY-MM-DD HH:mm:ss"));
    setShiftStarted(false);
    setShiftPaused(true);
    (window as any).ipcRenderer.send("stop-tracking");
  
    const totalTime = formatTime(elapsedTime);
    const user = getAuth().currentUser;
  
    try {
      if (!user) {
        alert("User is not authenticated");
        return;
      }
  
      const token = await user.getIdToken(); 
  
      await axios.post(
        "http://localhost:3030/shift/shift-usage/save",
        {
          officeMail,
          employeeId: employeeData.employeeId,
          firstName: employeeData.firstName,
          lastName: employeeData.lastName,
          designation: employeeData.designation,
          department: employeeData.department,
          startTime: dayjs.unix(startTime).format("YYYY-MM-DD HH:mm:ss"),
          endTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          totalTime,
          usageMap,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include Firebase Auth token here
          },
        }
      );
    } catch (err) {
      console.error("Failed to save shift data:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col justify-center min-h-screen bg-cover bg-center p-6 bg-fixed"
      style={{ backgroundImage: `url(${bg})` }}
    >
      
      <div className="flex">
        <div className="w-3/5">
          {/* Shift Timer */}
          <div className="bg-white/40 p-4 shadow rounded-lg mt-20 ml-40 mr-50">
            <div className="flex flex-col items-center justify-center bg-cover bg-center text-[#122D3B] font-bold">
              <h2 className="text-2xl font-bold">{employeeData.firstName} {employeeData.lastName}</h2>
              <h2 className="text-lg">{officeMail}</h2>
            </div>

            <div className="mt-5">
              <p className="text-lg">Start Time: {startTime ? dayjs.unix(startTime).format("YYYY-MM-DD HH:mm:ss") : "Not started"}</p>
              <p className="text-lg">End Time: {endTime || "Not ended"}</p>
              <p className="text-lg font-semibold text-reject">Total Time: {formatTime(elapsedTime)}</p>
            </div>

            <div className="mt-4">
              {!shiftStarted ? (
                <button onClick={startShift} className="bg-text text-white px-4 py-2 rounded mr-2">
                  Start Shift
                </button>
                
                
              ) : shiftPaused ? (
                <button onClick={resumeShift} className="bg-text text-white px-4 py-2 rounded mr-2">
                  Resume Shift
                </button>
              ) : (
                <>
                  <button onClick={pauseShift} className="bg-[#E0E0E0] text-black px-4 py-2 rounded mr-2">
                    Pause Shift
                  </button>
                  <button
                    onClick={async () => {
                    const result = await Swal.fire({
                    title: "Are you sure?",
                    text: `Your total time so far is ${formatTime(elapsedTime)}.`,
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Yes, end shift",
                    cancelButtonText: "No, keep going",
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    });

                    if (result.isConfirmed) {
                    endShift();  // stop UI timer + popup
                    await submit();  // send data
                    }
                  }}
                    className="bg-reject text-white px-4 py-2 rounded mr-2"
                  >
                    End Shift
                </button>
                </>
              )}
            </div>
          </div>

          {/* Application Usage Section */}
          <div className="bg-white/40 p-4 shadow rounded-lg mt-4 ml-40 mr-50">
            <h2 className="flex flex-col items-center justify-center bg-cover bg-center p-2 text-[#122D3B] font-bold">Application Usage</h2>
            <div className="w-full mt-2">
              <div className="flex bg-gray-200 font-semibold">
                <div className="w-1/2 p-2 border border-gray-300">Application</div>
                <div className="w-1/2 p-2 border border-gray-300">Usage Time</div>
              </div>

              {Object.entries(usageMap).length === 0 ? (
                <div className="w-full p-2 text-center">No application usage data available.</div>
              ) : (
                Object.entries(usageMap).map(([app, time]) => (
                  <div key={app} className="flex">
                    <div className="w-1/2 p-2 border border-gray-300">{app}</div>
                    <div className="w-1/2 p-2 border border-gray-300">{formatTime(time)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="w-1/3 p-4 h-screen">
          <ChatWindow />
        </div>
      </div>
    </motion.div>
  )
}

export default EmployeeShift
