import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigator = useNavigate();
  const handleJoin = () => {
    const normalizedRoomId = roomId.trim();
    const normalizedUsername = username.trim();
    if (!normalizedRoomId) {
      toast.error("Please enter a Room ID");
      return;
    }
    if (!normalizedUsername) {
      toast.error("Please enter a Username");
      return;
    }
    navigator(`editor/${normalizedRoomId}`, {
      state: {
        username: normalizedUsername,
      },
    });

  };
  const keyHandler = (e) => {
    if (e.code === "Enter") {
      handleJoin();
    }
  };
  const handleCreateNewRoom = (e) => {
    e.preventDefault();
    const newRoomId = uuidv4();
    setRoomId(newRoomId);
    toast.success("Created a new room");
  };
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-800/70 p-10 shadow-2xl backdrop-blur">
        <header className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/60 bg-white">
            <img
              src={logo}
              alt="Code sync logo"
              className="h-10 w-10 object-contain"
            />
          </div>
          <div>
            <p className="text-3xl font-semibold leading-tight">Code Share</p>
            <p className="text-sm text-emerald-400">Realtime collaboration</p>
          </div>
        </header>

        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-200">
              Paste invitation ROOM ID
            </label>
            <input
              type="text"
              placeholder="ROOM ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={keyHandler}
              className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-base placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-200">
              Username
            </label>
            <input
              type="text"
              placeholder="USERNAME"
              value={username}
              onKeyDown={keyHandler}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-4 py-3 text-base placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
            />
          </div>

          <button
            type="button"
            onClick={handleJoin}
            className="self-end rounded-xl bg-emerald-400 px-8 py-3 text-base font-semibold text-slate-900 shadow-lg transition hover:bg-emerald-300"
          >
            Join
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-300">
          If you don&apos;t have an invite then create{" "}
          <button
            type="button"
            onClick={handleCreateNewRoom}
            className="font-semibold text-emerald-400 hover:underline bg-transparent border-none cursor-pointer"
          >
            new room
          </button>
        </p>
      </div>
    </div>
  );
};
export default Home;
