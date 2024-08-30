const imageFilenames = [
  // Basic attacks
  "lp.png",
  "mp.png",
  "hp.png",
  "p.png",
  "lk.png",
  "mk.png",
  "hk.png",
  "k.png",
  "mod-l.png",
  "mod-m.png",
  "mod-h.png",
  "mod-any.png",
  "mod-auto.png",
  "grab.png",

  // Directional inputs (numpad notation)
  "1.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png",
  "6.png",
  "7.png",
  "8.png",
  "9.png",
  "charge2.png",
  "charge4.png",
  "charge6.png",

  // Special moves and modifiers
  "special.png",
  "superart.png",

  // Command inputs
  "dp.png",
  "hcf.png",
  "hcb.png",

  // Other actions
  "push.png",
  "dash.png",
  "tap.png",
  "release.png",
  "linkl.png",
  "linkr.png",

  // Modifiers and states
  "plus.png",
  "minus.png",
  "3x.png",
  "od.png",
  "spd.png",
  "cheer.png",
  "func.png",

  "di.png",
];

export default function ImagesList({
  onImageClick,
}: {
  onImageClick: (filename: string) => void;
}) {
  return (
    <div className="images-list-container">
      {imageFilenames.map((filename, idx) => (
        <img
          key={idx}
          src={`./images/icons/${filename}`}
          alt={filename}
          onClick={() => onImageClick(filename)}
        />
      ))}
    </div>
  );
}
