import fs from "fs/promises";
import path from "path";
import archiver from "archiver";

const OUT_DIR = path.resolve("public", "flags");
const ZIP_PATH = path.resolve("public", "flags.zip");

const COUNTRY_CODES = [
  "US","BR","EU","GB","JP",
  "CA","AU","CH","CN",
  "AR","MX","CL","CO","PE","UY","BO","PY","VE",
  "ZA","TR","PL","SE","NO","DK","CZ","HU","RO",
  "HK","SG","NZ","KR","TW","TH","ID","MY","PH","VN","IN",
  "AE","SA","IL","EG",
];

const flagUrl = (cc) => `https://flagcdn.com/${cc.toLowerCase()}.svg`;

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function download(url, outPath) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(outPath, buf);
}

async function zipDir(dirPath, zipPath) {
  await fs.mkdir(path.dirname(zipPath), { recursive: true });
  const output = (await import("fs")).createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on("close", resolve);
    archive.on("error", reject);
    archive.pipe(output);
    archive.directory(dirPath, false);
    archive.finalize();
  });
}

(async () => {
  await ensureDir(OUT_DIR);

  let ok = 0;
  for (const cc of COUNTRY_CODES) {
    const url = flagUrl(cc);
    const file = path.join(OUT_DIR, `${cc.toLowerCase()}.svg`);
    try {
      await download(url, file);
      ok++;
      process.stdout.write(`✔ ${cc}  `);
    } catch (e) {
      console.warn(`\nFalhou ${cc}: ${e.message}`);
    }
  }

  await zipDir(OUT_DIR, ZIP_PATH);
  console.log(`\n\nBaixadas ${ok}/${COUNTRY_CODES.length} bandeiras`);
  console.log(`ZIP gerado em: ${ZIP_PATH}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
