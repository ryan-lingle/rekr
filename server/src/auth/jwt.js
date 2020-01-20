const fs   = require('fs');
const jwt   = require('jsonwebtoken');

// use 'utf8' to get string instead of byte array  (512 bit key)
let privateKEY  = process.env.PRIVATE_KEY;
let publicKEY  =  process.env.PUBLIC_KEY;

if (!privateKEY) {
  privateKEY = fs.readFileSync('./private.key', 'utf8');
  publicKEY = fs.readFileSync('./public.key', 'utf8');
}

module.exports = {
 sign: (clientId) => {
  // Token signing options
  const signOptions = {
    audience:  clientId,
    expiresIn:  "30d",    // 30 days validity
    algorithm:  "RS256"
  };
  return jwt.sign({}, privateKEY, signOptions);
},
verify: (token, clientId) => {
  const verifyOptions = {
    audience:  clientId,
    expiresIn:  "30d",
    algorithm:  ["RS256"]
  };
   try{
     jwt.verify(token, publicKEY, verifyOptions);
     return true;
   }catch (err){
     return false;
   }
},
 decode: (token) => {
    return jwt.decode(token, {complete: true});
    //returns null if token is invalid
 }
}
