// 主体实验程序
function exp(variable, trial, match, maxMismatch) {
    let subTV = jsPsych.randomization.shuffleNoRepeats(variable, function (x, y) { return x.img === y.img && x.word === y.word });
    let subT = [{ // 开头的指导语，只会出现一次
        type: "instructions",
        pages: function() {
            let start = "<p class='header'>请您记住如下联结:</p>",
                end = "<p class='footer'>按 继续 进入练习阶段</p><div>";
                $(document.body).css("cursor", "default");
            return [start + getMatchWord(match) + end + getKeys()];
        },
        show_clickable_nav: true,
        allow_backward: false,
        button_label_previous: "返回",
        button_label_next: "继续",
        on_finish: function () { 
            $(document.body).css("cursor", "default");
        }
    }, { // 练习的时间线
        timeline: [{
            timeline: [{ // 练习的指导语，错误过多显示
                type: "instructions",
                pages: function() {
                    let start = "<p class='header'>错误次数过多，请您仔细记住如下联结:</p>",
                        end = "<p class='footer'>按 继续 进入练习阶段</p><div>";
                    $(document.body).css("cursor", "default");
                    return [start + getMatchWord(match) + end + getKeys()];
                },
                show_clickable_nav: true,
                allow_backward: false,
                button_label_previous: "返回",
                button_label_next: "继续",
                on_finish: function() { 
                    sessionStorage.setItem("errorPrac", 0);
                    $(document.body).css("cursor", "none");
                }
            }],
            conditional_function: function() { // 判断前面那个错误次数过多是否显示
                if(parseInt(sessionStorage.getItem("errorPrac"))) {
                    return true
                } else {
                    return false
                }
            }
        }, trial, { // 给予反馈，trial是实验主程序
            type: "html-keyboard-response",
            stimulus: function () {
                let a = jsPsych.data.get().last(1).values()[0];
                if (a.acc) {
                    return "<span style='font-size: 40px;'>正确</span>";
                } else if (a.key_press) {
                    return "<span style='font-size: 40px;'>错误</span>";
                } else {
                    return "<span style='font-size: 40px;'>太慢</span>";
                }
            },
            choices: jsPsych.NO_KEYS,
            trial_duration: 1000
        }],
        timeline_variables: jsPsych.randomization.shuffle(maxMismatch.length ? maxMismatch : variable).splice(0, pracNum), // 练习的时间变量
        loop_function: function () { // 判断是否错误过多而继续进行实验。
            let data = jsPsych.data.get().filter({ save: true }).last(pracNum).select("acc").mean();
            if (data && data > pracAcc) {
                sessionStorage.setItem("errorPrac", 0);
                return false;
            } else {
                sessionStorage.setItem("errorPrac", 1);
                return true;
            }
        }
    }];
    subT.push({ // 正式实验
        type: "instructions",
        pages: function() {
            let start = "<p class='header'>请您记住如下联结:</p>",
                end = "<p class='footer'>按 继续 进入正式实验</p><div>";
                $(document.body).css("cursor", "default");
            return [start + getMatchWord(match) + end + getKeys()];
        },
        show_clickable_nav: true,
        allow_backward: false,
        button_label_previous: "返回",
        button_label_next: "继续",
        on_finish: function () { 
            $(document.body).css("cursor", "none");
        }
    }, {
        timeline: [trial],
        timeline_variables: subTV.splice(0, formNum)
    });
    while (subTV.length > 0) { // 正式实验新开block
        subT.push({
            type: "html-button-response",
            stimulus: function () {
                return "你准确率还挺高的，为90%，先休息一下吧～"
            },
            choices: ["休息结束"]
        }, {
            type: "instructions",
            pages: function() {
                let start = "<p class='header'>请您记住如下联结:</p>",
                    end = "<p class='footer'>按 继续 进入正式实验</p><div>";
                return [start + getMatchWord(match) + end + getKeys()];
            },
            show_clickable_nav: true,
            allow_backward: false,
            button_label_previous: "返回",
            button_label_next: "继续",
        }, {
            timeline: [trial],
            timeline_variables: subTV.splice(0, Math.min(formNum, subTV.length))
        });
    }
    return subT;
}
// 指导语中按键部分
function getKeys() {
    return `
    <p class="key">如果二者匹配，请按 ${answer[0]} 键 或者点击屏幕 ${answer[0] === "m" ? "右侧" : "左侧"}</p>
    <p class="key">如果二者不匹配，请按 ${answer[1]} 键 或者点击屏幕 ${answer[0] === "m" ? "右侧" : "左侧"}</p>
    `;
}
// 指导语中联结呈现部分
function getMatchWord(arr) {
    if(arr.length && !arr.length) return 0;
    let a = "";
    arr.forEach(v => {
        a = a + `<p class="content">
        <img src="${v.img}" >--- <span class="word">${v.word}</span>
        </p>`;
    });
    return "<div class='box'>" + a + "</div>";
}
function exp_process(sti, typeThis) { 
        // 求公倍数，以保证数量一致
        let n = [];
        Object.keys(sti).forEach(v => {
            n.push(sti[v].length * 2);
            if (n.length > 1) {
                n.push(getLcm(n.splice(0, 1)[0], n.splice(0, 1)[0]));
            }
        });
        n = n[0];
        // 将所有情况组合出来
        let tmpA = [];
        Object.keys(sti).forEach((v, j) => {
            let tmp = [];
            if(j != 0) {
                for (let i = 0; i < (sti[v].length / sti["match"].length); i++) {
                    sti.match.forEach(f => {
                        tmp.push(f);
                    });
                }
                sti[v].forEach(f => {
                    tmp.push(f);
                });
                tmpA.push(tmp);
            }
        });
        console.log(tmpA);
        let timevar = tmpA[0]; // 固定了 就直接
        let tmpMaxMis = [];
        tmpA.forEach(v => {
            if (tmpMaxMis.length < v.length) { 
                tmpMaxMis = v;
            }
        });
        timevar = jsPsych.randomization.repeat(timevar, (n * recepetion) / timevar.length);
        return exp(timevar, trial, sti.match, jsPsych.randomization.repeat(tmpMaxMis, (n * recepetion) / tmpMaxMis.length));
}