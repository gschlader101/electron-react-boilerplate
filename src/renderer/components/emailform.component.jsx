/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useDeferredValue,
  useMemo,
} from 'react';
import './emailform.css';
import FileUploadComponent from './fileupload.component';

// const data = [
//   { email: 'johndoe@example.com', firstname: 'John', lastname: 'Doe',  },
// //   // Add more data objects as needed
// ];

function FormComponent() {
  const fileUploadRef = useRef(null);

  const [data, setData] = useState([]);

  const datalist = useMemo()

  const [selectedFile, setSelectedFile] = useState(null);
  const [showFile, setShowFile] = useState(true);

  const [formData, setFormData] = useState({
    email: '',
    firstname: '',
    lastname: '',
  });

  const deferredFormData = useDeferredValue(formData);

  //   setBananas(bananas + 1, (prevValue, newValue) => {
  //     console.log(newValue);
  // });

  const [matchingData, setMatchingData] = useState([]);

  const [message, setMessage] = useState('');

  const handleCtrlS = useCallback(() => {
    // Perform your desired action when Ctrl+s is pressed
    if (fileUploadRef.current) {
      fileUploadRef.current.handleSaveFile();
    }
  }, []);

  const handleCtrlF = useCallback(() => {
    setShowFile((prev) => !prev);
  }, []);

  const searchMatchingData = useCallback(() => {
    if (
      !deferredFormData.email &&
      !deferredFormData.firstname &&
      !deferredFormData.lastname
    )
      return;
    const matches = data.filter((item) => {
      const { email, firstname, lastname } = deferredFormData;

      return (
        item.email
          .toString()
          .toLowerCase()
          .includes(email.toString().toLowerCase()) &&
        item.firstname
          .toString()
          .toLowerCase()
          .includes(firstname.toString().toLowerCase()) &&
        item.lastname
          .toString()
          .toLowerCase()
          .includes(lastname.toString().toLowerCase())
      );
    });
    setMatchingData(matches);
  }, [data, deferredFormData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }, []);

  const deleteRow = (row) => {
    const delindex = data.findIndex((item) => item.email === row.email);
    data.splice(delindex, 1);
  };

  const handleSelect = (event) => {
    const selection = event.target.innerText.split(' ');
    const row = {
      email: selection?.[0] || '',
      firstname: selection?.[1] || '',
      lastname: selection?.[2] || '',
    };
    setFormData({ ...row });
    if (event.ctrlKey) {
      setMessage('email deleted...');
      deleteRow(row);
    }
  };

  const handleSave = (event) => {
    event.preventDefault();
    const row = {
      email: formData?.email.toString().toLowerCase() || '',
      firstname: formData?.firstname || '',
      lastname: formData?.lastname || '',
    };
    if (
      data.findIndex(
        (elem) =>
          elem.email.toString().toLowerCase() ===
          row.email.toString().toLowerCase()
      ) === -1
    ) {
      data.push(row);
      setMessage('saved...');
    } else {
      const id = data.findIndex((elem) => elem.email === row.email);
      data.splice(id, 1, row);
      setMessage('updated...');
    }
  };

  const handleReset = () => {
    setFormData({});
    const row = {
      email: '',
      firstname: '',
      lastname: '',
    };
    setFormData({ ...row });
    setMatchingData([]);
    setMessage('');
  };

  useEffect(() => {
    searchMatchingData();
  }, [searchMatchingData, handleInputChange]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault(); // Prevent the default browser behavior (e.g., saving the page)
        handleCtrlS(); // Call your desired function when Ctrl+s is pressed
      }
      if (event.ctrlKey && event.key === 'f') {
        event.preventDefault(); // Prevent the default browser behavior (e.g., saving the page)
        handleCtrlF();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress); // Clean up the event listener when the component unmounts
    };
  }, [handleCtrlF, handleCtrlS]); // Empty dependency array ensures the effect runs only once

  return (
    <div className="maincontainer">
      {showFile && (
        <FileUploadComponent
          ref={fileUploadRef}
          data={data}
          setData={setData}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      )}
      <pre className="res">{message}</pre>
      <form className="formcss">
        <label htmlFor="email" className="lb">
          email:
        </label>
        <input
          className="infos"
          type="text"
          spellCheck="false"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <label className="lb" htmlFor="name">
          Vorname:
        </label>
        <input
          className="infos"
          type="text"
          spellCheck="false"
          id="firstname"
          name="firstname"
          value={formData.firstname}
          onChange={handleInputChange}
        />
        <label className="lb" htmlFor="name">
          Nachname:
        </label>
        <input
          className="infos"
          type="text"
          spellCheck="false"
          id="lastname"
          name="lastname"
          value={formData.lastname}
          onChange={handleInputChange}
        />

        <button id="send" type="button" onClick={handleSave}>
          Save
        </button>
        <button id="limpar" type="button" onClick={handleReset}>
          Clear{' '}
        </button>
      </form>
      <pre className="res">
        <ul>
          {matchingData.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={index} onClick={handleSelect}>
              {item.email} {item.firstname} {item.lastname}
            </li>
          ))}
        </ul>
      </pre>
    </div>
  );
}

export default FormComponent;
