const copyToClipboard = (input, resolve) =>
{
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(input).then(() => resolve())
    else
    {
        const area = document.createElement("TEXTAREA")
        area.style.height = "1px"
        area.style.overflow = "hidden"
        area.style.opacity = "0"
        area.value = input
        document.body.append(area)
        area.select()
        document.execCommand("copy")
        area.remove()
        resolve()
    }
}

export default copyToClipboard