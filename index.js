const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");
// const inText = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(inText);
// const outText = `new text : ${inText}`;
// fs.writeFileSync("./txt/outText.txt", outText);
// console.log("new txt file created!!");
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//     if (err) {
//         return console.log(err);
//     }
//     fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//         fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//             console.log(`${data1}\n${data2}\n${data3}`);
//             fs.writeFile(
//                 "./txt/final.txt",
//                 `${data2}\n${data3}`,
//                 "utf-8",
//                 (err) => {
//                     console.log("file is written");
//                 }
//             );
//         });
//     });
// });
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const templateOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    "utf-8"
);
const templateCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    "utf-8"
);
const templateProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    "utf-8"
);
const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
const server = http.createServer((req, res) => {
    // console.log(req.url);
    const { query, pathname } = url.parse(req.url, true);
    //overview page
    if (pathname == "/" || pathname === "/overview") {
        res.writeHead(200, { "content-type": "text/html" });
        const cardsHtml = dataObj
            .map((el) => replaceTemplate(templateCard, el))
            .join("");
        const output = templateOverview.replace(
            /{%PRODUCT_CARDS%}/g,
            cardsHtml
        );
        res.end(output);
    }
    //product page
    else if (pathname === "/product") {
        // console.log(query);
        // console.log(query.id);
        // console.log(url.parse(req.url, true));
        res.writeHead(200, { "content-type": "text/html" });
        const product = dataObj[query.id];
        const output = replaceTemplate(templateProduct, product);
        res.end(output);
    }
    //api
    else if (pathname === "/api") {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(data);
    }
    //others
    else {
        res.writeHead(404, {
            "Content-type": "text/html",
        });
        res.end("<h1>Path not found!</h1>");
    }
});
//server listen
server.listen(8000, "127.0.0.1", () => {
    console.log(`listening from sai's pc, port : 8000`);
});
