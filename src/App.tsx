import { useState, useRef, KeyboardEvent } from "react";
import html2canvas from "html2canvas";
import "./App.scss";
import ImagesList from "./components/ImagesList";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (filename: string) => {
    if (inputRef.current) {
      const img = document.createElement("img");
      img.src = `./images/icons/${filename}`;
      img.alt = filename;
      inputRef.current.appendChild(img);
      setInputValue(inputRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.key === "Backspace") {
      if (inputRef.current) {
        const lastChild = inputRef.current.lastChild;
        if (lastChild) {
          inputRef.current.removeChild(lastChild);
          setInputValue(inputRef.current.innerHTML);
        }
      }
    }
  };

  const handleExport = async () => {
    if (inputRef.current) {
      const canvas = await html2canvas(inputRef.current, {
        backgroundColor: null,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "exported-icons.png";
      link.click();
    }
  };

  return (
    <div className="flex-container">
      <label htmlFor="input-preview">Input Preview</label>
      <div
        id="input-preview"
        ref={inputRef}
        contentEditable
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: inputValue }}
        className="input-preview"
        tabIndex={0}
      />
      <button onClick={handleExport} className="export-button">
        Export as Image
      </button>
      <div className="images-list-container">
        <ImagesList onImageClick={handleImageClick} />
      </div>
    </div>
  );
};

export default App;
