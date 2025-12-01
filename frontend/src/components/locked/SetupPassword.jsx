import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUnlocked,setLocked } from "../../redux/lockedSlice";
import { MdArrowBack } from 'react-icons/md';


export default function SetupPassword({ onDone ,goBack}) {
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const handleSubmit = async () => {
        const res = await dispatch(setLocked({ unlockMethod: "password", credential: pin })).unwrap();
        // setToken(res.data.token);
        onDone();

    };


    return (
        <div className="p-6 max-w-md mx-auto">
                        <button type="button" onClick={goBack} className="p-2 rounded bg-slate-100"><MdArrowBack /></button>
            
            <h2 className="text-xl font-bold mb-4">Set Password</h2>

            <input
                type="password"
                className="border w-full p-2 rounded mb-4"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                onClick={handleSubmit}
                className="w-full bg-green-600 text-white py-2 rounded"
            >
                Save Password
            </button>
        </div>
    );
}
