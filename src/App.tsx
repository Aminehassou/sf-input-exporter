import { useRef, KeyboardEvent, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import "./App.scss";
import ImagesList from "./components/ImagesList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faHandFist,
  faKeyboard,
} from "@fortawesome/free-solid-svg-icons";

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
  "cr.": "2.png",
  "b.": "4.png",
  "j.": "8.png",
  j: "8.png",
  st: "5.png",
  cr: "2.png",
  b: "4.png",
  lp: "lp.png",
  mp: "mp.png",
  hp: "hp.png",
  lk: "lk.png",
  mk: "mk.png",
  hk: "hk.png",
  p: "p.png",
  k: "k.png",
  xx: "plus.png",
  x: "plus.png",
  drc: "drc.png",
  ",": "linkr.png",
  "->": "linkr.png",
  ">": "linkr.png",
  "[2]": "charge2.png",
  "[4]": "charge4.png",
  "[6]": "charge6.png",
  lvl1: "sa1.png",
  "lvl 1": "sa1.png",
  "level 1": "sa1.png",
  sa1: "sa1.png",
  "sa 1": "sa1.png",
  lvl2: "sa2.png",
  "lvl 2": "sa2.png",
  "level 2": "sa2.png",
  sa2: "sa2.png",
  "sa 2": "sa2.png",
  lvl3: "sa3.png",
  "lvl 3": "sa3.png",
  "level 3": "sa3.png",
  sa3: "sa3.png",
  "sa 3": "sa3.png",
  di: "di.png",
};

const iconToTextMap: { [key: string]: string } = {
  "1.png": "1",
  "2.png": "2",
  "3.png": "3",
  "4.png": "4",
  "5.png": "5",
  "6.png": "6",
  "7.png": "7",
  "8.png": "8",
  "9.png": "9",
  "lp.png": "lp",
  "mp.png": "mp",
  "hp.png": "hp",
  "lk.png": "lk",
  "mk.png": "mk",
  "hk.png": "hk",
  "p.png": "p",
  "k.png": "k",
  "plus.png": "x",
  "drc.png": "drc",
  "linkr.png": ",",
  "charge2.png": "[2]",
  "charge4.png": "[4]",
  "charge6.png": "[6]",
  "sa1.png": "sa1",
  "sa2.png": "sa2",
  "sa3.png": "sa3",
  "di.png": "di",
};

