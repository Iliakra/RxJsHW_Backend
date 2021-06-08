const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');
const uuid = require('uuid');
const app= new Koa();
const router = new Router();
const WS = require('ws');

let users = ["Ivan","Anna"];

app.use(koaBody({
    urlencoded:true,
    multipart:true,
    json:true,
}));

app.use(async(ctx, next) => { 
    const origin = ctx.request.get('Origin');
    if(!origin){
        return await next();
    }

    const headers = {'Access-Control-Allow-Origin':'*',};

    if (ctx.request.method!=='OPTIONS') {
        ctx.response.set({...headers});
        try {
            return await next();
        } catch(e) {
            e.headers = {...e.headers,...headers};
            throw e;
        }
    }

    if(ctx.request.get('Access-Control-Request-Method')) {
        ctx.response.set({
            ...headers,
            'Access-Control-Allow-Methods':'GET, POST, PUD, DELETE, PATCH',
        });
        
        if(ctx.request.get('Access-Control-Request-Headers')) {
            ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
        }
        
        ctx.response.status = 204;
    }
});

router.post('/users', async(ctx,next) => {
    let user = ctx.request.body;
    for (let i=0; i<users.length; i++){
        if (user === users[i]) {
            ctx.response.body = 'Данный никнейм занят! Выберите другой.';
            return;    
        }
    }
    users.push(user);
    ctx.response.body = 'OK';
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT||7070;
const server = http.createServer(app.callback()).listen(port);
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

//server.listen(port);