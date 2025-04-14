import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import {Router} from "express"

const router = Router();


const s3Client = new S3Client({
    credentials:{
        secretAccessKey:process.env.SECRET_KEY!,
        accessKeyId:process.env.ACCESS_KEY!,
    },
    region:"us-east-1"
})

// get request to get the presigned URL
router.get("/get_presigned_url",async(req,res)=>{

    let user = "testUser"

    const {url,fields} = await createPresignedPost(s3Client,{
        Bucket:"testbucketforthistime",
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

// the presigned URL that is generated will be send to the  frontend
// we do not handle uploading in the backend
// as that would mean taking the image in the backend
// our whole purpose is to avoid that


// 2 ways to handle it 
// 1. we provide a button where the user can click and generate the presignedURL
    //   once thsi is done based on the availablity of presigned URL provide another button
    //   clicking which will uplaod the images to the S3 via presigned url

// 2. when the user selects the images immediatedly send them to the S3 return the image url 
    //   This is cloudfornturl + image_path
    //   taking it a step further show a preview with cancel button otherwise there will be unnecessary image sin our S3 bucket
    //   lastly store the returned s3 url into the DB to access the image in the future     

