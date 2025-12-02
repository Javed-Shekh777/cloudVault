import { useState } from "react";
import { useDispatch } from "react-redux";

// export default function EnterPassword({ setToken }) {
export default function EnterPassword({startLockedFolderTimeout}) {

    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const handleLogin = async () => {
        const res = await dispatch(setUnlocked({ unlockMethod: "password", credential: password })).unwrap();
        startLockedFolderTimeout();
    };



    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Enter Password</h2>

            <input
                type="password"
                className="border w-full p-2 rounded mb-4"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                onClick={handleLogin}
                className="w-full bg-green-600 text-white py-2 rounded"
            >
                Unlock
            </button>
        </div>
    );
}
