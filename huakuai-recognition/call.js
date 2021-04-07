const exec = require('child_process').exec;


function recognition(inputImg, huakuaiImg,){
    return new Promise((resolve, reject)=>{
        exec(`py huakuai2.py -i ${inputImg} -H ${huakuaiImg}`,function(error,stdout,stderr){
            if(error) {
                reject(stderr)
            }
            resolve(stdout)
        })
    })
}
async function run(){
    for(let i=0;i<10;i++){
        let res = await  recognition("55.png", "hk2.png")
        console.log("res is ",i, res)
    }
   
}

run()