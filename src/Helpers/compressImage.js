import imageCompression from "browser-image-compression"
import Constant from "../Constant/Constant"

const compressImage = (img) =>
{
    return new Promise(resolve =>
    {
        if (img.type.includes("svg") || img.type.includes("gif")) resolve(img)
        else
        {
            imageCompression(img, Constant.COMPRESSION).then(compressedFile =>
            {
                let file = new File([compressedFile], compressedFile.name)
                if (file.size > img.size) resolve(img)
                else resolve(file)
            })
        }
    })
}

export default compressImage