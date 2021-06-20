function getGcd(a, b) {
    let max = Math.max(a, b);
    let min = Math.min(a, b);
    if (max % min === 0) {
        return min;
    } else {
        return getGcd(max % min, min);
    }
}

function getLcm(a, b) {
    return a * b / getGcd(a, b);
}

// 竖屏锁定
function landScape(config){
    var bg = config && config.bg ? config.bg : "#000",
        txt = config && config.txt ? config.txt : "请解除竖排锁定，使用横屏浏览",
        img = config && config.img ? config.img : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAADaCAMAAABU68ovAAAAXVBMVEUAAAD29vbx8fHx8fH5+fn29vby8vL5+fn39/f6+vrx8fH+/v709PTx8fH39/fx8fH///+WLTLGAAAAHXRSTlMAIpML+gb4ZhHWn1c2gvHBvq1uKJcC6k8b187lQ9yhhboAAAQYSURBVHja7d3blpowFIDhTUIAOchZDkre/zE7ycySrbUUpsRN2/1fzO18KzEqxEVgTiZNfgmmtxRc8iaR8HNe8x4BtjQePKayYCIoyBSgvNNE1AkNSHqZyLqk97EgUCCHBzZ5mkg7ScvIJuIyOyXBRFxgpqWZyGsAZLB1KjsJi8nutHU4JCRbFRH8tmirI9k8Jx2sqNs8K/m0LQkrktO2crgcgXGB4AiTEsB0hJfo9MGgX7CGcYiYwQxmMOOvZwRhBG8tCoMXjBDeXvWCEcHbi14wgCBmMIMZzGAGM5jxETNwzMAxA8cMHDNwzMAxA8cMHDNwzMAxA8cMHDNwzMAxY6E2rUQxnH2tz9cirlJFwFBJedaPnUv0M7++egPDE8iAJcIDmxwH5wwv9vUviw2kLbVO3TJU5uul/EyB0FoLp4x60PdGUd3qPurrWyjGGTc05u+1dcgI7/+tCCPARWGhH7o5Y7RCf+bH9ctXLp6v2BVDxfqz0oPXeSVaNtINo/1SXDv4dck8IIkbhtC2ol+iouEonTBCbYvVMnXOjxww6s/RFrBUpXHh/gw1rHj5d/qhYn9Gpk2FWh6xRBRX5Oj3Znh2Sq49/L6+y8pB26q9GbE2dbA2mVbx6I+7MfBglLCttm73ZQi7AD3iL4HqjFYJHSPRppqaUaJ3ATpGa+ckpGak2hRRMyqjGMkvl+xyFeSMwjAqcsZgGDdyhl0oNTnDN4yenJGZFGxNChP5/Y3efh6SM2rDOJMzboYxkDMqwyjIGcIw6F+io2FU1IxIm1JqRmgXSkvNKNCXeTpGrU0JNSO2c6LIGPgCS8AuDHz9ta0SXWDtxoDRH+MqlbC2Dt2G2JFRadtQZt2qq/orGowdGb2euxYiqWEpVWhTBnszoNAPdStuQwxqf0aocdWKW4Z+DfszIh8pxJqbuCE4YAC+4bm0evtipjpgJHeFnyyt1Ku2xa0bhjxr27p75rECNwyI9ZwvXkHq+7aTaMEV44YYy/spfgjgjNHaWW+GeUhGEX7tLlVinIFDDSgnOwhi1V6bU0b6tVS9eAERe863g4dRrtiHdc6o+nn5vtyVVgR79Cqt4uL6gfHPQyGqtP2vf7HADGbcYwaOGThm4JiBYwaOGThm4JiBYwaOGThm4JiBYwaOGThm4JiBYwaOGThm4JjhtOM+J/AgT008yDMkN/dPP9hzS8zAMQN3OEYeekp5YU7KOKXwVXqiY+QS7smcinGKABWdiBgpPJTSMHJ4KidhhPBUSMLw4CmPhKHgKUXCkHsygum71ftNSgCX6bsl8FQyfbcL5EdYsDk0R3j7aiA5wpt5AjKg/2gLJEBD/0Hf2OOf/vRrj6z/7GtP4B3nMKyjHA12kIPSjnJs3FEO0TvKkYJHOWCR+rjJH0Vn6fI5PjNbAAAAAElFTkSuQmCC";
    $('body').append('<style type="text/css">@-webkit-keyframes rotation{10%{transform: rotate(90deg); -webkit-transform: rotate(90deg)} 50%, 60%{transform: rotate(0deg); -webkit-transform: rotate(0deg)} 90%{transform: rotate(90deg); -webkit-transform: rotate(90deg)} 100%{transform: rotate(90deg); -webkit-transform: rotate(90deg)} } @keyframes rotation{10%{transform: rotate(90deg); -webkit-transform: rotate(90deg)} 50%, 60%{transform: rotate(0deg); -webkit-transform: rotate(0deg)} 90%{transform: rotate(90deg); -webkit-transform: rotate(90deg)} 100%{transform: rotate(90deg); -webkit-transform: rotate(90deg)} } #orientLayer{display: none; z-index: 999999;} @media all and (orientation : portrait){#orientLayer{display: block;} } .mod-orient-layer{position: fixed; height: 100%; width: 100%; left: 0; top: 0; right: 0; bottom: 0; background: '+bg+'; z-index: 9997} .mod-orient-layer__content{position: absolute; width: 100%; top: 45%; margin-top: -75px; text-align: center} .mod-orient-layer__icon-orient{background-image: url('+img+'); display: inline-block; width: 67px; height: 109px; transform: rotate(90deg); -webkit-transform: rotate(90deg); -webkit-animation: rotation infinite 1.5s ease-in-out; animation: rotation infinite 1.5s ease-in-out; -webkit-background-size: 67px; background-size: 67px} .mod-orient-layer__desc{margin-top: 20px; font-size: 15px; color: #fff}</style><div id="orientLayer" class="mod-orient-layer"> <div class="mod-orient-layer__content"> <i class="icon mod-orient-layer__icon-orient"></i> <div class="mod-orient-layer__desc">'+txt+'</div> </div></div>');
}

