import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) =>{
    try {
        const secret = process.env.JWT_SECRET;
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(400).json({
                succses : false,
                message : "please provide token"
            })
        }
        const part = authHeader.split(" ");

        if(part.length !== 2 || part[0] !== "Bearer"){
            return res.status(400).json({
                succses : false,
                message : "please provide correct token"
            })
        }
        const token = part[1];

        const decoded =  jwt.verify(token, secret);
        req.user = decoded;
        next();
        
    } catch (error) {
        return res.status(500).json({
            succses : false,
            message : "debug here"
        })
    }
}

export default authMiddleware;