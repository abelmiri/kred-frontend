const addCommaPrice = (input) =>
{
    if (!isNaN(input))
    {
        const number = parseInt(input)
        let output = number.toFixed(0).toString().split("").reverse().join("")
        let index = 3
        while (output[index] !== undefined)
        {
            output = output.slice(0, index) + "," + output.slice(index)
            index += 4
        }
        return output.split("").reverse().join("")
    }
    else return input
}

export default addCommaPrice