import Url from "../model/url.js";
import { redisClient } from "../config/redis.js";


const syncClickToMong = async () =>{
    try {
        const keys = await redisClient.keys("clicks:*");
        if(keys.length === 0){
            return;
        }
        for(const key of keys){
            const clicks = Number(await redisClient.get(key));

            if(!clicks){
                continue;
            }

            const shortCode = key.replace("clicks:", "");

            await Url.updateOne(
                {shortCode},
                {$inc : {clicks}}
            );

            await redisClient.del(key);

        }
        console.log(`Synced ${keys.length} click counter to mongoDB`);
    } catch (error) {
        console.error("Faild to sync clicks : ", error.message);
    }
}


const startClickSyncJob = () =>{
    setInterval(syncClickToMong, 60 * 1000);
    console.log("click sync job started");
};

export {startClickSyncJob};
