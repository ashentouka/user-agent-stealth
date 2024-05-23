  const data = {
    mobile: require("./dist/mobile.json"),
    desktop: require("./dist/desktop.json")
};

function agent(type) {
    return function(){
        let what = Math.random() * 100;
        let total = 0;
        const typed = (type) ? data[type] : data.mobile.concat(data.desktop);
        for (let items in typed) {
            total += typed[items].pct;
            if (what <= total) {
                return typed[items].ua
            }
        }
    }
}

// If called from the command line
if (require.main === module) {
    if (process.argv.length[process.argv.length - 1] === "--mobile") {
        console.log(agent("mobile"))
    } else {
        console.log(agent("desktop"))
    }

} else {
    module.exports = {
        desktop: agent("desktop"),
        mobile: agent("mobile"),
        any: agent()
    }
}