import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import './fileupload.css';

// eslint-disable-next-line react/prop-types
const FileUploadComponent = forwardRef(
  // eslint-disable-next-line react/prop-types
  ({ data, setData, selectedFile, setSelectedFile }, ref) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileData = e.target.result;
        setData(JSON.parse(fileData));
        //   console.log(data);
      };

      if (file) {
        reader.readAsText(file);
        setSelectedFile(file);
      }
    };

    const handleSaveFile = () => {
      if (data) {
        const blob = new Blob([JSON.stringify(data)], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        // eslint-disable-next-line react/prop-types
        link.download = selectedFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    };

    useImperativeHandle(ref, () => ({
      handleSaveFile,
    }));

    const handleBrowseClick = () => {
      fileInputRef.current.click();
    };

    return (
      <>
        <div>
          <input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <button className="fbutton" type="button" onClick={handleBrowseClick}>
            {selectedFile ? (
              // eslint-disable-next-line react/prop-types
              <span>Datei auswählen: {selectedFile.name}</span>
            ) : (
              <span>Datei auswählen</span>
            )}
          </button>
        </div>
        <div>
          <button className="save" type="button" onClick={handleSaveFile}>
            Save File
          </button>
        </div>
      </>
    );
  }
);

export default FileUploadComponent;
