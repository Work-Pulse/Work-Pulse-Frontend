import { useState, useEffect } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import bg from '../../assets/images/bg.png';
import ChatWindow from "./SubComponents/ChatWindow"; // Import the separate chat window component
dayjs.extend(duration);

const EmployeeShift = () => {
  const [shiftStarted, setShiftStarted] = useState(false);
  const [shiftPaused, setShiftPaused] = useState(false);
  const [startTime, setStartTime] = useState<number>(0); // Store the start time in seconds
  const [elapsedTime, setElapsedTime] = useState<number>(0); // Elapsed time in seconds
  const [endTime, setEndTime] = useState<string>("");

  // Store the moment the shift was paused for resuming purposes
  const [pauseTime, setPauseTime] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null; // Initialize timer as null
    if (shiftStarted && !shiftPaused) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1); // Increment the elapsed time every second
      }, 1000);
    } else {
      if (timer) clearInterval(timer); // Clear the interval when paused or not started
    }

    return () => {
      if (timer) clearInterval(timer); // Cleanup on unmount or when dependencies change
    };
  }, [shiftStarted, shiftPaused]);

  const startShift = () => {
    const now = dayjs().unix(); // Get current time in Unix timestamp (seconds)
    setStartTime(now); // Set the actual start time
    setShiftStarted(true);
    setShiftPaused(false);
    setElapsedTime(0); // Reset elapsed time on start
    setPauseTime(0); // Reset pause time
  };

  const pauseShift = () => {
    setShiftPaused(true); // Pause the forward timer
    const now = dayjs().unix();
    setPauseTime(now); // Track when the shift was paused
  };

  const resumeShift = () => {
    setShiftPaused(false); // Resume the forward timer
    const now = dayjs().unix();
    const pauseDuration = now - pauseTime; // Calculate the duration of the pause
    setElapsedTime((prevTime) => prevTime + pauseDuration); // Continue the elapsed time without resetting the start time
  };

  const endShift = () => {
    const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
    setEndTime(now);
    setShiftStarted(false);
    setShiftPaused(true);
    const totalShiftTime = elapsedTime; // The total time is just the elapsed time in seconds
    const hours = Math.floor(totalShiftTime / 3600);
    const minutes = Math.floor((totalShiftTime % 3600) / 60);
    const seconds = totalShiftTime % 60;
    alert(`Shift ended. Total time: ${hours}:${minutes}:${seconds}`);
  };

  // Format time as HH:mm:ss
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex h-screen" style={{ backgroundImage: `url(${bg})` }}>
      {/* Left Section - Shift & App Tracking */}
      <div className="w-2/3 p-6">
        <h1 className="text-2xl font-bold text-primary">Employee Shift</h1>

        {/* Shift Timer */}
        <div className="bg-white p-4 shadow rounded-lg mt-4">
          <h2 className="text-lg font-semibold">Shift Timer</h2>
          <p>Start Time: {startTime ? dayjs(startTime * 1000).format("YYYY-MM-DD HH:mm:ss") : "Not started"}</p>
          <p>End Time: {endTime || "Not ended"}</p>
          <p>Total Time: {formatTime(elapsedTime)}</p> {/* Display elapsed time */}

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
                <button
                  onClick={pauseShift}
                  className="bg-[#E0E0E0] text-black px-4 py-2 rounded mr-2"
                >
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
      <div className="w-1/3 p-5">
        <ChatWindow />
      </div>
    </div>
  );
};

export default EmployeeShift;
