// components/UploadProgressMonitor.jsx (Updated)

import { useState, useEffect } from 'react';
import { MdCheckCircle, MdError, MdUpload, MdClose } from 'react-icons/md';

export default function UploadProgressMonitor({ uploads, onCloseMonitor }) {
    const [isOpen, setIsOpen] = useState(true);

    if (uploads.length === 0) return null;

    const completedUploads = uploads.filter(u => u.status === 'completed' || u.status === 'failed').length;
    const totalUploads = uploads.length;
    const isAllComplete = completedUploads === totalUploads;
    const title = isAllComplete ? `Uploaded (${completedUploads}/${totalUploads})` : `Uploading (${completedUploads}/${totalUploads})`;

    return (
        <div className="fixed bottom-6 right-6 w-80 bg-white shadow-xl rounded-lg border border-gray-200 z-50">
            {/* यह div सिर्फ टॉगल करने के लिए है (छोटा/बड़ा) */}
            <div className="p-3 border-b flex justify-between items-center">
                <h4 
                title='Toggle window'
                    className="font-semibold text-sm cursor-pointer" 
                    onClick={() => setIsOpen(!isOpen)} // सिर्फ टॉगल करता है
                >
                    {title}
                </h4>
                
                {/* यह बटन सिर्फ बंद करने के लिए है (पूरा बॉक्स हटा दें) */}
                <button 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        onCloseMonitor(); // Parent component का क्लोज हैंडलर
                    }} 
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                    <MdClose />
                </button>
            </div>

            {/* यह हिस्सा सिर्फ तभी दिखता है जब isOpen true होता है */}
            {isOpen && (
                <div className="max-h-60 overflow-y-auto">
                    {uploads.map((upload) => (
                        <div key={upload.id} className="p-3 flex items-center gap-3 border-b last:border-b-0">
                            {/* ... (Rest of the upload item UI: icons, progress bars) ... */}
                            {upload.status === 'uploading' && <MdUpload className="text-blue-500" />}
                            {upload.status === 'completed' && <MdCheckCircle className="text-green-500" />}
                            {upload.status === 'failed' && <MdError className="text-red-500" />}

                            <div className="grow min-w-0">
                                <div className="text-xs truncate">{upload.fileName}</div>
                                {upload.status === 'uploading' && (
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                        <div
                                            className="bg-blue-600 h-1.5 rounded-full"
                                            style={{ width: `${upload.progress || 0}%` }}
                                        ></div>
                                    </div>
                                )}
                                <div className='text-xs text-gray-500 mt-0.5'>
                                    {upload.status === 'completed' ? 'completed' : upload.status === 'failed' ? 'failed' : `${Math.round(upload.progress || 0)}%`}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
