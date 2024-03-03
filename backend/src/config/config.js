const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI).then(()=> {
    console.log("qosuldu")
  }).catch((err)=>{
    console.log("error", err)
  })

}