const App = () => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [iconSize, setIconSize] = useState(70);

  const handleImageClick = (filename: string) => {
    if (inputRef.current) {
      const img = document.createElement("img");
      img.src = `./images/icons/${filename}`;
      img.alt = filename;
      img.style.width = `${iconSize}px`;
      img.style.height = `${iconSize}px`;
      inputRef.current.appendChild(img);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace") {
      const selection = window.getSelection();
      if (selection && inputRef.current && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        if (range.collapsed) {
          e.preventDefault();
          const node = range.startContainer;

          if (node === inputRef.current) {
            if (range.startOffset > 0) {
              const childNode =
                inputRef.current.childNodes[range.startOffset - 1];
              if (childNode.nodeType === Node.TEXT_NODE) {
                const textNode = childNode as Text;
                if (textNode.length > 0) {
                  textNode.deleteData(textNode.length - 1, 1);
                  if (textNode.length === 0) {
                    inputRef.current.removeChild(textNode);
                  }
                }
              } else {
                inputRef.current.removeChild(childNode);
              }
            }
          } else if (node.nodeType === Node.TEXT_NODE) {
            const textNode = node as Text;
            if (range.startOffset > 0) {
              if (textNode.length > 0 && range.startOffset - 1 >= 0) {
                textNode.deleteData(range.startOffset - 1, 1);
                if (textNode.length === 0) {
                  textNode.parentNode?.removeChild(textNode);
                }
              }
            } else if (textNode.previousSibling) {
              const prevNode = textNode.previousSibling;
              if (prevNode.nodeType === Node.TEXT_NODE) {
                const prevTextNode = prevNode as Text;
                if (prevTextNode.length > 0) {
                  prevTextNode.deleteData(prevTextNode.length - 1, 1);
                  if (prevTextNode.length === 0) {
                    prevTextNode.parentNode?.removeChild(prevTextNode);
                  }
                }
              } else if (prevNode.nodeType === Node.ELEMENT_NODE) {
                prevNode.parentNode?.removeChild(prevNode);
              }
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const elementNode = node as HTMLElement;
            if (elementNode.nodeName === "IMG") {
              elementNode.parentNode?.removeChild(elementNode);
            } else if (range.startOffset > 0) {
              const childNode = elementNode.childNodes[range.startOffset - 1];
              if (childNode.nodeType === Node.TEXT_NODE) {
                const textNode = childNode as Text;
                if (textNode.length > 0) {
                  textNode.deleteData(textNode.length - 1, 1);
                  if (textNode.length === 0) {
                    textNode.parentNode?.removeChild(textNode);
                  }
                }
              } else {
                elementNode.removeChild(childNode);
              }
            } else if (elementNode.previousSibling) {
              const prevNode = elementNode.previousSibling;
              if (prevNode.nodeType === Node.TEXT_NODE) {
                const prevTextNode = prevNode as Text;
                if (prevTextNode.length > 0) {
                  prevTextNode.deleteData(prevTextNode.length - 1, 1);
                  if (prevTextNode.length === 0) {
                    prevTextNode.parentNode?.removeChild(prevTextNode);
                  }
                }
              } else if (prevNode.nodeType === Node.ELEMENT_NODE) {
                prevNode.parentNode?.removeChild(prevNode);
              }
            }
          }
        } else {
          e.preventDefault();
          range.deleteContents();
          selection.collapseToStart();
        }
      }
    }
  };

  // Export the content to an image
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

  // Escape special regex characters
  const escapeRegex = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  // Only block partial matches if preceded by a letter
  // i.e. (?<![A-Za-z]) => do not match if a letter is right before
  // We do NOT include st. in the iconMap because we want to remove it altogether.
  const buildRegexFromMap = (iconMap: { [key: string]: string }) => {
    // Sort keys by length descending to match longer tokens first
    const escapedKeys = Object.keys(iconMap)
      .sort((a, b) => b.length - a.length)
      .map(escapeRegex);
    // Match any of the tokens, regardless of what comes before
    return new RegExp(`(?:${escapedKeys.join("|")})`, "gi");
  };

  const convertToIconNotation = () => {
    if (!inputRef.current) return;

    const removeStDotRegex = /st\./gi;

    const regex = buildRegexFromMap(iconMap);

    const convertTextNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        const text = node.textContent.replace(removeStDotRegex, "");

        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
          if (match.index > lastIndex) {
            fragment.appendChild(
              document.createTextNode(text.slice(lastIndex, match.index))
            );
          }

          const matchedKey = match[0].toLowerCase();
          const iconFile = iconMap[matchedKey] || null;

          if (matchedKey === "5") {
            // Do nothing, skip adding icon or text
          } else if (iconFile) {
            const img = document.createElement("img");
            img.src = `./images/icons/${iconFile}`;
            img.alt = iconToTextMap[iconFile] || match[0];
            img.style.width = `${iconSize}px`;
            img.style.height = `${iconSize}px`;
            fragment.appendChild(img);
          } else {
            fragment.appendChild(document.createTextNode(match[0]));
          }

          lastIndex = regex.lastIndex;
        }

        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
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
  };

  const convertToNumpadNotation = () => {
    if (inputRef.current) {
      const nodes = Array.from(inputRef.current.childNodes);
      let result = "";
      const directions = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "[2]",
        "[4]",
        "[6]",
      ];
      const buttons = ["lp", "mp", "hp", "lk", "mk", "hk", "p", "k"];
      const delimiters = [",", "xx", "drc"];
      let prevToken: string | null = null;
      let lastWasDelimiter = false;

      nodes.forEach((node, idx) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === "IMG") {
          const imgElement = node as HTMLImageElement;
          const imageName = imgElement.src.split("/").pop() || "";
          const textEquivalent = iconToTextMap[imageName];

          if (textEquivalent) {
            // If this is a punch/kick and previous token is not a direction, prepend 5
            if (
              buttons.includes(textEquivalent.toLowerCase()) &&
              !directions.includes(prevToken || "")
            ) {
              result += "5" + textEquivalent;
              prevToken = textEquivalent;
            } else {
              result += textEquivalent;
              prevToken = textEquivalent;
            }
            // Add a space after delimiters
            if (delimiters.includes(textEquivalent.toLowerCase())) {
              result += " ";
              lastWasDelimiter = true;
            } else {
              lastWasDelimiter = false;
            }
          }
        } else if (node.nodeType === Node.TEXT_NODE) {
          // Only add non-space text content
          const text = node.textContent?.replace(/\s+/g, "") || "";
          // For text, update prevToken for each character
          for (let i = 0; i < text.length; i++) {
            result += text[i];
            prevToken = text[i];
            // Add a space after delimiters
            if (delimiters.includes(text[i].toLowerCase())) {
              result += " ";
              lastWasDelimiter = true;
            } else {
              lastWasDelimiter = false;
            }
          }
        }
        // Add a space between logical groups (if not last node)
        if (idx < nodes.length - 1) {
          // Peek at next node's textEquivalent if it's an IMG
          let nextIsDelimiter = false;
          let nextIsDirection = false;
          let currIsDirection = false;
          const nextNode = nodes[idx + 1];
          if (
            nextNode.nodeType === Node.ELEMENT_NODE &&
            nextNode.nodeName === "IMG"
          ) {
            const imgElement = nextNode as HTMLImageElement;
            const imageName = imgElement.src.split("/").pop() || "";
            const textEquivalent = iconToTextMap[imageName];
            if (textEquivalent) {
              if (delimiters.includes(textEquivalent.toLowerCase())) {
                nextIsDelimiter = true;
              }
              if (directions.includes(textEquivalent)) {
                nextIsDirection = true;
              }
            }
          } else if (nextNode.nodeType === Node.TEXT_NODE) {
            const text = nextNode.textContent?.replace(/\s+/g, "") || "";
            if (text.length > 0) {
              if (delimiters.includes(text[0].toLowerCase())) {
                nextIsDelimiter = true;
              }
              if (directions.includes(text[0])) {
                nextIsDirection = true;
              }
            }
          }
          // Check if current token is a direction
          if (prevToken && directions.includes(prevToken)) {
            currIsDirection = true;
          }
          // Only add a space if:
          // - Not both current and next are directions
          // - Not just after a delimiter (already handled)
          // - Not just before a delimiter (handled by delimiter logic)
          if (
            !lastWasDelimiter &&
            !nextIsDelimiter &&
            !(currIsDirection && nextIsDirection)
          ) {
            result += " ";
          }
        }
      });

      // Clear the input and add the concatenated result
      inputRef.current.innerHTML = "";
      inputRef.current.appendChild(document.createTextNode(result.trim()));
    }
  };

  // Update all icons in the input field when the icon size changes
  useEffect(() => {
    if (inputRef.current) {
      const images = inputRef.current.querySelectorAll("img");
      images.forEach((img) => {
        img.style.width = `${iconSize}px`;
        img.style.height = `${iconSize}px`;
      });
    }
  }, [iconSize]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData("text/plain");
      if (text) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(text));
          range.collapse(false);
        }
      }
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("paste", handlePaste as EventListener);
    }
    return () => {
      if (inputElement) {
        inputElement.removeEventListener("paste", handlePaste as EventListener);
      }
    };
  }, []);

  return (
    <div className="flex-container">
      <label htmlFor="input-preview">Input Preview</label>
      <div
        id="input-preview"
        ref={inputRef}
        contentEditable
        onKeyDown={handleKeyDown}
        className="input-preview"
        tabIndex={0}
      />
      <div className="size-control">
        <label htmlFor="icon-size">Icon Size</label>
        <input
          id="icon-size"
          type="range"
          min="20"
          max="150"
          value={iconSize}
          onChange={(e) => setIconSize(parseInt(e.target.value))}
        />
        <span>{iconSize}px</span>
      </div>
      <div className="button-container">
        <button onClick={handleExport} className="export-button">
          <FontAwesomeIcon icon={faDownload} className="button-icon" />
          Export as Image
        </button>
        <button onClick={convertToIconNotation} className="convert-button">
          <FontAwesomeIcon icon={faHandFist} className="button-icon" />
          Convert to Icon Notation
        </button>
        <button onClick={convertToNumpadNotation} className="convert-button">
          <FontAwesomeIcon icon={faKeyboard} className="button-icon" />
          Convert to Numpad Notation
        </button>
      </div>
      <div className="images-list-container">
        <ImagesList onImageClick={handleImageClick} />
      </div>
    </div>
  );
};

export default App;
