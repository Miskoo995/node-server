const http = require('http')
const fs = require('fs')


const data = fs.readFileSync('./data.json')
    //Parsing string. 
let projects = JSON.parse(data)

let lastindex = projects.length === 0 ? 1 : projects[projects.length1].id

//reading client GET

const server = http.createServer((req, res) => {

    switch (req.method) {
        case "GET":

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(projects, null, 2))
            console.log(projects)
            break;
        case "POST":
            req.on('data', data => {
                //Parsira podatke u JSON da dodje do title. 
                const jsondata = JSON.parse(data);
                const title = jsondata.title;
                //Provera ako title postoji. 
                if (title) {
                    // na niz projects, saljemo id, uvecan, i title. 
                    projects.push({ id: lastindex++, title });
                    // zapisivanje u fajl, lokacija je data.json/ m prevodi se u string, da bi mogao da sacuva taj podatak.  
                    fs.writeFile('./data.json', projects.toString(), (err) => {
                        if (err) {

                            // U slucaju greske, prokaz poruke. 
                            const message = { message: 'could not persist data!' };
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(message, null, 2));
                        } else {
                            // u slucaju da je response 200, znaci da je zahtev prosao, izvrsava se tako sto cuva u projects. 
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(projects, null, 2));
                        }
                    });
                } else {

                    //Greska, title u  body ne postoji, trazi 

                    const message = { message: 'no title in body request!' };

                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(message, null, 2));
                }
            });

            break;
        default:
            break;
    }

})

server.listen(8000)