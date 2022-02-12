const jwt = require('jsonwebtoken');

const verifyToken = async (req,res,next) =>{
    try{
        let token = req.header('auth-token');
        if(!token){
            res.status(404).send('Token not found please provide token');
        }
        const data = jwt.verify(token,'khalidmansoor');
        req.user = data.user;
        next();
    }
    catch(err){
        console.log(err.message)
    }
    
}

module.exports = verifyToken;