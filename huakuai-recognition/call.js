const exec = require('child_process').exec;
const fs = require("fs")

function recognition(inputImg, huakuaiImg, outImg, isGenOutImg = false){
    return new Promise((resolve, reject)=>{
        exec(`python huakuai2.py -i ${inputImg} -H ${huakuaiImg} -o ${outImg} -p ${Number(isGenOutImg)}`,function(error,stdout,stderr){
            if(error) {
                reject(stderr)
            }
            resolve(Number(stdout))
        })
    })
}
async function run(){
    for(let i=1;i<10;i++){
        let res = await  recognition(`./train/picture-${i+1}.png`, "hk3.jpg", `./out/${i}.png`, true)
        console.log("res is ",i, res)
    }
   
}
// run()
function base64ToBuffer(){
    let buffer = fs.readFileSync("./train/picture-6.png")
    var base64Str = buffer.toString('base64')
    let rawStr = Buffer.from(base64Str,'base64')
    console.log(base64Str)
}
async function readFileToBase64(filename){
    let buffer = fs.readFileSync(filename)
    var base64Str = buffer.toString('base64')
    return base64Str
}

// base64ToBuffer()
async function saveBase64ToImg(fileName, base64Str){
    let buffer = Buffer.from(base64Str,'base64')
    fs.writeFileSync(fileName, buffer)
}
async function rmFile(fileName){
    try{
        fs.rm(fileName, {force: true},()=>{})
    }catch(e){

    }
    
}
module.exports = {
    recognition, 
    saveBase64ToImg,
    rmFile,
    readFileToBase64
}