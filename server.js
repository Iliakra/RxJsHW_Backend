const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
var faker = require('faker');

function generateUnreadMessages() {
  let unreadMessages = {
      "status": "ok",
      "timestamp": 1553400000,
      "messages": [
        {
          "id": "<uuid>",
          "from": faker.internet.email(),
          "subject": `Hello from ${faker.name.firstName()}`,
          "body": faker.lorem.text(),
          "received": 1553108200
        },
        {
          "id": "<uuid>",
          "from": faker.internet.email(),
          "subject": `Hello from ${faker.name.findName()}`,
          "body": faker.lorem.text(),
          "received": 1553107200
        },
      ]
  }

  return unreadMessages;
    
}

app.use(
    koaBody({
      urlencoded: true,
      multipart: true,
      json: true,
    })
  );

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

router.get('/messages/unread', async (ctx) => {
    ctx.response.type = 200;
    ctx.response.body = generateUnreadMessages(); 
});

app.use(router.routes());
app.use(router.allowedMethods());


const port = process.env.PORT||7070;
const server = http.createServer(app.callback());

server.listen(port);
console.log(`Server is listening on port ${port}`);
  
