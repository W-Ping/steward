const https = require('https');
const index = require('./index');

async function getCar(ctx, next) {
    var {carNo}=ctx.request;
    https.get()
}
module.exports={
    getCar
}