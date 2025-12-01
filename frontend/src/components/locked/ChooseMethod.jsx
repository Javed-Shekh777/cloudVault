export default function ChooseMethod({ setMethod }) {
  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Setup Locked Folder
      </h2>

      <button
        onClick={() => setMethod("pin")}
        className="w-full bg-blue-600 text-white py-2 rounded-lg mb-4"
      >
        Use PIN
      </button>

      <button
        onClick={() => setMethod("password")}
        className="w-full bg-green-600 text-white py-2 rounded-lg"
      >
        Use Password
      </button>
    </div>
  );
}
