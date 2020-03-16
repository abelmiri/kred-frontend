const createThumbnail = (img) =>
{
    return new Promise(resolve =>
    {
        const canvas = document.createElement("CANVAS")
        const reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onload = () =>
        {
            const newImg = new Image()
            newImg.src = reader.result
            newImg.onload = () =>
            {
                canvas.width = 50
                canvas.height = newImg.naturalHeight / (newImg.naturalWidth / 50)
                const context = canvas.getContext("2d")
                context.drawImage(newImg, 0, 0, 50, newImg.naturalHeight / (newImg.naturalWidth / 50))
                const preview = canvas.toDataURL("image/png")
                const block = preview.split(";")
                const contentType = block[0].split(":")[1]
                const realData = block[1].split(",")[1]
                resolve(b64toFile(realData, contentType))
            }
        }
    })
}

const b64toFile = (b64Data, contentType, sliceSize) =>
{
    contentType = contentType || "jpg"
    sliceSize = sliceSize || 512
    let byteCharacters = atob(b64Data)
    let byteArrays = []
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize)
    {
        let slice = byteCharacters.slice(offset, offset + sliceSize)
        let byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++)
        {
            byteNumbers[i] = slice.charCodeAt(i)
        }
        let byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
    }
    return new File(byteArrays, "thumbnail.png", {type: contentType, lastModified: Date.now()})
}

export default createThumbnail