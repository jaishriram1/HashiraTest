import fs from "fs";

function getThePoints(file) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const k = data.keys.k;
  const x = [], y = [];

  for (const [key, val] of Object.entries(data)) {
    if (key === "keys") continue;
    const base = parseInt(val.base);
    const num = BigInt(parseInt(val.value, base));
    x.push(parseInt(key));
    y.push(num);
  }

  const points = x.map((v, i) => ({ x: v, y: y[i] }))
    .sort((a, b) => a.x - b.x)
    .slice(0, k);

  return { x: points.map(p => p.x), y: points.map(p => p.y) };
}

function lanAtZero(x, y) {
  const k = x.length;
  let result = 0n;

  for (let i = 0; i < k; i++) {
    let num = 1n, den = 1n;
    const xi = BigInt(x[i]);

    for (let j = 0; j < k; j++) {
      if (i === j) continue;
      const xj = BigInt(x[j]);
      num *= -xj;
      den *= xi - xj;
    }

    const li = num / den;
    result += y[i] * li;
  }

  return result;
}

function findSecret(file) {
  const { x, y } = getThePoints(file);
  const r = lanAtZero(x, y);

  const MOD = 2n ** 256n;
  const sec = ((r % MOD) + MOD) % MOD; // ensure always positive

  console.log(`Secret for ${file}:`, sec.toString());
}

findSecret("testCase1.json");
findSecret("testCase2.json");