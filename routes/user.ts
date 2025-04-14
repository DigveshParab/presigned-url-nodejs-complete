import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import {Router} from "express"

const router = Router();


const s3Client = new S3Client({
    credentials:{
        secretAccessKey:process.env.SECRET_KEY!,
        accessKeyId:process.env.ACCESS_KEY!,
    },
    region:process.env.AWS_REGION as string
})

// get request to get the presigned URL
router.get("/get_presigned_url",async(req,res)=>{

    let user = "testUser"

    const {url,fields} = await createPresignedPost(s3Client,{
        Bucket:process.env.AWS_BUCKET_NAME?.toString() || "",
        Key:`backery/${user}/${Math.random()}/image.png`,
        Conditions:[
            ['content-length-range', 0, 5 * 1024 * 1024] // 5 MB max
        ],
        Fields:{
            'Content-Type':'image/png'
        },
        Expires:3600
    })


    res.status(200).json({
        message:"URL Generated successfully",
        presigned_url:url,
        fields
    })
})



export default router;
