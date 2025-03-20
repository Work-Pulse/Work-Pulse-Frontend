import { useState, useEffect } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import bg from "../../assets/images/bg.png";
import ChatWindow from "./SubComponents/ChatWindow";

dayjs.extend(duration);

const EmployeeShift = () => {
  const [shiftStarted, setShiftStarted] = useState(false);
  const [shiftPaused, setShiftPaused] = useState(false);
  const [startTime, setStartTime] = useState<number>(0); // Start time should not reset
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<string>("");
  const [pauseTime, setPauseTime] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (shiftStarted && !shiftPaused) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [shiftStarted, shiftPaused]);

  const startShift = () => {
    const now = dayjs().unix();
    setStartTime(now); // Set start time only once
    setShiftStarted(true);
    setShiftPaused(false);
    setElapsedTime(0);
    setPauseTime(0);
  };

  const pauseShift = () => {
    setShiftPaused(true);
    setPauseTime(dayjs().unix()); // Record when pause happens
  };

  const resumeShift = () => {
    if (pauseTime) {
      const now = dayjs().unix();
      const pausedDuration = now - pauseTime;
      setElapsedTime((prevTime) => prevTime + pausedDuration); // Adjust elapsed time
    }
    setShiftPaused(false);
  };

  const endShift = () => {
    setShiftStarted(false);
    setShiftPaused(true);
    setEndTime(dayjs().format("YYYY-MM-DD HH:mm:ss"));
    const totalShiftTime = elapsedTime;
    const hours = Math.floor(totalShiftTime / 3600);
    const minutes = Math.floor((totalShiftTime % 3600) / 60);
    const seconds = totalShiftTime % 60;
    alert(`Shift ended. Total time: ${hours}:${minutes}:${seconds}`);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex h-screen" style={{ backgroundImage: `url(${bg})` }}>
      <div className="w-2/3 p-6">
        <h1 className="text-2xl font-bold text-primary">Employee Shift</h1>

        <div className="bg-white p-4 shadow rounded-lg mt-4">
          <h2 className="text-lg font-semibold">Shift Timer</h2>
          <p>
            Start Time:{" "}
            {startTime
              ? dayjs(startTime * 1000).format("YYYY-MM-DD HH:mm:ss")
              : "Not started"}
          </p>
          <p>End Time: {endTime || "Not ended"}</p>
          <p>Total Time: {formatTime(elapsedTime)}</p>

          <div className="mt-4">
            {!shiftStarted ? (
              <button
                onClick={startShift}
                className="bg-[#ADEDFF] text-white px-4 py-2 rounded mr-2"
              >
                Start Shift
              </button>
            ) : shiftPaused ? (
              <button
                onClick={resumeShift}
                className="bg-[#122D3B] text-white px-4 py-2 rounded mr-2"
              >
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
                <button
                  onClick={endShift}
                  className="bg-[#FF0000] text-white px-4 py-2 rounded"
                >
                  End Shift
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="w-1/3 p-5">
        <ChatWindow />
      </div>
    </div>
  );
};

export default EmployeeShift;
