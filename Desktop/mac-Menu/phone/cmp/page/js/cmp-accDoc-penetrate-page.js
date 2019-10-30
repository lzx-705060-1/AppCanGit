

function insertCss(path){
    var linkObj =document.createElement("link");
    linkObj.href = path;
    linkObj.rel = 'stylesheet';
    linkObj.type = 'text/css';
    document.getElementsByTagName("head")[0].appendChild(linkObj);
}
cmp.ready(function () {
    cmp.backbutton();
    cmp.backbutton.push(cmp.href.back);
    if(optionsObj.options.h5Header){
        document.querySelector("header").classList.add("cmp-h5-header");
        document.querySelector(".cmp-content").classList.add("cmp-h5-content");
    }
    cmp.accDoc(optionsObj.options);

});
