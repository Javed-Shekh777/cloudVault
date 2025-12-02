// src/utils/fileActions.js

import { moveFileToFolder, toggleLockedFile, toggleTrashFile } from "../redux/driveSlice";
import toast from "react-hot-toast";
import { store } from "../redux/store";

const fileActions = {
    open: (file) => {
        if (!file?.secure_url) return console.error("Invalid file URL");
        window.open(file.secure_url, "_blank");
    },

    rename: (file) => {
        console.log("Rename:", file);
    },

    trash: (file) => {
        store.dispatch(toggleTrashFile(file))
            .unwrap()
            .then(res => {
                console.log("From Trash Toggle", res);
                toast.success(res?.message || "Action successful");
            })
            .catch(err => {
                toast.error(err.message || "Failed to update trash status");
            });
    },

    move: (file, folder) => {
        store.dispatch(moveFileToFolder({ folderId: folder?._id, fileId: file?._id }))
            .unwrap()
            .then(res => {
                console.log("From move ", res);
                toast.success(res?.message || "Action successful");
            })
            .catch(err => {
                toast.error(err.message || "Failed to update trash status");
            });
    },

    copy: (file) => {
        console.log("Copy:", file);
    },
    moveLocked: (file) => {
        store.dispatch(toggleLockedFile(file))
            .unwrap()
            .then(res => {
                console.log("From Locked Toggle", res);
                toast.success(res?.message || "Action successful");
            })
            .catch(err => {
                toast.error(err.message || "Failed to update locked status");
            });
    },

    download: (file) => {
        if (!file?.downloadUrl) return console.error("Download URL not found");

        const link = document.createElement("a");
        link.href = file.downloadUrl;
        link.download = file.filename || "downloaded_file";
        link.click();
        link.remove();
    },
};

export default fileActions;
