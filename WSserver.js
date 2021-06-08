/*
const WS = require('ws');

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
const wsServer = new WS.Server({server});

wsServer.on('connection', (ws, req) => {
    let errCallback = (err) => {
        if(err) {
            console.log(err);
        }
    }

    ws.on('message', msg => {
        console.log('msg', msg);
        ws.send('response', errCallback);
    });

    ws.send('welcome', errCallback);
});

server.listen(port);
*/