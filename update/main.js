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
            let rtprecise = parseFloat(cleaner[i].pct);
            rt += rtprecise;
            console.log(rtprecise,rt);
            let item = {
                pct: rtprecise,
                ua: cleaner[i].ua
            }
/*            if (rt > 100) {
                item.pct = 100 - rt
                spill = true;
            }
            saver.push(item);
            if (spill) {
                console.warn("data contains > 100% rest ignored");
                break;
            }*/ 
            saver.push(item);
        }
/*        if (!spill && rt < 100) {
            console.warn("entry [0] inflated by ", (100 - rt));
            saver[0].pct = precision(saver[0].pct + (100 - rt));
        }*/
        return saver;
    }

    function agents($,elems) {
        let output = [];
        for (let ele of elems) {
            output.push($(ele).val());
        }
        return output;
    }

    function updateDate() {
        axios.get("https://www.useragents.me").then(response => {
            const $ = cheerio.load(response.data);
            let desktop = $("#most-common-desktop-useragents-json-csv div:nth-child(1) textarea").val();
            save("desktop", checkNumbers(JSON.parse(desktop)));
            let mobile = $("#most-common-mobile-useragents-json-csv div:nth-child(1) textarea").val()
            save("mobile", checkNumbers(JSON.parse(mobile)));

            let windows = $("body > div:nth-child(4) > div > table > tbody > tr > td > div > textarea");
            save("windows", agents($,windows));
            let macosx = $("body > div:nth-child(5) > div > table > tbody > tr > td > div > textarea");
            save("macosx", agents($,macosx));
            let linux = $("body > div:nth-child(6) > div > table > tbody > tr > td > div > textarea");
            save("linux", agents($,linux));
            let iphone = $("body > div:nth-child(7) > div > table > tbody > tr > td > div > textarea");
            save("iphone", agents($,iphone));
            let android = $("body > div:nth-child(10) > div > table > tbody > tr > td > div > textarea");
            save("android", agents($,android));
        })
    }
    if (!fs.existsSync("../dist")) fs.mkdirSync("../dist");

    updateDate();
}

