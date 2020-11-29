

// 创建一个模块区域
var module1 = new Object({
    //    缓存this
    that: this,

    timeline: [],
    enterFullscreenMode: {
        type: "fullscreen",
        fullscreen_mode: true,
        message: "<p>进入全屏</p>",
        button_label: "点击这里"
    },
    welcome: {
        type: "html-keyboard-response",
        stimulus:
            "<p style='font: bold 42px 华文楷体; color: #B22222'>\
       欢迎参与我们的实验</p>\
       <p style='font：30px S华文楷体; color: black'><br/>\
       <按任意键继续><br/><b>实验过程中请勿退出全屏</b>\
       <br/><br/></p>\
       <p style='font:24px 华文楷体; color: grey'>\
       云南师范大学商学院教育学院<br/>2020年</p>",
        post_trial_gap: 100
    },
    sex: {
        type: 'html-button-response',
        data: { varname: 'sex' },
        stimulus: '你的性别',
        choices: ['男', '女', '其他'],
        on_finish: function addRespFromSurvey(data) {
            data.response = parseInt(data.button_pressed) + 1
        }
    },
    age: {
        type: 'survey-html-form',
        data: { varname: 'age' },
        preamble: '你的年龄',
    html: `
    <p><input name="Q0" type="number" placeholder="1900~2020" min=1900 max=2020
    oninput="if(value.length>4) value=value.slice(0,4)" required /></p>`,
    button_label: '继续',
        on_finish: function addRespFromSurvey(data) {
            data.response = parseInt(data.button_pressed) + 1
        }
    },
    education: {
        type: 'survey-html-form',
        data: { varname: 'education' },
        preamble: '教育经历',
        html: `
       <p><select name="Q0" size=10>
       <option>小学以下</option>
       <option>小学</option>
       <option>初中</option>
       <option>高中</option>
       <option>大学</option>
       <option>大学以上</option>
       </select></p>`,
        button_label: '继续',
        on_finish: function addRespFromSurvey(data) {
            data.response = parseInt(data.button_pressed) + 1
        }
    },
    instructions: {
        type: "html-keyboard-response",
        stimulus: "<p>In this experiment, pictures will appear in the center " +
            "of the screen.</p><p>If the picture is <strong>circle</strong>, " +
            "press the letter F on the keyboard as fast as you can.</p>" +
            "<p>If the picture is <strong>square</strong>, press the letter J " +
            "as fast as you can.</p>" +
            "<p>If the picture is <strong>triangle</strong>, press the letter H " +
            "as fast as you can.</p>" +
            "<div style='width: 700px;'>" +
            "<div style='float: left;'><img src='img/2.png'></img>" +
            "<p class='small'><strong>Press the F key</strong></p></div>" +
            "<div style='float: left;'><img src='img/3.png'></img>" +
            "<p class='small'><strong>Press the J key</strong></p></div>" +
            "<div class='float: right;'><img src='img/1.png'></img>" +
            "<p class='small'><strong>Press the H key</strong></p></div>" +
            "</div>" +
            "<p>Press any key to begin.</p>",
        post_trial_gap: 2000
    },
    test_stimuli: [
        { stimulus: "img/2.png", item: '<span style="font-size:40px;">坏人</span>', data: { test_part: 'test', correct_response: 'm' } },
        { stimulus: "img/2.png", item: '<span style="font-size:40px;">好人</span>', data: { test_part: 'test', correct_response: 'n' } },
        { stimulus: "img/2.png", item: '<span style="font-size:40px;">常人</span>', data: { test_part: 'test', correct_response: 'n' } },
        { stimulus: "img/3.png", item: '<span style="font-size:40px;">坏人</span>', data: { test_part: 'test', correct_response: 'n' } },
        { stimulus: "img/3.png", item: '<span style="font-size:40px;">好人</span>', data: { test_part: 'test', correct_response: 'n' } },
        { stimulus: "img/3.png", item: '<span style="font-size:40px;">常人</span>', data: { test_part: 'test', correct_response: 'm' } },
        { stimulus: "img/1.png", item: '<span style="font-size:40px;">坏人</span>', data: { test_part: 'test', correct_response: 'n' } },
        { stimulus: "img/1.png", item: '<span style="font-size:40px;">好人</span>', data: { test_part: 'test', correct_response: 'm' } },
        { stimulus: "img/1.png", item: '<span style="font-size:40px;">常人</span>', data: { test_part: 'test', correct_response: 'n' } }
    ],
    fixation: {
        type: 'html-keyboard-response',
        stimulus: '<div style="font-size:60px;">+</div>',
        choices: jsPsych.NO_KEYS,
        trial_duration: function () {
            return jsPsych.randomization.sampleWithoutReplacement([250, 500, 750, 1000, 1250, 1500, 1750, 2000], 1)[0];
        },
        data: { test_part: 'fixation' }
    },
    test: {
        type:"html-keyboard-response",
    choices:['m','n'],
    stimulus_duration:2000,
    trial_duration:5000,
    stimulus: function() {
      return "<img src='"+jsPsych.timelineVariable('stimulus', true)+"'>"+
      "<div style='font-size:60px'>+</div>"+
      "<p>"+jsPsych.timelineVariable('item',true)+"</p>"},
      data: jsPsych.timelineVariable('data'),
      //post_trial_gap: 5000,
      
      on_finish: function(data){
        var accuracy = false;
            if (data.correct_response == jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(data.key_press)){
                accuracy = true;
                }
              data.accuracy = accuracy;
            }
    },
    feedback_trial: {
        data: { screen_id: "feedback" },
        type: "html-keyboard-response",
        stimulus: function () {
            var last_trial_accuracy = jsPsych.data.get().last(1).values()[0].accuracy;
            if (last_trial_accuracy == 1) {
                return "correct!"
            } else {
                return "incorrect!"
            }
        },
        choices: jsPsych.NO_KEYS,
        trial_duration: 500
    },

    debrief_block: {
        type: "html-keyboard-response",
        stimulus: function () {

            var trials = jsPsych.data.get().filter({ test_part: 'test' });
            var correct_trials = trials.filter({ correct: true });
            var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
            var rt = Math.round(correct_trials.select('rt').mean());

            return "<p>You responded correctly on " + accuracy + "% of the trials.</p>" +
                "<p>Your average response time was " + rt + "ms.</p>" +
                "<p>Press any key to complete the experiment. Thank you!</p>";

        }
    },
    m1: function () {
        // 缓存this
        var that = this;
        console.log(that, "======")
        this.timeline.push(this.enterFullscreenMode)
        this.timeline.push(this.welcome)
        this.timeline.push(this.sex)
        this.timeline.push(this.age)
        this.timeline.push(this.education)
        this.timeline.push(this.instructions)
        var test_procedureaaaa = {
            timeline: [that.fixation, that.test, that.feedback_trial],
            timeline_variables: that.test_stimuli,
            repetitions: 1,
            randomize_order: true
        }
        this.timeline.push(test_procedureaaaa)

        this.timeline.push(this.debrief_block)
        //   建个定时器延迟 0.5s执行
        setTimeout(function () {
            jsPsych.init({
                timeline: that.timeline,
                on_finish: function () {
                    jsPsych.data.get().localSave('csv', 'data.csv');
                }
            });
        }, 500)
    }

});
// 启动初始化函数
module1.m1()