const app = require("express")()
const fs = require("fs")
const path = require("path")
const request = require("request")

app.route("/static/:folder/:file").get((req, res) =>
{
    res.setHeader("Access-Control-Allow-Origin", "*")
    if (fs.existsSync(path.join(__dirname, `/static/${req.params.folder}/${req.params.file}.gz`)))
    {
        if (req.params.file.includes(".js")) res.setHeader("Content-Type", "application/javascript")
        else if (req.params.file.includes(".css")) res.setHeader("Content-Type", "text/css")
        res.setHeader("Content-Encoding", "gzip")
        res.setHeader("Vary", "Accept-Encoding")
        res.setHeader("Cache-Control", "max-age=31536000")
        res.sendFile(path.join(__dirname, `/static/${req.params.folder}/${req.params.file}.gz`))
    }
    else if (fs.existsSync(path.join(__dirname, `/static/${req.params.folder}/${req.params.file}`)))
    {
        if (req.params.file.includes(".js")) res.setHeader("Content-Type", "application/javascript")
        else if (req.params.file.includes(".css")) res.setHeader("Content-Type", "text/css")
        res.setHeader("Cache-Control", "max-age=31536000")
        res.sendFile(path.join(__dirname, `/static/${req.params.folder}/${req.params.file}`))
    }
    else res.sendStatus(404)
})

app.route("/site-map").get((req, res) =>
{
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate") // HTTP 1.1.
    res.setHeader("Pragma", "no-cache") // HTTP 1.0.
    res.setHeader("Expires", "0") // Proxies.
    res.send(
        "https://www.kred.ir\nhttps://www.kred.ir/sign-up\nhttps://www.kred.ir/exchanges\nhttps://www.kred.ir/videos\nhttps://www.kred.ir/pavilions\n" +
        "https://www.kred.ir/videos/5e480095ac00841b52a27ee1\nhttps://www.kred.ir/videos/5e6c0610b2d4c22d1799cadd\nhttps://www.kred.ir/videos/5e6c1d15b2d4c22d1799cb20\n",
    )
})

app.route("/.well-known/assetlinks.json").get((req, res) => res.sendFile(path.join(__dirname, "assetlinks.json")))

app.route("/:file").get((req, res) =>
{
    res.setHeader("Access-Control-Allow-Origin", "*")
    if (fs.existsSync(path.join(__dirname, `/${req.params.file}`))) res.sendFile(path.join(__dirname, `/${req.params.file}`))
    else
    {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate") // HTTP 1.1.
        res.setHeader("Pragma", "no-cache") // HTTP 1.0.
        res.setHeader("Expires", "0") // Proxies.
        res.sendFile(path.join(__dirname, "index.html"))
    }
})

app.route("/exchanges/:id").get((req, res) => fs.readFile("./index.html", null, (err, data) => sendExchangeHtml(req.params.id, res, data, err)))

function sendExchangeHtml(id, res, html, err)
{
    if (err) res.sendFile(path.join(__dirname, "index.html"))
    else request(`https://restful.kred.ir/exchange/${id}`, (error, response, body) =>
    {
        try
        {
            const exchange = JSON.parse(body)
            if (exchange && exchange._id)
            {
                res.send(html.toString().replace(
                    `<title>کرد؛ گام هایی جذاب در دنیای پزشکی</title><meta property="og:title" content="کرد؛ گام هایی جذاب در دنیای پزشکی"/><meta name="twitter:title" content="کرد؛ گام هایی جذاب در دنیای پزشکی"/><meta name="description" content="کرد؛ گام هایی جذاب در دنیای پزشکی"/><meta property="og:description" content="کرد؛ گام هایی جذاب در دنیای پزشکی"/><meta name="twitter:description" content="کرد؛ گام هایی جذاب در دنیای پزشکی"/><meta property="og:image" content="/logo512.png"/><meta name="twitter:image" content="/logo512.png"/><meta name="twitter:card" content="summary_large_image"/>`,
                    `<title>تبادل کتاب ${exchange.title} | کرد</title>
                                 <meta property="og:title" content="تبادل کتاب ${exchange.title} | کرد"/>
                                 <meta name="twitter:title" content="تبادل کتاب ${exchange.title} | کرد"/>
                                 <meta name="description" content="${exchange.description}"/>
                                 <meta property="og:description" content="${exchange.description}"/>
                                 <meta name="twitter:description" content="${exchange.description}"/>
                                 <meta property="og:image" content="https://restful.kred.ir/${exchange.picture}"/>
                                 <meta name="twitter:image" content="https://restful.kred.ir/${exchange.picture}"/>
                                 <meta name="twitter:card" content="summary_large_image"/>`,
                ))
            }
            else res.sendFile(path.join(__dirname, "index.html"))
        }
        catch (e)
        {
            console.log(e.message)
            res.sendFile(path.join(__dirname, "index.html"))
        }
    })
}

app.route("/pavilions/:id").get((req, res) => fs.readFile("./index.html", null, (err, data) => sendPavilionHtml(req.params.id, res, data, err)))
app.route("/pavilions/:id/*").get((req, res) => fs.readFile("./index.html", null, (err, data) => sendPavilionHtml(req.params.id, res, data, err)))

function sendPavilionHtml(id, res, html, err)
{
    if (err) res.sendFile(path.join(__dirname, "index.html"))
    else request(`https://restful.kred.ir/conversation/${id}`, (error, response, body) =>
    {
        try
        {
            const gap = JSON.parse(body)
            if (gap && gap._id)
            {
                res.send(html.toString().replace(
                    `<title>کرد؛ گام هایی جذاب در دنیای پزشکی</title><meta property="og:title" content="کرد؛ گام هایی جذاب در دنیای پزشکی"/><meta name="twitter:title" content="کرد؛ گام هایی جذاب در دنیای پزشکی"/><meta name="description" content="کرد؛ گام هایی جذاب در دنیای پزشکی"/><meta property="og:description" content="کرد؛ گام هایی جذاب در دنیای پزشکی"/><meta name="twitter:description" content="کرد؛ گام هایی جذاب در دنیای پزشکی"/><meta property="og:image" content="/logo512.png"/><meta name="twitter:image" content="/logo512.png"/><meta name="twitter:card" content="summary_large_image"/>`,
                    `<title>گپ و گفت ${gap.title} | کرد</title>
                                 <meta property="og:title" content="گپ و گفت ${gap.title} | کرد"/>
                                 <meta name="twitter:title" content="گپ و گفت ${gap.title} | کرد"/>
                                 <meta name="description" content="${gap.bold_description}"/>
                                 <meta property="og:description" content="${gap.bold_description}"/>
                                 <meta name="twitter:description" content="${gap.bold_description}"/>
                                 <meta property="og:image" content="https://restful.kred.ir/${gap.picture}"/>
                                 <meta name="twitter:image" content="https://restful.kred.ir/${gap.picture}"/>
                                 <meta name="twitter:card" content="summary_large_image"/>`,
                ))
            }
            else res.sendFile(path.join(__dirname, "index.html"))
        }
        catch (e)
        {
            console.log(e.message)
            res.sendFile(path.join(__dirname, "index.html"))
        }
    })
}

app.route("*").get((req, res) =>
{
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate") // HTTP 1.1.
    res.setHeader("Pragma", "no-cache") // HTTP 1.0.
    res.setHeader("Expires", "0") // Proxies.
    res.sendFile(path.join(__dirname, "index.html"))
})

app.listen(3000, () => console.log(`Server is running ... `))