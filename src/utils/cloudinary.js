import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
          
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFileOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath){
            return null;
        }

        //  Upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("File has been uploaded successfully", response)
        return response
    }
    catch(error){
        fs.unlinkSync(localFilePath)    // Remove saved file on local server if operation fails
        return null
    }
}

export { uploadFileOnCloudinary }