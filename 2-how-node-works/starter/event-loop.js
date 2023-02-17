const fs = require("fs");

setTimeout(() => console.log("Timer 1"), 0);
setImmediate(() => console.log("Immediate Timer 1"));

fs.readFile("test-file.txt", () => {
  setTimeout(() => console.log("Timer 2"), 0);
  setTimeout(() => console.log("Timer 3"), 3000);
  setImmediate(() => console.log("Immediate Timer 2"));
  console.log("I/O");
});

console.log("From top-level");