function touch(e) {
    if(e.touches[0].clientX >= $(document.body).outerWidth() / 2) { 
        document.getElementsByTagName("body")[0].dispatchEvent(new KeyboardEvent("keydown", { key: "m" }));
        document.getElementsByTagName("body")[0].dispatchEvent(new KeyboardEvent("keyup", { key: "m" }));
    } else {
        document.getElementsByTagName("body")[0].dispatchEvent(new KeyboardEvent("keydown", { key: "n" }));
        document.getElementsByTagName("body")[0].dispatchEvent(new KeyboardEvent("keyup", { key: "n" }));
    }

}

function order(arr = []) { 
    let tmpW = [], a = [];
    for(let i = 0; i < arr.length; i++) { 
        arr.push(arr.splice(0, 1)[0]);
        tmpW[i] = jsPsych.utils.deepCopy(arr);
    }
    return tmpW;
}

function com(img = [], wordArr = [], r = []) { 
    let result = {
        match: []
    };

    // match
    wordArr.splice(-1, 1).forEach(v => {
        for(let i = 0; i < img.length; i++) { 
            result.match.push({
                img: img[i],
                word: v[i],
                condition: "match"
            });
        }
    });
    let t = jsPsych.utils.deepCopy(wordArr);
    if(!r.length) { 
        let a = [];
        for (let i = 0; i < wordArr.length; i++) { 
            let s = t.splice(Math.floor(Math.random() * t.length), 1)[0];
            img.forEach(c => {
                a.push({
                    img: c,
                    word: s.splice(0,1)[0],
                    condition: "mismatch"
                });
            });
        }
        result["mis" + wordArr.length] = a;
    } else { 
        r.forEach(v => {
            if(v >= img.length) result["mis" + v] = "too long";
            let a = [];
            for (let i = 0; i < v; i++) { 
                if (!t.length) t = jsPsych.utils.deepCopy(wordArr);
                let s = t.splice(Math.floor(Math.random() * t.length), 1)[0];
                img.forEach(c => {
                    a.push({
                        img: c,
                        word: s.splice(0,1)[0],
                        condition: "mismatch"
                    });
                });
            }
            result["mis" + v] = a;
        });
    }
    return result;
}