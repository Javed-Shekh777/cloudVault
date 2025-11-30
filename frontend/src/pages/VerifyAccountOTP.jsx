import { useEffect, useMemo, useRef, useState } from "react";

/**
 * OTPInput
 * - length: number of boxes (default 6)
 * - onComplete: callback when all digits are filled (otpString)
 * - autoFocus: focus the first box on mount
 */
import React from 'react'
import { getDeviceId } from "../utils/common";
import { useDispatch } from "react-redux";
import { register } from "../redux/authSlice";
import toast from 'react-hot-toast';

function OTPInput({ length = 6, onComplete, autoFocus = true }) {
    const [values, setValues] = useState(Array(length).fill(""));
    const data = JSON.parse(localStorage.getItem("pendingUser"));
    console.log("Data from pending user:", data, data?.user?.name, data?.email, data?.user?.password);
    const handleChange = (idx, e) => {
        const raw = e.target.value;
        // Accept only digits
        const digit = raw.replace(/\D/g, "").slice(-1); // last typed digit

        setValues((prev) => {
            const next = [...prev];
            next[idx] = digit || "";
            return next;
        });

        if (digit) {
            // Move to next box if a digit was entered
            focusAt(idx + 1);
        }
    };
    return (
        <div className="flex items-center justify-center gap-3">
            {values.map((val, idx) => (
                <input
                    key={idx}
                    value={val}
                    onChange={(e) => onComplete(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={(e) => handlePaste(idx, e)}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="w-12 h-12 text-center text-xl border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label={`OTP digit ${idx + 1}`}
                />
            ))}
        </div>
    );
}


const VerifyAccountOTP = () => {
    const [otp, setOtp] = useState("");
    const dispatch = useDispatch();
    const [loading, setLoading] = useState({ resend: false, verify: false });

    const resendOTP = async () => {
        setLoading({ ...loading, resend: true });

        try {
            const deviceId = getDeviceId();
            const data = JSON.parse(localStorage.getItem("pendingUser"));

            const res = await dispatch(register({
                name: data?.user?.name,
                email: data?.email,
                password: data?.user?.password,
                deviceId
            })).unwrap();

            console.log(res);
            toast.success("OTP resent successfully");
            setLoading({ ...loading, resend: false });

        } catch (err) {
            console.log("err", err);
            setLoading({ ...loading, resend: false });

            toast.error(err?.message || "OTP resend failed");

        }
    };

    return (
        <section className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center">Verify your email</h1>
                <p className="text-center text-gray-500 mt-2">
                    Enter the 6-digit code we sent to your email
                </p>
                {loading.resend && (
                    <p className="text-center p-2 bg-cyan-100 rounded text-sm text-gray-600 mt-2">Resending OTP...</p>
                )}
                <div className="mt-6">
                    <OTPInput length={6} onComplete={(val) => setOtp(val)} />
                </div>

                <button
                    type="button"
                    disabled={otp.length !== 6}
                    className="mt-6 w-full py-3 rounded-xl bg-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading.verify ? "Verifying..." : "Verify Account"}
                </button>

                {otp && (
                    <p className="mt-3 text-center text-sm text-gray-600">OTP: {otp}</p>
                )}

                <p className="text-center text-sm text-gray-500 mt-4">
                    Didn't receive the code? <button type="button" onClick={resendOTP} className="text-green-600 cursor-pointer font-medium">Resend</button>
                </p>
            </div>
        </section>
    );
}

export default VerifyAccountOTP

