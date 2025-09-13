import crypto from "crypto";

async function generateID() {
  const letters = "QWERTYUIOPLKJHGFDSAZXCVBNM";

  let letterMerge = "";

  for (let i = 0; i < 4; i++) {
    const randomLetter = crypto.randomInt(0, letters.length);
    letterMerge += randomLetter;
  }

  const numberMerge = String(crypto.randomInt(0, 1000000)).padStart(6, "0");

  return `ORD + ${letterMerge} + ${numberMerge}`;
}

export default generateID;
