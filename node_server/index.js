const app = require("express")()
const fs = require("fs")
const path = require("path")
const axios = require("axios")

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
    axios.get(`https://restful.kred.ir/site-map?time=${new Date().toISOString()}`).then(response => res.send(response.data))
})

app.route("/.well-known/assetlinks.json").get((req, res) => res.sendFile(path.join(__dirname, "assetlinks.json")))

app.route("/:file").get((req, res) =>
{
    res.setHeader("Access-Control-Allow-Origin", "*")
    if (fs.existsSync(path.join(__dirname, `/${req.params.file}`)))
    {
        res.setHeader("Cache-Control", "max-age=604800")
        res.sendFile(path.join(__dirname, `/${req.params.file}`))
    }
    else
    {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate") // HTTP 1.1.
        res.setHeader("Pragma", "no-cache") // HTTP 1.0.
        res.setHeader("Expires", "0") // Proxies.
        if (
            req.params.file === "videos" ||
            req.params.file === "class" ||
            req.params.file === "pavilions" ||
            req.params.file === "exchanges" ||
            req.params.file === "sign-up"
        )
        {
            res.sendFile(path.join(__dirname, "index.html"))
        }
        else res.status(404).sendFile(path.join(__dirname, "index.html"))
    }
})

app.route("/videos/:id").get((req, res) => fs.readFile("./index.html", null, (err, data) => sendVideoHtml(req.params.id, res, data, err)))
app.route("/videos/:id/*").get((req, res) => fs.readFile("./index.html", null, (err, data) => sendVideoHtml(req.params.id, res, data, err)))

function sendVideoHtml(id, res, html, err)
{
    if (err) res.sendFile(path.join(__dirname, "index.html"))
    else axios.get(`https://restful.kred.ir/video-pack/${id}`)
        .then(response =>
        {
            const pack = response.data
            res.send(html.toString().replace(
                `<title>گام هایی جذاب در دنیای پزشکی | KRED</title><meta property="og:title" content="گام هایی جذاب در دنیای پزشکی | KRED"/><meta name="twitter:title" content="گام هایی جذاب در دنیای پزشکی | KRED"/><meta name="description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/><meta property="og:description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/><meta name="twitter:description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/><meta property="og:image" content="/logo512.png"/><meta name="twitter:image" content="/logo512.png"/><meta name="twitter:card" content="summary_large_image"/>`,
                `<title>فیلم‌های آموزشی ${pack.title} | KRED</title>
                                 <meta property="og:title" content="فیلم‌های آموزشی ${pack.title} | KRED"/>
                                 <meta name="twitter:title" content="فیلم‌های آموزشی ${pack.title} | KRED"/>
                                 <meta name="description" content="فیلم‌های آموزشی ${pack.title} | KRED"/>
                                 <meta property="og:description" content="فیلم‌های آموزشی ${pack.title} | KRED"/>
                                 <meta name="twitter:description" content="فیلم‌های آموزشی ${pack.title} | KRED"/>
                                 <meta property="og:image" content="https://restful.kred.ir/${pack.picture}"/>
                                 <meta name="twitter:image" content="https://restful.kred.ir/${pack.picture}"/>
                                 <meta name="twitter:card" content="summary_large_image"/>`,
            ))
        })
        .catch(err =>
        {
            if (err && err.response && err.response.status === 404) res.status(404).sendFile(path.join(__dirname, "index.html"))
            else res.sendFile(path.join(__dirname, "index.html"))
        })
}

app.route("/exchanges/:id").get((req, res) => fs.readFile("./index.html", null, (err, data) => sendExchangeHtml(req.params.id, res, data, err)))

function sendExchangeHtml(id, res, html, err)
{
    if (err) res.sendFile(path.join(__dirname, "index.html"))
    else axios.get(`https://restful.kred.ir/exchange/${id}`)
        .then(response =>
        {
            const exchange = response.data
            res.send(html.toString().replace(
                `<title>گام هایی جذاب در دنیای پزشکی | KRED</title><meta property="og:title" content="گام هایی جذاب در دنیای پزشکی | KRED"/><meta name="twitter:title" content="گام هایی جذاب در دنیای پزشکی | KRED"/><meta name="description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/><meta property="og:description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/><meta name="twitter:description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/><meta property="og:image" content="/logo512.png"/><meta name="twitter:image" content="/logo512.png"/><meta name="twitter:card" content="summary_large_image"/>`,
                `<title>تبادل کتاب ${exchange.title} | KRED</title>
                                 <meta property="og:title" content="تبادل کتاب ${exchange.title} | KRED"/>
                                 <meta name="twitter:title" content="تبادل کتاب ${exchange.title} | KRED"/>
                                 <meta name="description" content="${exchange.description}"/>
                                 <meta property="og:description" content="${exchange.description}"/>
                                 <meta name="twitter:description" content="${exchange.description}"/>
                                 <meta property="og:image" content="https://restful.kred.ir/${exchange.picture}"/>
                                 <meta name="twitter:image" content="https://restful.kred.ir/${exchange.picture}"/>
                                 <meta name="twitter:card" content="summary_large_image"/>`,
            ))
        })
        .catch(err =>
        {
            if (err && err.response && err.response.status === 404) res.status(404).sendFile(path.join(__dirname, "index.html"))
            else res.sendFile(path.join(__dirname, "index.html"))
        })
}

