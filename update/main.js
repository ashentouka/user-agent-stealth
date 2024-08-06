{
    const fs = require("fs");
    const axios = require("axios");
    const cheerio = require("cheerio");

    function save(file,data) {
        fs.writeFileSync(`../dist/${file}.json`, JSON.stringify(data, null, 1), 'utf-8');
    }
    function precision(flt) {
        return parseFloat(flt.toFixed(8))
    }
    function checkNumbers(cleaner) {
       let rt = 0;
        let saver = [];
        let spill = false;
        for (let i in cleaner) {
            let rtpr = parseFloat(cleaner[i].pct) / 100;
            let rtprecise = precision(rtpr);
            rt += rtprecise;
            console.log(rtprecise,rt);
            let item = {
                pct: rtprecise,
                ua: cleaner[i].ua
            }
            if (rt > 1 ) {
                item.pct = precision(parseFloat(1 - rt))
                spill = true;
            }
            saver.push(item);
            if (spill) {
                console.warn("data contains > 100% rest ignored");
                break;
            }
        }
        if (!spill && rt < 1) {
            console.warn("entry [0] inflated by ", (1 - rt));
            saver[0].pct = precision(saver[0].pct + (1 - rt));
        }
        return saver;
    }

    function updateDate() {
        axios.get("https://www.useragents.me").then(response => {
            const $ = cheerio.load(response.data);
            let desktop = $("#most-common-desktop-useragents-json-csv div:nth-child(1) textarea").val();
            save("desktop", checkNumbers(JSON.parse(desktop)));
            let mobile = $("#most-common-mobile-useragents-json-csv div:nth-child(1) textarea").val()
            save("mobile", checkNumbers(JSON.parse(mobile)));
        })
    }
    if (!fs.existsSync("../dist")) fs.mkdirSync("../dist");

    updateDate();
}

