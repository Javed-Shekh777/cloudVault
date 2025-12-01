import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUnlocked, setLocked } from "../../redux/lockedSlice";
import { MdArrowBack } from 'react-icons/md';


export default function SetupPin({ onDone, goBack = { goBack } }) {
    const [pin, setPin] = useState("");
console.log("Pin",pin);

    const dispatch = useDispatch();

    const handleSubmit = async () => {
        const res = await dispatch(setLocked({ unlockMethod: "pin", credential: pin })).unwrap();
        // setToken(res?.data?.token);
        onDone();
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <button type="button" onClick={goBack} className="p-2 rounded bg-slate-100"><MdArrowBack /></button>
            <h2 className="text-xl font-bold mb-4">Set PIN</h2>

            <input
                type="password"
                maxLength={6}
                className="border w-full p-2 rounded mb-4"
                placeholder="Enter 4-6 digit PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
            />

            <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 rounded"
            >
                Save PIN
            </button>
        </div>
    );
}
