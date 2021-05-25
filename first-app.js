//Core Modules
const http = require("http");
const fs = require("fs");

const data = fs.readFileSync("./data.json");
//Parsing string.
let projects = JSON.parse(data);
//auto increment za id
let lastindex = projects.length === 0 ? 1 : projects[projects.length - 1].id;
//Kreiranje servera.
const server = http.createServer((req, res) => {
  //Tip headera koji zahtev prihvata
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST,PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  switch (req.method) {
    //reading client GET
    case "GET":
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(projects, null, 2));
      console.log(projects);
      break;
    case "POST":
      req.on("data", (data) => {
        //Parsira podatke u JSON da dodje do title.
        const jsondata = JSON.parse(data);
        const title = jsondata.title;
        //Provera ako title postoji.
        if (title) {
          // na niz projects, saljemo id, uvecan, i title.
          projects.push({ id: ++lastindex, title: title });
          // zapisivanje u fajl, lokacija je data.json/ m prevodi se u string, da bi mogao da sacuva taj podatak.
          const stringtest = JSON.stringify(projects);
          fs.writeFile("./data.json", stringtest, (err) => {
            if (err) {
              // U slucaju greske, prokaz poruke.
              const message = { message: "Greska!" };
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify(message, null, 2));
            } else {
              // u slucaju da nema greske, saljemo response code 200, i res end sa tekstom
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(projects, null, 2));
            }
          });
        } else {
          //greska, ako title ne postoji, izbaci gresku

          const message = { message: "Nema title, u poslatom request. " };

          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify(message, null, 2));
        }
      });
      break;
  }
});

server.listen(8000);
