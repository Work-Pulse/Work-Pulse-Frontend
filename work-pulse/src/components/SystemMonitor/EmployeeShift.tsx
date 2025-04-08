import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import bg from "../../assets/images/bg.png"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import ChatWindow from "./SubComponents/ChatWindow"

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
      console.log("📩 Received usage update:", data)
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
    alert(`Shift ended. Total time: ${formatTime(elapsedTime)}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col justify-center min-h-screen bg-cover bg-center p-6 bg-fixed"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="w-full">
        <div className="fixed">
          <Link to="/employeedashboard">
            <button className="absolute top-6 left-6 text-accent hover:text-reject p-3 rounded-full flex items-center font-extrabold">
              <ArrowLeft size={24} className="mr-2" /> Back
            </button>
          </Link>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Left Section - Shift & App Tracking */}
        <div className="w-2/3 p-6">
          {/* Shift Timer */}
          <div className="bg-white p-4 shadow rounded-lg mt-20 ml-40 mr-50">
            <h2 className="text-lg font-semibold">Shift Timer</h2>
            <p>Start Time: {startTime ? dayjs.unix(startTime).format("YYYY-MM-DD HH:mm:ss") : "Not started"}</p>
            <p>End Time: {endTime || "Not ended"}</p>
            <p>Total Time: {formatTime(elapsedTime)}</p>

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
                  <button onClick={endShift} className="bg-[#FF0000] text-white px-4 py-2 rounded">
                    End Shift
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Application Usage Section */}
          <div className="bg-white p-4 shadow rounded-lg mt-4 ml-40 mr-50">
            <h2 className="text-lg font-semibold">Application Usage</h2>
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

        {/* Right Section - Chat */}
        <div className="w-1/3 p-4">
          <ChatWindow />
        </div>
      </div>
    </motion.div>
  )
}

export default EmployeeShift
