import { useEffect, useState } from "react";
import ChooseMethod from "../components/locked/ChooseMethod";
import SetupPin from "../components/locked/SetupPin";
import SetupPassword from "../components/locked/SetupPassword";
import EnterPin from "../components/locked/EnterPin";
import EnterPassword from "../components/locked/EnterPassword";
import { useDispatch, useSelector } from "react-redux";
import { getLockedStatus, exitLocked } from "../redux/lockedSlice";


export default function LockedFolderPage() {
  const dispatch = useDispatch();
  const { lockedFolders, lockedFiles, isUnLocked, unlockToken } = useSelector((state) => state.locked);
  console.log("Locked Folder Page ", lockedFolders, lockedFiles, isUnLocked, unlockToken);
  const [loading, setLoading] = useState(true);
  const [isSetup, setIsSetup] = useState(false);
  const [method, setMethod] = useState(null); // pin or password

  const getStatus = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getLockedStatus()).unwrap();
      console.log("Locked ", res);

      setIsSetup(res.data?.isSetup);
      const mth = res?.data?.isSetup ? res.data.unlockMethod : null;
      setMethod(mth || null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching locked folder status:", error);
      setLoading(false);

    }

  }
  useEffect(() => {
    getStatus();
  }, []);

  const goBack = () => {
    setMethod(null);
  }

  const exitSubmit = async () => {
    try {
      await dispatch(exitLocked());
      // setIsSetup(false);
      // setMethod(null);
    } catch (error) {
      console.error("Error exiting locked folder:", error);
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!isSetup && method === null)
    return <ChooseMethod setMethod={setMethod} />;

  if (!isSetup && method === "pin")
    return <SetupPin onDone={() => setIsSetup(true)} goBack={goBack} />;

  if (!isSetup && method === "password")
    return <SetupPassword onDone={() => setIsSetup(true)} goBack={goBack} />;

  if (isSetup && !unlockToken) {
    if (method === "pin")
      return <EnterPin />;
    return <EnterPassword />;
    // return <EnterPin setToken={unlockToken} />;
    // return <EnterPassword setToken={unlockToken} />;
  }

  // <LockedFiles token={unlockToken} />
  return (<>
    <div>
      <button type="button" onClick={exitSubmit} className="p-2 bg-red-400 hover:bg-red-600 text-white rounded ">Exit </button>
      <h2 className="text-2xl font-bold mb-4">Locked Folder Unlocked</h2>
      <p className="mb-4">You have successfully unlocked your locked folder.</p>
      <h3 className="text-xl font-semibold mb-2">Locked Files:</h3>
    </div>
  </>);
}
