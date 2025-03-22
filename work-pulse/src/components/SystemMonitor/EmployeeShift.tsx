import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import bg from "../../assets/images/bg.png";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ChatWindow from "./SubComponents/ChatWindow"; // Import the separate chat window component
dayjs.extend(duration);

const EmployeeShift = () => {
  const [shiftStarted, setShiftStarted] = useState(false);
  const [shiftPaused, setShiftPaused] = useState(false);
  const [startTime, setStartTime] = useState(0); // Stores actual start time
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pauseStart, setPauseStart] = useState(0);
  const [totalPausedDuration, setTotalPausedDuration] = useState(0);
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (shiftStarted && !shiftPaused) {
      timer = setInterval(() => {
        setElapsedTime(dayjs().unix() - startTime - totalPausedDuration);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [shiftStarted, shiftPaused, startTime, totalPausedDuration]);

  const startShift = () => {
    const now = dayjs().unix();
    setStartTime(now);
    setElapsedTime(0);
    setShiftStarted(true);
    setShiftPaused(false);
    setPauseStart(0);
    setTotalPausedDuration(0);
  };

  const pauseShift = () => {
    setShiftPaused(true);
    setPauseStart(dayjs().unix()); // Store the time when pause started
  };

  const resumeShift = () => {
    if (pauseStart) {
      const pauseDuration = dayjs().unix() - pauseStart;
      setTotalPausedDuration((prev) => prev + pauseDuration); // Accumulate total paused time
    }
    setShiftPaused(false);
    setPauseStart(0);
  };

  const endShift = () => {
    setEndTime(dayjs().format("YYYY-MM-DD HH:mm:ss"));
    setShiftStarted(false);
    setShiftPaused(true);
    alert(`Shift ended. Total time: ${formatTime(elapsedTime)}`);
  };

  const formatTime = (seconds = 0) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

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
            <button className="absolute top-6 left-6 text-accent hover:text-reject p-3 rounded-full flex items-center">
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
              <button onClick={startShift} className="bg-[#ADEDFF] text-white px-4 py-2 rounded mr-2">
                Start Shift
              </button>
            ) : shiftPaused ? (
              <button onClick={resumeShift} className="bg-[#122D3B] text-white px-4 py-2 rounded mr-2">
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
      </div>

      {/* Right Section - Chat Window */}
      <div className="w-1/3 p-4">
        <ChatWindow />
      </div>
    </div>
    
    </motion.div>
  );
};

export default EmployeeShift;
