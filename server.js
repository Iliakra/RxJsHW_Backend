const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');
const uuid = require('uuid');
const app= new Koa();
const router = new Router();

let users = [];

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


const port = process.env.PORT||7070;
const server = http.createServer(app.callback()).listen(port);