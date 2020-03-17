const questionDetection = (reference) =>
{
    const boldExp = new RegExp("\\*{2}((.|\\n)*?)\\*{2}")
    reference.innerHTML = reference.innerText
        .replace(new RegExp(boldExp, "g"), (a, b) => `<span style="font-weight: bold;color: #2B7A78">${b}</span>`)
}

export default questionDetection