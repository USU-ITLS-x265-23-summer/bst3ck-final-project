console.log("Loaded GlobalHeader javascript file");

window.addEventListener('DOMContentLoaded',function () {
    console.log("Dom Loaded");

    $("#globalHeader").load("./global/globalHeader.html");
    
    waitForElm("#" + selectedTab).then((elm) => {
        var element = document.getElementById(selectedTab);
        element.classList.add("navSelected");
    });
    
});

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}