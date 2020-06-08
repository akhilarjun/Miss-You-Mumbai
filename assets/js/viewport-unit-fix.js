"use strict";

var viewport = {
    get height(){
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    },
    get width(){
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
};

(function(){
    //FIX to support vh and vw
    var forEach = [].forEach,
        _el = function(selector){
            return document.querySelectorAll(selector);
        },
        scaleForVh = function (selectorText, verticalScale) {
            forEach.call(_el(selectorText), function(elem){
                elem.style.height = verticalScale*viewport.height/100+'px';
            });
        },
        scaleForVw = function (selectorText, horizontalScale) {
            forEach.call(_el(selectorText), function(elem){
                elem.style.width = horizontalScale*viewport.width/100+'px';
            });
        },
        get_browser = function () {
            var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
            if(/trident/i.test(M[1])){
                tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
                return {name:'IE',version:(tem[1]||'')};
            }   
            if(M[1]==='Chrome'){
                tem=ua.match(/\bOPR\/(\d+)/);
                if(tem!=null)   {return {name:'Opera', version:tem[1]};}
            }   
            M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
            if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
            return {
            name: M[0],
            version: M[1]
            };
        },
        minimum = {
            IE : 11,
            CHROME : 50,
            FIREFOX : 46,
            SAFARI : 5,
            OPERA : 37
        },
        isBrowserOld = function(){
            var currentBrowser = get_browser();
            if(currentBrowser.name.toLowerCase() == 'msie'){
                currentBrowser.name = 'ie';
            }
            for(var key in minimum){
                if(key == currentBrowser.name.toUpperCase()){
                    return (minimum[key] > Number(currentBrowser.version));
                }
            }
        };

    if (isBrowserOld()) {
        console.info("Applying vh/vw Polyfill");
        document.styleSheets && forEach.call(document.styleSheets, function(stylesheet){
            stylesheet.rules && forEach.call(stylesheet.rules, function(rule){
                rule.style && forEach.call(rule.style, function(prop){
                    if (prop == "height") {
                        if (rule.style[prop].indexOf("vh") > -1) {
                            var verticalScale = rule.style[prop].substring(0,rule.style[prop].indexOf("vh"));
                            window.addEventListener("resize", function(){
                                scaleForVh(rule.selectorText, verticalScale);
                            });
                            scaleForVh(rule.selectorText, verticalScale);
                        }
                    } else if (prop == "width") {
                        if (rule.style[prop].indexOf("vw") > -1) {
                            var horizontalScale = rule.style[prop].substring(0,rule.style[prop].indexOf("vw"));
                            window.addEventListener("resize", function(){
                                scaleForVw(rule.selectorText, horizontalScale);
                            });
                            scaleForVw(rule.selectorText, horizontalScale);
                        }
                    }
                });
            });
        });
    }
})();