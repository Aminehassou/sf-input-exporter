import { useRef, KeyboardEvent, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import "./App.scss";
import ImagesList from "./components/ImagesList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faHandFist,
  faKeyboard,
  faGamepad,
  faGear,
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
  const heldKeysRef = useRef<Set<string>>(new Set());
  const lastDirectionAddedRef = useRef<string | null>(null);
  const [sf6InputEnabled, setSf6InputEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customControls, setCustomControls] = useState({
    directions: {
      up: "ArrowUp",
      down: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight",
    },
    attacks: {
      lp: "q",
      mp: "w",
      hp: "e",
      lk: "a",
      mk: "s",
      hk: "d",
    },
  });
  const [recordingKey, setRecordingKey] = useState<string | null>(null);

  // Update keyToInputMap when custom controls change
  const keyToInputMap = {
    [customControls.directions.left]: "4",
    [customControls.directions.right]: "6",
    [customControls.directions.up]: "8",
    [customControls.directions.down]: "2",
    [customControls.attacks.lp]: "lp",
    [customControls.attacks.mp]: "mp",
    [customControls.attacks.hp]: "hp",
    [customControls.attacks.lk]: "lk",
    [customControls.attacks.mk]: "mk",
    [customControls.attacks.hk]: "hk",
  };

  // Map directional combinations
  const directionalCombinations: { [key: string]: { [key: string]: string } } =
    {
      "4": { "2": "1", "8": "7" }, // Left + Down = Down-Left, Left + Up = Up-Left
      "6": { "2": "3", "8": "9" }, // Right + Down = Down-Right, Right + Up = Up-Right
      "2": { "4": "1", "6": "3" }, // Down + Left = Down-Left, Down + Right = Down-Right
      "8": { "4": "7", "6": "9" }, // Up + Left = Up-Left, Up + Right = Up-Right
    };

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

  const addInputIcon = (input: string) => {
    if (!inputRef.current) return;

    const img = document.createElement("img");
    img.src = `./images/icons/${input}.png`;
    img.alt = input;
    img.style.width = `${iconSize}px`;
    img.style.height = `${iconSize}px`;
    inputRef.current.appendChild(img);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (recordingKey) {
      e.preventDefault();
      const newKey = e.key;

      // Create a new controls object with the updated key
      const newControls = { ...customControls };
      if (recordingKey.startsWith("dir_")) {
        const direction = recordingKey.replace("dir_", "");
        newControls.directions = {
          ...newControls.directions,
          [direction]: newKey,
        };
      } else if (recordingKey in customControls.attacks) {
        newControls.attacks = {
          ...newControls.attacks,
          [recordingKey]: newKey,
        };
      }

      // Update the controls state
      setCustomControls(newControls);
      setRecordingKey(null);
      return;
    }

    if (!sf6InputEnabled) {
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
        return;
      }
    }

    const input = keyToInputMap[e.key];

    if (input) {
      e.preventDefault();

      // Update held keys immediately using ref
      heldKeysRef.current.add(e.key);

      // Handle directional inputs
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        const baseDirection = input;
        let directionToAdd = baseDirection;

        // Check for directional combinations
        const heldDirections = Array.from(heldKeysRef.current)
          .filter((key) =>
            ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key)
          )
          .map((key) => keyToInputMap[key]);

        // If we have a held direction, check for combinations
        if (heldDirections.length > 0) {
          for (const heldDir of heldDirections) {
            if (directionalCombinations[heldDir]?.[baseDirection]) {
              directionToAdd = directionalCombinations[heldDir][baseDirection];
              break;
            }
          }
        }

        // Only add the direction if it's different from the last one added
        if (directionToAdd !== lastDirectionAddedRef.current) {
          addInputIcon(directionToAdd);
          lastDirectionAddedRef.current = directionToAdd;
        }
      } else {
        // Handle punch/kick inputs
        addInputIcon(input);
      }
    } else if (e.key === "Backspace") {
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

  const handleKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!sf6InputEnabled) return;

    // Update held keys immediately using ref
    heldKeysRef.current.delete(e.key);

    // Reset last direction added when all directional keys are released
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      const hasDirectionalKeys = Array.from(heldKeysRef.current).some((key) =>
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key)
      );
      if (!hasDirectionalKeys) {
        lastDirectionAddedRef.current = null;
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

  const startRecording = (key: string) => {
    setRecordingKey(key);
  };

  // ---------- NEW: global key listener for control recording ----------
  useEffect(() => {
    if (!recordingKey) return;

    const handleRecordKey = (e: globalThis.KeyboardEvent) => {
      e.preventDefault();
      const newKey = e.key;

      setCustomControls((prev) => {
        const updated = { ...prev };
        if (recordingKey.startsWith("dir_")) {
          const dir = recordingKey.replace("dir_", "");
          updated.directions = { ...updated.directions, [dir]: newKey };
        } else if (recordingKey in prev.attacks) {
          updated.attacks = { ...updated.attacks, [recordingKey]: newKey };
        }
        return updated;
      });

      setRecordingKey(null);
    };

    window.addEventListener("keydown", handleRecordKey);
    return () => {
      window.removeEventListener("keydown", handleRecordKey);
    };
  }, [recordingKey]);

  // -------------------------------------------------------------------

  const getKeyDisplay = (key: string, identifier?: string) => {
    if (identifier && recordingKey === identifier) {
      return "Press any key...";
    }
    // Convert arrow keys to their display names
    switch (key) {
      case "ArrowUp":
        return "↑";
      case "ArrowDown":
        return "↓";
      case "ArrowLeft":
        return "←";
      case "ArrowRight":
        return "→";
      default:
        return key.length === 1 ? key.toUpperCase() : key;
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
        onKeyUp={handleKeyUp}
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
        <div className="sf6-controls">
          <button
            onClick={() => setSf6InputEnabled(!sf6InputEnabled)}
            className={`sf6-input-button ${sf6InputEnabled ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={faGamepad} className="button-icon" />
            {sf6InputEnabled ? "Disable SF6 Input" : "Enable SF6 Input"}
            <div className="sf6-input-tooltip">
              <div className="tooltip-title">SF6 Input Mode</div>
              <div className="tooltip-section">
                When enabled, you can input Street Fighter 6 commands directly
                using your keyboard, and they'll be automatically converted to
                icons in real-time. Just type as if you were playing the game!
              </div>
              <div className="tooltip-section">
                <strong>Attack Controls</strong>
                <br />
                <span className="key-combo">{customControls.attacks.lp}</span> -
                Light Punch
                <br />
                <span className="key-combo">{customControls.attacks.mp}</span> -
                Medium Punch
                <br />
                <span className="key-combo">{customControls.attacks.hp}</span> -
                Heavy Punch
                <br />
                <span className="key-combo">{customControls.attacks.lk}</span> -
                Light Kick
                <br />
                <span className="key-combo">{customControls.attacks.mk}</span> -
                Medium Kick
                <br />
                <span className="key-combo">{customControls.attacks.hk}</span> -
                Heavy Kick
              </div>
            </div>
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="settings-button"
          >
            <FontAwesomeIcon icon={faGear} className="button-icon" />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="settings-modal">
          <div className="settings-content">
            <h2>Customize Controls</h2>
            <div className="settings-section">
              <h3>Directions</h3>
              <div className="control-grid">
                <div className="control-item">
                  <span>Up</span>
                  <button
                    className={`control-key ${
                      recordingKey === "dir_up" ? "recording" : ""
                    }`}
                    onClick={() => startRecording("dir_up")}
                  >
                    {getKeyDisplay(customControls.directions.up, "dir_up")}
                  </button>
                </div>
                <div className="control-item">
                  <span>Down</span>
                  <button
                    className={`control-key ${
                      recordingKey === "dir_down" ? "recording" : ""
                    }`}
                    onClick={() => startRecording("dir_down")}
                  >
                    {getKeyDisplay(customControls.directions.down, "dir_down")}
                  </button>
                </div>
                <div className="control-item">
                  <span>Left</span>
                  <button
                    className={`control-key ${
                      recordingKey === "dir_left" ? "recording" : ""
                    }`}
                    onClick={() => startRecording("dir_left")}
                  >
                    {getKeyDisplay(customControls.directions.left, "dir_left")}
                  </button>
                </div>
                <div className="control-item">
                  <span>Right</span>
                  <button
                    className={`control-key ${
                      recordingKey === "dir_right" ? "recording" : ""
                    }`}
                    onClick={() => startRecording("dir_right")}
                  >
                    {getKeyDisplay(
                      customControls.directions.right,
                      "dir_right"
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="settings-section">
              <h3>Attacks</h3>
              <div className="control-grid">
                <div className="control-item">
                  <span>Light Punch</span>
                  <button
                    className={`control-key ${
                      recordingKey === "lp" ? "recording" : ""
                    }`}
                    onClick={() => startRecording("lp")}
                  >
                    {getKeyDisplay(customControls.attacks.lp, "lp")}
                  </button>
                </div>
                <div className="control-item">
                  <span>Medium Punch</span>
                  <button
                    className={`control-key ${
                      recordingKey === "mp" ? "recording" : ""
                    }`}
                    onClick={() => startRecording("mp")}
                  >
                    {getKeyDisplay(customControls.attacks.mp, "mp")}
                  </button>
                </div>
                <div className="control-item">
                  <span>Heavy Punch</span>
                  <button
                    className={`control-key ${
                      recordingKey === "hp" ? "recording" : ""
                    }`}
                    onClick={() => startRecording("hp")}
                  >
                    {getKeyDisplay(customControls.attacks.hp, "hp")}
                  </button>
                </div>
                <div className="control-item">
                  <span>Light Kick</span>
                  <button
                    className={`control-key ${
                      recordingKey === "lk" ? "recording" : ""
                    }`}
                    onClick={() => startRecording("lk")}
                  >
                    {getKeyDisplay(customControls.attacks.lk, "lk")}
                  </button>
                </div>
                <div className="control-item">
                  <span>Medium Kick</span>
                  <button
                    className={`control-key ${
                      recordingKey === "mk" ? "recording" : ""
                    }`}
                    onClick={() => startRecording("mk")}
                  >
                    {getKeyDisplay(customControls.attacks.mk, "mk")}
                  </button>
                </div>
                <div className="control-item">
                  <span>Heavy Kick</span>
                  <button
                    className={`control-key ${
                      recordingKey === "hk" ? "recording" : ""
                    }`}
                    onClick={() => startRecording("hk")}
                  >
                    {getKeyDisplay(customControls.attacks.hk, "hk")}
                  </button>
                </div>
              </div>
            </div>
            <button
              className="close-settings"
              onClick={() => setShowSettings(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="images-list-container">
        <ImagesList onImageClick={handleImageClick} />
      </div>
    </div>
  );
};

export default App;
