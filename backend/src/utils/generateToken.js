import jwt from 'jsonwebtoken';


const generateToken = (userID, email, role = 'user')=>{
    const payload = {
        userID : userID,
        email : email,
        role : role
    }
    const secret = process.env.JWT_SECRET;
    const expiryDuration = process.env.JWT_EXPIRES_IN;
    const token = jwt.sign(payload, secret, {expiresIn : expiryDuration});

    return token;
}

export {generateToken};