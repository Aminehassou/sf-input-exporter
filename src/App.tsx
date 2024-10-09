import { useRef, KeyboardEvent, useEffect } from "react";
import html2canvas from "html2canvas";
import "./App.scss";
import ImagesList from "./components/ImagesList";

const App = () => {
  const inputRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (filename: string) => {
    if (inputRef.current) {
      const img = document.createElement("img");
      img.src = `./images/icons/${filename}`;
      img.alt = filename;
      inputRef.current.appendChild(img);
    }
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace") {
      const selection = window.getSelection();
      if (selection && inputRef.current) {
        const range = selection.getRangeAt(0);

        if (range.collapsed) {
          // No selection, handle custom backspace behavior
          e.preventDefault();

          const node = range.startContainer;

          if (node === inputRef.current) {
            // If the cursor is directly in the inputRef
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

          // Move the caret to the start of the selection
          selection.collapseToStart();
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
        "st.": "5.png",
        "cr.": "2.png",
        "b.": "4.png",
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
        drc: "drc.png",
        ",": "linkr.png",
        "->": "linkr.png",
        ">": "linkr.png",
        "[2]": "charge2.png",
        "[4]": "charge4.png",
        "[6]": "charge6.png",
        di: "di.png",
      };

      // Function to escape special regex characters
      const escapeRegex = (str: string) => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      };

      const convertTextNode = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
          const fragment = document.createDocumentFragment();
          const regex = new RegExp(
            `(${Object.keys(iconMap)
              .map((key) => escapeRegex(key)) // Escape special regex characters
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

            const iconKey = match[0].toLowerCase();
            const iconFile = iconMap[iconKey];

            if (iconFile) {
              const img = document.createElement("img");
              img.src = `./images/icons/${iconFile}`;
              img.alt = match[0];
              fragment.appendChild(img);
            } else {
              // If icon is not found, append the text as is
              fragment.appendChild(document.createTextNode(match[0]));
            }

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
    }
  };

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
          // Move the caret after the inserted text
          range.setStartAfter(range.endContainer);
          range.setEndAfter(range.endContainer);
          // Instead of removing all ranges and adding the range back, directly collapse the range to the end
          selection.collapseToEnd();
        }
      }
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("paste", handlePaste);
    }

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      if (inputElement) {
        inputElement.removeEventListener("paste", handlePaste);
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
