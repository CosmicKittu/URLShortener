import {createClient} from 'redis';


const redisClient = createClient({
    url : process.env.REDIS_URL,
});

redisClient.on("error", (error)=>{
    console.error("Resdis error" , error);
});

const connectRedis = async () =>{
    await redisClient.connect();
    console.log("reddis connected");
};

export {redisClient, connectRedis};