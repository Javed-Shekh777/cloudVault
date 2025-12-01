import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { logout, logoutAsync, setCredentials, updateProfile } from "../redux/authSlice";

export default function Profile() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        name: user?.name || "",
        profileImage: null, // store File object here
    });


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            if (form.profileImage) {
                formData.append("profileImage", form.profileImage);
            }
            console.log(formData);
            const res = await dispatch(updateProfile(formData)).unwrap();
            console.log("Updated:", res);

            // update redux state with new user

        } catch (err) {
            console.error("Err", err);
        }
    };

    // Preview logic
    const previewImage =
        form.profileImage
            ? URL.createObjectURL(form.profileImage)
            : user?.profileImage?.url || "https://via.placeholder.com/80";

    const logoutHandle = () => {
        dispatch(logoutAsync());
    }
    return (
        <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">My Profile</h2>

            <div className="flex items-center gap-4">
                <img
                    src={previewImage}
                    alt="avatar"
                    className="w-20 h-20 rounded-full border object-cover"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setForm({ ...form, profileImage: e.target.files[0] })
                    }
                    className="flex-1 border rounded px-3 py-2"
                />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3" encType="application/form-data">
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    // disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    {/* {isLoading ? "Updating..." : "Update Profile"} */}Update Profile
                </button>
                <div className="flex w-full  justify-end">
                    <button
                        type="button"
                        onClick={logoutHandle}
                        className="w-fit px-3 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>
            </form>
        </div>
    );
}
