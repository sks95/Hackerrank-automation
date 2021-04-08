let puppeteer = require("puppeteer");
let { password, email } = require("./secrets");
let { code } = require("./code");
let gTab;

console.log("Before");
let browserPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"]
})
browserPromise.then(function(browserInstance){
    let newTabPromise = browserInstance.newPage();
    return newTabPromise;
}).then(function(newTab){
    let loginPageWillBeOpenedPromise = newTab.goto("https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login");
    gTab = newTab;
    return loginPageWillBeOpenedPromise;
}).then(function(){
    // console.log("Login page opened");
    let emailTypedPromise = gTab.type("#input-1", email, {delay : 200});
    return emailTypedPromise;
}).then(function(){
    let passwordTypedPromise = gTab.type("#input-2", password, {delay : 200});
    return passwordTypedPromise;
}).then(function(){
    let clickLoginPromise = gTab.click("button[data-analytics='LoginPassword']");
    let combinedPromise = Promise.all([clickLoginPromise,gTab.waitForNavigation({waitUntil:"networkidle0"})]);
    return combinedPromise;
}).then(function(){
    let clickpIntPrepPromise = gTab.click(".card-content h3[title='Interview Preparation Kit']");
    let warmUpChallengeElemPromise = gTab.waitForSelector("a[data-attr1='warmup']", {visible: true});
    let combinedPromise = Promise.all([clickpIntPrepPromise,gTab.waitForNavigation({waitUntil:"networkidle0"}),warmUpChallengeElemPromise]);
    return combinedPromise;
}).then(function(){
    let clickpWarmUpPromise = gTab.click(".card-content h3[title='[object Object]']");
    let sockMerchantPromise = gTab.waitForSelector("a[data-attr1='sock-merchant']", {visible: true});
    let combinedPromise = Promise.all([clickpWarmUpPromise,gTab.waitForNavigation({waitUntil:"networkidle0"}),sockMerchantPromise]);
    return combinedPromise;
}).then(function(){
    let clickpPromise = gTab.click("a[data-attr1='sock-merchant']");
    let combinedPromise = Promise.all([clickpPromise,gTab.waitForNavigation({waitUntil:"networkidle0"})]);
    return combinedPromise;
})
.catch(function(err){
    console.log(err);
})
console.log("After");

function waitAndClick(selector){
    return new Promise(function(resolve, reject){
        let selectorWaitPromise = gTab.waitForSelector(selector, {visible=true});
        selectorWaitPromise.then(function(){
            let selectorClickPromise = gTab.click(selector);
            return selectorClickPromise;
        }).then(function(){
            resolve();
        }).catch(function(){
            reject(err);
        })
    })
}
function questionSolver(modulepageUrl, code, questionName){
    return new Promise(function(resolve, reject){
        // page visit
        let reachedPageUrlPromise = gTab.goto(modulepageUrl);
        reachedPageUrlPromise.then(function(){
            // page h4 -> matching h4 -> click
            // function will execute inside the browser
            function browserconsolerunFn(questionName){
                let allH4Elem = document.querySelectorAll("h4");
                let textArr = [];
                for(let i = 0; i < allH4Elem.length; i++){
                    let myQuestion = allH4Elem[i].innerText.split("\n");
                }
                let idx = textArr.indexOf(questionName);
                allH4Elem[idx].click();
            } 
            let pageClickPromise = gTab.evaluate(browserconsolerunFn, questionName);
            return pageClickPromise;
        })
    })
}