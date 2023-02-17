const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify");

const replaceProductData = require("./modules/replaceProductData");

// File system
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2)
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3)
//             fs.writeFile(`./txt/output.txt`, `${data2} ${data3}`, err => {
//                 console.log("File have been written 😀");
//             })
//         })
//     })
// })

// console.log("Reading now...")

// Server
const overview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const card = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const product = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // let parse = new URL(req.url, 'http://127.0.0.1:3000/')
  // console.log(parse);

  // Overview
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const cardHtml = dataObj.map((el) => replaceProductData(card, el)).join("");
    const output = overview.replace(`{%PRODUCT_CARDS%}`, cardHtml);

    res.end(output);

    // Product
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const productData = dataObj[JSON.parse(JSON.stringify(query)).id];
    const output = replaceProductData(product, productData);

    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);

    // 404
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    res.end("<h1>404 Not Found</h1>");
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Server running at http://127.0.0.1:3000");
});
