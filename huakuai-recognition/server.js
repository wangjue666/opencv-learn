const Koa = require('koa');
const body = require('koa-better-body');
const convert = require('koa-convert');
const config = require('./config');
const Router = require('koa-router');
const zlib = require('zlib');
const staticCache = require('koa-static-cache');
const {recognition, saveBase64ToImg, rmFile, readFileToBase64} = require("./call")
const pathLib = require("path")
let server = new Koa();
server.use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin","*");
    ctx.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    ctx.set("Access-Control-Max-Age", "3600");
    ctx.set("Access-Control-Allow-Headers", "x-requested-with,Authorization,Content-Type,Accept");
    ctx.set("Access-Control-Allow-Credentials", "true");
    if (ctx.method == 'OPTIONS') {
        ctx.body = '';
        ctx.status = 204;
    } else {
        await next();
    }
})
//POST
server.use(
    convert(body({
        uploadDir: config.uploadDir,
        keepExtensions: true,
        formLimit: "100mb",
        jsonLimit: "100mb"
    }))
)

server.use(async (ctx, next) => {
    ctx.zlib = function (data) {
        ctx.res.setHeader('content-encoding', 'gzip');
        ctx.body = zlib.gzipSync(
            JSON.stringify({ status: 200, data })
        )
    }
    ctx.error = function (msg) {
        ctx.body = { status: 400, msg }
    }
    ctx.assert = function(condition, msg){
        if(condition){
            ctx.body = {
                status: 500,
                msg
            }
        }
    }
    await next();
})

let mainRouter = new Router();

mainRouter.post('/', async (ctx)=>{
    let {img, isGenOutImg} = ctx.request.fields
    if(!img){
        ctx.error("img为必填参数")
        return
    }
    const fileName = Date.now()
    const postfix = ".png"
    const inputImg = pathLib.resolve(__dirname, "./train/"+Date.now()+ postfix)
    const huakuaiImg = pathLib.resolve(__dirname, "./hk3.jpg")
    const outImg = pathLib.resolve(__dirname, "./out/"+Date.now()+ postfix)
    await saveBase64ToImg(inputImg, img)
    isGenOutImg = Boolean(isGenOutImg)
    let X = await recognition(inputImg, huakuaiImg, outImg, isGenOutImg)
    rmFile(inputImg)
    ctx.body = {X, fileName: isGenOutImg ? fileName.toString() + postfix: ""}
})

mainRouter.get("/test", async (ctx)=>{
    let img = await readFileToBase64("./test.png")
    const postfix = ".png"
    const inputImg = pathLib.resolve(__dirname, "./train/"+Date.now()+ postfix)
    const huakuaiImg = pathLib.resolve(__dirname, "./hk3.jpg")
    const outImg = pathLib.resolve(__dirname, "./out/"+Date.now()+ postfix)
    await saveBase64ToImg(inputImg, img)
    let X = await recognition(inputImg, huakuaiImg, outImg, false)
    rmFile(inputImg)
    ctx.body = {X}
})

server.listen(config.port,()=>{
    console.log("server is running localhost:", config.port)
})


server.use(mainRouter.routes());
server.use(staticCache({
    dir: "./out",
    gzip: true,
    dynamic: true,
    preload: false,
    buffer: false
}))
