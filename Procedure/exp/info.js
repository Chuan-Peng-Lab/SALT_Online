function getInfo(exper_number) { 
    let experinumber = {
        type:"survey-html-form",
        data:{
            varname:'subjectnumber',
        },
        preamble:"<p style =' color : white'>你分配到的实验编号是</p>",
        html:"<p><input name='Q0' type='text' value='" + exper_number + "' disabled='disabled' /></p><p><input name='Q1' type='number' value='' required/></p>",
        button_label:"继续",
        on_finish: function addRespFromSurvey(data) {
            data.number = exper_number + data.response.Q1.padStart(4, "0");
            info["index"] = exper_number + data.response.Q1.padStart(4, "0");
        },
        on_load: function () { 
            let bb = document.getElementById("jspsych-content");
            let label1 = document.createElement("p");
            label1.id = "numberf", label1.textContent = "你的最终编号是：" + document.getElementsByTagName("input")[0].value + document.getElementsByTagName("input")[1].value.toString().padStart(4, "0");
            label1.style = "font-size: 20px;color: white;";
            bb.appendChild(label1);
            document.getElementsByTagName("input")[1].addEventListener("input", function(a){
                document.getElementById("numberf").textContent = "你的最终编号是：" + document.getElementsByTagName("input")[0].value + document.getElementsByTagName("input")[1].value.toString().padStart(4, "0");
            })
        }
    }; // 实验 和 被试 ID
    let number_of_experiment ={
        type:"survey-html-form",
        data:{
            varname:'number_of_experiment',
        },
        preamble:"<p style = 'color : white'>你的实验次数是</p>",
        html:"<p><input name='Q0' type='number' value=' ' required/></p>",
        button_label:"继续",
        on_finish: function addRespFromSurvey(data) {
            info["frequencyOfExper"] = parseInt(data.response.Q0);
        }
    }; // 实验次数
    let person_name = {
        type:"survey-html-form",
        data:{
            varname:'name',
        },
        preamble:"<p style =' color : white'>你的名字是</p>",
        html:"<p><input name='Q0' type='text' value='' required/></p>",
        button_label:"继续",
        on_finish: function addRespFromSurvey(data) {
            info["Name"] = data.response.Q0;
        }
    }; // 姓名
    let sex = {
        type: 'html-button-response',
        data: {
            varname: 'sex'
        },
        stimulus: "<p style = 'color : white'>你的性别</p>",
        choices: ['男', '女', '其他'],
        on_finish: function addRespFromSurvey(data) {
            info["Sex"] = data.button_pressed == 0 ? "Male" : (data.button_pressed == 1 ? "Female" : "Other")
        }
    }; // 性别
    let birth = {
        type: 'survey-html-form',
        data: {
            varname: 'birth'
        },
        preamble: "<p style = 'color : white'>你的出生年</p>",
        html: `
    <p><input name="Q0" type="number" placeholder="1900~2020" min=1900 max=2020
    oninput="if(value.length>4) value=value.slice(0,4)" required /></p>`,
        button_label: '继续',
        on_finish: function addRespFromSurvey(data) {
            info["BirthYear"] = data.response.Q0;
        }
    }; // 出生年份
    let edu = ["below primary school", "primary school", "junior middle school", "high school", 
    "university", "master", "doctor", "other"];
    let eduCN = ["小学一下", "小学", "初中", "高中", "大学", "硕士", "博士", "其他"];
    let education = {
        type: 'survey-html-form',
        data: {
            varname: 'education'
        },
        preamble: "<p style = 'color : white'>教育经历</p>",
        html: `
       <p><select name="Q0" size=10>
       <option value=1>小学以下</option>
       <option value=2>小学</option>
       <option value=3>初中</option>
       <option value=4>高中</option>
       <option value=5>大学</option>
       <option value=6>硕士</option>
       <option value=7>博士</option>
       <option value=8>其他</option>
       </select></p>`,
        button_label: '继续',
        on_finish: function addRespFromSurvey(data) {
            let bodyNode = document.getElementsByTagName("body");
            for (let i = 0; i < bodyNode.length; i++) {
                bodyNode[i].style.cursor = "none";
            }
            info["Education"] = data.response.Q0;
        }
    }; // 学历，8选1
    return {
        timeline: [experinumber, number_of_experiment, person_name, sex, birth, education]
    }
}