app.route("/class/lesson/:parent/resources/:id").get((req, res) => fs.readFile("./index.html", null, (err, data) => sendEducationHtml(req.params.id, res, data, err)))
app.route("/class/lesson/:parent/:item/resources/:id").get((req, res) => fs.readFile("./index.html", null, (err, data) => sendEducationHtml(req.params.id, res, data, err)))
app.route("/class/block/:parent/resources/:id").get((req, res) => fs.readFile("./index.html", null, (err, data) => sendEducationHtml(req.params.id, res, data, err)))
app.route("/class/block/:parent/:item/resources/:id").get((req, res) => fs.readFile("./index.html", null, (err, data) => sendEducationHtml(req.params.id, res, data, err)))

function sendEducationHtml(id, res, html, err)
{
    if (err) res.sendFile(path.join(__dirname, "index.html"))
    else axios.get(`https://restful.kred.ir/education-resource/${id}`)
        .then(response =>
        {
            const education = response.data
            res.send(html.toString().replace(
                `<title>گام هایی جذاب در دنیای پزشکی | KRED</title><meta property="og:title" content="گام هایی جذاب در دنیای پزشکی | KRED"/><meta name="twitter:title" content="گام هایی جذاب در دنیای پزشکی | KRED"/><meta name="description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/><meta property="og:description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/><meta name="twitter:description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/><meta property="og:image" content="/logo512.png"/><meta name="twitter:image" content="/logo512.png"/><meta name="twitter:card" content="summary_large_image"/>`,
                `<title>${education.title}${education.subject ? "، " + education.subject : ""} | KRED</title>
                                 <meta property="og:title" content="${education.title}${education.subject ? "، " + education.subject : ""} | KRED"/>
                                 <meta name="twitter:title" content="${education.title}${education.subject ? "، " + education.subject : ""} | KRED"/>
                                 <meta name="description" content="${education.university + (education.teacher ? " - " + education.teacher : "")}"/>
                                 <meta property="og:description" content="${education.university + (education.teacher ? " - " + education.teacher : "")}"/>
                                 <meta name="twitter:description" content="${education.university + (education.teacher ? " - " + education.teacher : "")}"/>
                                 <meta property="og:image" content="https://restful.kred.ir${education.picture}"/>
                                 <meta name="twitter:image" content="https://restful.kred.ir${education.picture}"/>
                                 <meta name="twitter:card" content="summary_large_image"/>`,
            ))
        })
        .catch(err =>
        {
            if (err && err.response && err.response.status === 404) res.status(404).sendFile(path.join(__dirname, "index.html"))
            else res.sendFile(path.join(__dirname, "index.html"))
        })
}

app.route("/pavilions/:id").get((req, res) => fs.readFile("./index.html", null, (err, data) => sendPavilionHtml(req.params.id, res, data, err)))
app.route("/pavilions/:id/*").get((req, res) => fs.readFile("./index.html", null, (err, data) => sendPavilionHtml(req.params.id, res, data, err)))

function sendPavilionHtml(id, res, html, err)
{
    if (err) res.sendFile(path.join(__dirname, "index.html"))
    else axios.get(`https://restful.kred.ir/conversation/${id}`)
        .then(response =>
        {
            const gap = response.data
            res.send(html.toString().replace(
                `<title>گام هایی جذاب در دنیای پزشکی | KRED</title><meta property="og:title" content="گام هایی جذاب در دنیای پزشکی | KRED"/><meta name="twitter:title" content="گام هایی جذاب در دنیای پزشکی | KRED"/><meta name="description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/><meta property="og:description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/><meta name="twitter:description" content="یه جمع باحال و پرانرژی از دانشجوهای علوم پزشکی... ما اینجا باهم درس می‌خونیم و به هم کمک می‌کنیم تا توی کار و زندگیمون بهتر بشیم، توی KRED، ما از جدیدترین منابع آموزشی استفاده می‌کنیم و با روش‌های جدید درس می‌خونیم، با پزشک‌ها، اساتید و دانشجوهای موفق صحبت می‌کنیم و از تجربیاتشون استفاده می‌کنیم"/><meta property="og:image" content="/logo512.png"/><meta name="twitter:image" content="/logo512.png"/><meta name="twitter:card" content="summary_large_image"/>`,
                `<title>گپ و گفت ${gap.title} | KRED</title>
                                 <meta property="og:title" content="گپ و گفت ${gap.title} | KRED"/>
                                 <meta name="twitter:title" content="گپ و گفت ${gap.title} | KRED"/>
                                 <meta name="description" content="${gap.bold_description}"/>
                                 <meta property="og:description" content="${gap.bold_description}"/>
                                 <meta name="twitter:description" content="${gap.bold_description}"/>
                                 <meta property="og:image" content="https://restful.kred.ir/${gap.picture}"/>
                                 <meta name="twitter:image" content="https://restful.kred.ir/${gap.picture}"/>
                                 <meta name="twitter:card" content="summary_large_image"/>`,
            ))
        })
        .catch(err =>
        {
            if (err && err.response && err.response.status === 404) res.status(404).sendFile(path.join(__dirname, "index.html"))
            else res.sendFile(path.join(__dirname, "index.html"))
        })
}

app.route("*").get((req, res) =>
{
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate") // HTTP 1.1.
    res.setHeader("Pragma", "no-cache") // HTTP 1.0.
    res.setHeader("Expires", "0") // Proxies.
    const url = req.originalUrl
    if (
        url === "/" ||
        url === "/payment/fail" ||
        url === "/payment/success" ||
        url === "/profile/info" ||
        url === "/profile/dashboard" ||
        url === "/profile/saved" ||
        url.slice(0, 13) === "/class/lesson" ||
        url.slice(0, 12) === "/class/block"
    )
    {
        res.sendFile(path.join(__dirname, "index.html"))
    }
    else res.status(404).sendFile(path.join(__dirname, "index.html"))
})

app.listen(3000, () => console.log(`Server is running ... `))