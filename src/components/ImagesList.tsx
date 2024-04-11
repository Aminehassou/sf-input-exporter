const imageFilenames = [
  "6.png",
  "di.png",
  "mod-any.png",
  "cheer.png",
  "func.png",
  "od.png",
  "spd.png",
  "9.png",
  "plus.png",
  "lk.png",
  "3x.png",
  "charge4.png",
  "filelist.txt",
  "mp.png",
  "charge2.png",
  "2.png",
  "dp.png",
  "push.png",
  "minus.png",
  "superart.png",
  "4.png",
  "5.png",
  "1.png",
  "3.png",
  "8.png",
  "mod-h.png",
  "hp.png",
  "k.png",
  "grab.png",
  "hcf.png",
  "hcb.png",
  "hk.png",
  "p.png",
  "mod-l.png",
  "7.png",
  "lp.png",
  "mod-m.png",
  "release.png",
  "mk.png",
  "linkl.png",
  "tap.png",
  "special.png",
  "linkr.png",
  "dash.png",
  "mod-auto.png",
  "charge6.png",
];
export default function ImagesList() {
  return (
    <div>
      {imageFilenames.map((filename, idx) => (
        <img key={idx} src={`../assets/icons/${filename}`} alt={filename} />
      ))}
    </div>
  );
}
