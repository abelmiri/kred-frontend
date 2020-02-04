import axios from "axios"

// export const REST_URL = "http://localhost:1435"
export const REST_URL = "https://restful.kred.ir"

function get(url, param = "", noToken)
{
    const token = noToken || !localStorage.hasOwnProperty("user") ? "" : JSON.parse(localStorage.getItem("user")).token
    return axios.get(encodeURI(REST_URL + "/" + url + "/" + param), {headers: !noToken ? {"Authorization": `${token}`} : null})
        .then((res) =>
        {
            if (res.status === 200) return res.data
            else throw res.data
        })
        .catch((err) =>
        {
            console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica',consolas,sans-serif; font-weight:900;", err.response)
            throw err
        })
}

function post(url, data, param = "", noToken, progress)
{
    const token = noToken || !localStorage.hasOwnProperty("user") ? "" : JSON.parse(localStorage.getItem("user")).token
    return axios.post(encodeURI(REST_URL + "/" + url + "/" + param), data, {
        headers: !noToken ? {"Authorization": `${token}`} : null,
        onUploadProgress: e => progress ? progress(e) : null,
    })
        .then((res) =>
        {
            if (res.status === 200 || res.status === 201) return res.data
            else throw res.data
        })
        .catch((err) =>
        {
            console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica',consolas,sans-serif; font-weight:900;", err.response)
            throw err
        })
}

function patch(url, data, param = "")
{
    const token = JSON.parse(localStorage.getItem("user")).token
    const sendUrl = param === "" ? REST_URL + "/" + url + "/" : REST_URL + "/" + url + "/" + param + "/"
    return axios.patch(encodeURI(sendUrl), data, {headers: {"Authorization": `${token}`}})
        .then((res) =>
        {
            if (res.status === 200) return res.data
            else throw res.data
        })
        .catch((err) =>
        {
            console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica',consolas,sans-serif; font-weight:900;", err.response)
            throw err
        })
}

function del(url, data, param = "")
{
    const token = JSON.parse(localStorage.getItem("user")).token
    const sendUrl = param === "" ? REST_URL + "/" + url + "/" : REST_URL + "/" + url + "/" + param + "/"
    return axios.delete(encodeURI(sendUrl), {headers: {"Authorization": `${token}`}, data})
        .then((res) =>
        {
            if (res.status === 200 || res.status === 204) return res.data
            else throw res.data
        })
        .catch((err) =>
        {
            console.log(" %cERROR ", "color: orange; font-size:12px; font-family: 'Helvetica',consolas,sans-serif; font-weight:900;", err.response)
            throw err
        })
}

const api = {
    get, post, patch, del,
}

export default api