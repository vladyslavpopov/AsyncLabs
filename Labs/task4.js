const fs = require("fs");
const readline = require("readline");

async function analyzeFile(filePath) {
  const fileStream = fs.createReadStream(filePath);

  const lineReader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let totalLines = 0;
  for await (const line of lineReader) {
    totalLines++;

    if (line.includes("example")) {
      console.log(`Found: ${line}`);
    }
  }

  console.log(`Total lines processed: ${totalLines}`);
}

const filePath = "./large_data.txt";

analyzeFile(filePath)
  .then(() => console.log("File processed successfully"))
  .catch((err) => console.error("Error processing file:", err));
