import { supabase } from "../config/supabase.js";
import ApiError from "./apiError.js";
import fs from "fs/promises"
interface UploadResult{
    publicUrl:string;
    path:string
}

export const uploadToSupabase = async (
    filePath:string,
    bucketName:string='avatar',
    folder:string =''
):Promise<UploadResult> =>{
    try {

        const fileBuffer = await fs.readFile(filePath);

        const fileExt = filePath.split('.').pop();
        const fileName = `${Date.now()}--${Math.floor(Math.random()*1000000 +1)}.${fileExt}`;
        const remotefilePath = folder?`${folder}/${fileName}` :fileName;

        const {data,error} = await supabase.storage.from(bucketName).upload(remotefilePath,fileBuffer,{
            contentType:"auto",
            upsert:false
        });

        if(error){
            throw new ApiError(500,`Supabase file upload error: ${error.message}`)
        }

        const {data:{publicUrl}} = supabase.storage.from(bucketName).getPublicUrl(remotefilePath)
        
        await fs.unlink(filePath)

        return{
            publicUrl,
            path:data.path
        }
    } catch (err) {
                throw new ApiError(500, `Failed to upload file to supabase: ${err}`);

    }
}

export const deleteFromSupabase = async (
    bucketName:string,
    filePath:string
):Promise<void> =>{
    const {error} = await supabase.storage.from(bucketName).remove([filePath])
    if(error){
        throw new ApiError(500,`Supbase delete error: ${error.message}`);
    }
}