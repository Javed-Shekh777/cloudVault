import { useState } from "react";
import { useDispatch } from "react-redux";
import { getLockedData, getLockedStatus, setLocked, setUnlocked } from '../../redux/lockedSlice';

// export default function EnterPin({ setToken }) {

export default function EnterPin() {

    const [pin, setPin] = useState("");
    const dispatch = useDispatch();

    const handleLogin = async () => {
        const res = await dispatch(setUnlocked({ unlockMethod: "pin", credential: pin })).unwrap();
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Enter PIN</h2>

            <input
                type="password"
                className="border w-full p-2 rounded mb-4"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
            />

            <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-2 rounded"
            >
                Unlock
            </button>
        </div>
    );
}
