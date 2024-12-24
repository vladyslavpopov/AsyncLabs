const fs = require("fs");

const filePath = "./large_data.txt";
const lines = [
  "This is a test line.",
  "Another line with some data.",
  "Here is an example of a matching line.",
  "This line does not match the criteria.",
  "example is present here as well.",
  "Random text without the keyword.",
  "A second example line with more data.",
  "No keyword in this sentence.",
  "Just another line for testing.",
  "Final example for demonstration purposes.",
];

const createLargeFile = (path, numLines) => {
  const writeStream = fs.createWriteStream(path);
  for (let i = 0; i < numLines; i++) {
    const randomLine = lines[Math.floor(Math.random() * lines.length)];
    writeStream.write(randomLine + "\n");
  }
  writeStream.end(() =>
    console.log(`File ${path} created with ${numLines} lines.`)
  );
};

createLargeFile(filePath, 1_000_000);
