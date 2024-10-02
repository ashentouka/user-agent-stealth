const data = {
    desktop: require("./dist/desktop.json"),
    mobile: require("./dist/mobile.json"),

    android: require("./dist/android.json"),
    iphone: require("./dist/iphone.json"),

    windows: require("./dist/windows.json"),
    macosx: require("./dist/macosx.json"),
    linux: require("./dist/linux.json")
};

function getRandom(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function agent(type) {
    return function(){
        let what = Math.random() * 100;
        let total = 0;
        let typed;

        if (type && data[type]) {
            typed = data[type];
        } else {
            typed = data.mobile.concat(data.desktop);
            typed.sort((a,b)=>{
                return a.pct < b.pct ? -1 : 1;
            })
            what *= 2;
        }

        for (let items in typed) {
            total += typed[items].pct;
            if (what <= total) {
                return typed[items].ua
            }
        }
    }
}

function random(type) {
    return function () {
        return data[type][getRandom(data[type].length)];
    }
}

// If called from the command line
if (require.main === module) {
    let type = process.argv[process.argv.length - 1]?.replace("--","");
    if (type === "desktop" || type === "mobile") {
        console.log(agent(type)());
    } else if (data[type]){
        console.log(random(type)());
    } else if (type === "any" || type === "index.js") {
        console.log(agent()());
    }

} else {
    module.exports = {
        desktop: agent("desktop"),
        mobile: agent("mobile"),
        os: {
            android: random("android"),
            iphone: random("iphone"),
            windows: random("windows"),
            macosx: random("macosx"),
            linux: random("linux")
        },
        any: agent()
    }
}