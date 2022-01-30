import { request as _request } from '../models/request.js'
import Router from 'express'

const router = Router()
//{{ lat: 10.3764, lng: 7.7095 }}
router.post('/ussd', (req, res) => {
    let c = "C "; let e = "E ";
    let response = "";
    let { text } = req.body
    // let { sessionId, serviceCode, phoneNumber, text } = req.body

    text = text.split("*"); //[a, b, c, d, e, f]
    // a: sign of the latitude, b: whole number of the latitude, c: decimal of the latitude, d: sign of the longitude, e: whole number of the longitude, f: decimal of the longitude

    // Converting every element in the array to integer
    try {
        text = text.map(item => parseInt(item));
        let latitude = text[1];
        let latDec = text[2];

        let longitude = text[4];
        let lngDec = text[5];

        latitude = parseFloat(`${latitude}.${latDec}`);
        longitude = parseFloat(`${longitude}.${lngDec}`);

        latitude = ((text[0] === 0) ? latitude * -1 : latitude);
        longitude = ((text[3] === 0) ? longitude * -1 : longitude);

        let data = { latitude, longitude };
        let savedAlert = new _request(data);

        savedAlert.save()
            .then(savedEntry => {
                req.io.emit("alert_recieved", savedEntry);
                response = `${e}Your distress signal has been sent.`;
            })
            .catch(err => {
                response = `${e}A technical error occured, hence, the distress signal was not sent.`;
            })
    } catch (err) {
        response = `${e}Wrong parameters supplied to the fieldset.`;
    }

    res.header("Content-type", "text/plain");
    res.end(response);
})

router.get('fetch-alerts', (req, res) => {
    _request.find({})
        .then(data => {
            console.log(data)
            res.json({
                success: true,
                data,
                message: "Data successfully fetched."
            })
        })
        .catch(err => {
            res.json({
                success: false,
                data: err,
                message: "Error fetching data."
            })
        })
})

export default router
