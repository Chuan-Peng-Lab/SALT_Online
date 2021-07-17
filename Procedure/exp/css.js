let a = document.createElement("style"); // 开头的css类
a.innerHTML = `
.header {
    text-align: center; 
    font-weight:700; 
    font-size:25px; 
    color : white;
}

.box {
    overflow-y: scroll;
    border: 1px solid white;
}

.footer {
    color : lightgreen; 
    font-size:25px;
    margin: 0 auto;
}

.key {}

.content { 
    font-size: 35px;
    margin: 0px;
    padding: 0px;
    height: 80px;
    text-align: left;
}

.content img {
    transform: scale(0.5, 0.5);
    width: 128px;
    height: 128px;
    vertical-align: middle;
}

.content .word { 

}

`;
document.head.appendChild(a);