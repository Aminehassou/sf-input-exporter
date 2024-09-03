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
    if (e.key === "Backspace") {
      e.preventDefault();
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

  const convertToIconNotation = () => {
    if (inputRef.current) {
      const iconMap: { [key: string]: string } = {
        "1": "1.png",
        "2": "2.png",
        "3": "3.png",
        "4": "4.png",
        "5": "5.png",
        "6": "6.png",
        "7": "7.png",
        "8": "8.png",
        "9": "9.png",
        lp: "lp.png",
        mp: "mp.png",
        hp: "hp.png",
        lk: "lk.png",
        mk: "mk.png",
        hk: "hk.png",
        "[2]": "charge2.png",
        "[4]": "charge4.png",
        "[6]": "charge6.png",
      };

      const convertTextNode = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
          const fragment = document.createDocumentFragment();
          const regex = new RegExp(
            `(${Object.keys(iconMap)
              .map((key) => key.replace(/[[\]]/g, "\\$&"))
              .join("|")})`,
            "gi"
          );
          let lastIndex = 0;
          let match;

          while ((match = regex.exec(node.textContent)) !== null) {
            if (match.index > lastIndex) {
              fragment.appendChild(
                document.createTextNode(
                  node.textContent.slice(lastIndex, match.index)
                )
              );
            }
            const img = document.createElement("img");
            img.src = `./images/icons/${iconMap[match[0].toLowerCase()]}`;
            img.alt = match[0];
            fragment.appendChild(img);
            lastIndex = regex.lastIndex;
          }

          if (lastIndex < node.textContent.length) {
            fragment.appendChild(
              document.createTextNode(node.textContent.slice(lastIndex))
            );
          }

          node.parentNode?.replaceChild(fragment, node);
        } else if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.nodeName !== "IMG"
        ) {
          Array.from(node.childNodes).forEach(convertTextNode);
        }
      };

      Array.from(inputRef.current.childNodes).forEach(convertTextNode);
      setInputValue(inputRef.current.innerHTML);
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
      <div className="button-container">
        <button onClick={handleExport} className="export-button">
          Export as Image
        </button>
        <button onClick={convertToIconNotation} className="convert-button">
          Convert to Icon Notation
        </button>
      </div>
      <div className="images-list-container">
        <ImagesList onImageClick={handleImageClick} />
      </div>
    </div>
  );
};

export default App;
