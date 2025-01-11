import { useRef, KeyboardEvent, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import "./App.scss";
import ImagesList from "./components/ImagesList";

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
    const escapedKeys = Object.keys(iconMap).map(escapeRegex);
    return new RegExp(`(?<![A-Za-z])(?:${escapedKeys.join("|")})`, "gi");
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

          if (iconFile) {
            const img = document.createElement("img");
            img.src = `./images/icons/${iconFile}`;
            img.alt = match[0];
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

  const iconToTextMap = Object.fromEntries(
    Object.entries(iconMap).map(([text, image]) => [image, text])
  );

  const convertToNumpadNotation = () => {
    if (inputRef.current) {
      const nodes = Array.from(inputRef.current.childNodes);

      nodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === "IMG") {
          const imgElement = node as HTMLImageElement;
          const imageName = imgElement.src.split("/").pop() || "";
          const textEquivalent = iconToTextMap[imageName];

          if (textEquivalent) {
            const textNode = document.createTextNode(textEquivalent);
            inputRef.current?.replaceChild(textNode, imgElement);

            // Add a space after the text node if the next sibling isn't already a space
            if (
              textNode.nextSibling &&
              textNode.nextSibling.nodeType === Node.TEXT_NODE &&
              textNode.nextSibling.textContent?.startsWith(" ")
            ) {
              return;
            }

            const spaceNode = document.createTextNode(" ");
            inputRef.current?.insertBefore(spaceNode, textNode.nextSibling);
          }
        }
      });
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
          Export as Image
        </button>
        <button onClick={convertToIconNotation} className="convert-button">
          Convert to Icon Notation
        </button>
        <button onClick={convertToNumpadNotation} className="convert-button">
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
