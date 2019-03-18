// p77(59) break & continue
/*var num = 0;
outermost: // 标签
for(var i = 0; i < 10; i++){
    for(var j = 0;j < 10; j++){
        if(i == 5 && j == 5){
            break outermost;
        }
        num++;
    }
}
console.log(num); // 55

// p84(66) arguments
function doAdd(num1,num2){
    arguments[1] = 10;
    return(arguments[0] + num2);
}

doAdd(10,20);

function abc(a,b) {
    return a+b;
}
abc(10,20);

function displayInfo(args) {
    var output = '';
    if (typeof args.name == 'string') {
        output += 'Name: ' + args.name + '\n';
    }
    if (typeof agrs.age == 'number') {
        output += 'Age: ' + args.age + '\n';
    }
    alert(output);
}

displayInfo({
    name:'Nicholas',
    age:29
});

function ceyan() {
    alert('ceyan');
}
*/

/* p145(127) .replace()
var text = 'doge,cate,bate,sate,fate,oops,satemons';
var pattern = /(.at)e/g;
var replaces = text.replace(pattern, "word($1)");
var matches = text.match(pattern);
console.log(matches);
console.log(matches[2]);
console.log(pattern.lastIndex);
console.log(replaces);

function htmlEscape(text){
    return text.replace(/[<>"&]/g, function(match, pos, originalText){
        switch(match){
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case "\"": return '&quot;';
        }
    });
}

htmlEscape("<p class=\"greeting\">Hello world!</p>");
*/

/* p153(135) .max() .min()
var a = [1,2,3,4,5,6,7,8,9,24];
var max = Math.max.apply(null, a);
var min = Math.min.apply(Math, a);
console.log(max);
console.log(min); 
*/

/* p154(136) 接受两个参数min和max，求［min，max］之间的随机数
function selectFrom(min, max){
    var range = max - min + 1;
    return Math.floor(Math.random() * range + min);
}
*/

// 闭包
/* function createComparisonFunction(propertyName){
    return function(object1,object2){       //内部匿名函数
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        
        if(value1 < value2){
            return -1;
        }else if(value1 > value2){
            return 1;
        }else{
            return 0;
        }
    };
}

var compareNames = createComparisonFunction('name'); // 创建函数
var result = compareNames({name:'a'},{name:'b'}); // 调用函数
compareNames = null; // 解除引用，释放内存
*/

/*function createFunctions(){
    var result = new Array();
    for(var i = 0; i < 10; i++){
        result[i] = function(){
            return i;
        };
    }
    return result;
}

console.log(createFunctions());
*/

/* var name = "the window";
var object = {
    name:'my object',
    getNameFunc:function(){
        var that = this; 
        return function(){
            return that.name;
        };
    }
};

console.log(getNameFunc()());
*/

/* p296(278) 外部加载script文件
function loadScript(url){
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.body.appendChild(script);
}
*/

/* p298(280) 外部加载样式
function loadStyles(url){
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    var head = document.getElementsByTagName("head");
    head.appendChild(link);
}
*/

/*//p299(281) js创建表格
var table = document.createElement('table');
table.border = 1;
table.width = '100%';
document.body.appendChild(table);
var tbody = document.createElement('tbody');
table.appendChild(tbody);
var row1 = document.createElement('tr');
tbody.appendChild(row1);
var td1_1 = document.createElement('td');
var doc1_1 = document.createTextNode('Cell 1,1');
row1.appendChild(td1_1).appendChild(doc1_1);
var td1_2 = document.createElement('td');
var doc1_2 = document.createTextNode('Cell 1,2');
row1.appendChild(td1_2).appendChild(doc1_2);
*/

/*
//p372(354); p378(360) 跨浏览器－事件处理程序 & 事件对象
var EventUtil = {
    addHandler: function(element, event, handler){
        if(element.addEventListener){ //DOM 2
            element.addEventListener(event, handler, false);
        }else if(element.attachEvent){ //IE
            element.attachEvent("on" + event, handler);
        }else{                        //DOM 0
            element["on" + event] = handler;
        }
    },
    getEvent: function(event){
        return event ? event : window.event;
    },
    getTarget: function(event){
        return event.target || event.srcElement;
    },
    getRelatedTarget: function(event){
        if(event.relatedTarget){
            return event.relatedTarget;
        }else if(event.toElement){ //IE mouseover
            return event.toElement;
        }else if(event.fromElement){ //IE mouseout
            return event.fromElement;
        }else{
            return null;
        }
    },
    getButton: function(event){ //获取按钮点击信息
        if(document.implementation.hasFeature('MouseEvents', '2.0')){
            return event.button;
        }else{                    //IE
            switch (event.button) {
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                    break;
                case 2:
                case 6:
                    return 2;
                    break;
                case 4:
                    return 1;
                    break;
            }
        }
    },
    getWheelDelta: function(event){ //获取滚轮信息
        if(event.wheelDelta){
            return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta); //opera<9.5 : others
        }else{
            return -event.delta * 40; //firefox
        }
    },
    getCharCode: function(event){
        if(typeof event.charCode == 'number'){
            return event.charCode;
        }else{
            return event.keyCode; // <IE 8; opera
        }
    },
    getClipboardText: function(event){ //获取剪贴板内容
        var clipboardData = (event.clipboardData || window.clipboardData); //其他browser || IE
        return clipboardData.getData('text'); //'text'为数据类型
    },
    setClipboardText: function(){
        if(event.clipboardData){
            return event.clipboardData.setData('text/plain', value);
        }else if(window.clipboardData){
            return window.clipboardData.setData('text',value);
        }
    },
    preventDefault: function(event){ //取消默认动作
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue = false; //IE
        }
    },
    removeHandler: function(element, event, handler){
        if(element.removeEventListener){
            element.removeEventListener(event, handler, false);
        }else if(element.detachEvent){
            element.detachEvent("on" + event, handler);
        }else{
            element["on" + event] = null;
        }
    },
    stopPropagation: function(event){ //阻止冒泡
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }
    },
};
*/

/*//p381(363) load事件
EventUtil.addHandler(window, 'load', function(){ //在页面加载完成之后触发
    var bat = document.createElement('img');
    EventUtil.addHandler(bat, 'load', function(event){
        event = EventUtil.getEvent(event);
        alert(EventUtil.getTarget(event).src);
    })
    document.body.appendChild(bat);
    bat.src = 'B12.jpg';
});
*/

/*//scroll事件
EventUtil.addHandler(window, 'scroll', function(event){
    alert(document.documentElement.scrollTop);
})
*/

/*//坐标位置
EventUtil.addHandler(div, 'click', function(event){
    event = EventUtil.getEvent(event);
    alert('X: ' + event.pageX + ', Y: ' + event.pageY);
});
*/

/*//p406(388)自定义右鍵上下文菜单
EventUtil.addHandler(window, 'load', function(event){ //在页面加载完成之后触发
    var div = document.getElementById('mydiv');
    EventUtil.addHandler(div, 'contextmenu', function(event){
        event = EventUtil.getEvent(event);
        EventUtil.preventDefault(event);
        var menu = document.getElementById('menu');
        menu.style.left = event.clientX + 'px';
        menu.style.top = event.clientY + 'px';
        menu.style.visibility = 'visible';
    });
    EventUtil.addHandler(document, 'click', function(event){
        document.getElementById('menu').style.visibility = 'hidden';
    });
});
*/

/*//beforeunload 阻止页面卸载
EventUtil.addHandler(window, 'beforeunload', function(event){
    event = EventUtil.getEvent(event);
    var msg = 'bye';
    event.returnValue = msg; //IE；firefox
    return msg; //safari; chrome
});
*/

/*p437(419) 表单共用字段事件－检查表单内容并变色
EventUtil.addHandler(window, 'load', function(event){
    var txt = document.getElementById('txt');
    EventUtil.addHandler(txt, 'focus', function(event){
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        target.style.backgroundColor = 'yellow';
    });
    EventUtil.addHandler(txt, 'blur', function(event){
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        if(/[^\d]/.test(target.value)){
            target.style.backgroundColor = 'red';
        }else{
            target.style.backgroundColor = 'whitesmoke';
        }
    });
    EventUtil.addHandler(txt, 'change', function(event){
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        if(target.value !== /[^\d]/){
            target.style.backgroundColor = 'tomato';
        }
    });
});
*/

/*//p455(427)自动切换焦点
(function(){
    function tabForward(event){
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        if(target.value.length === target.maxLength){
            var form = target.form;
            for(var i = 0, len = form.elements.length; i < len; i++){
                if(form.elements[i] === target){
                    if(form.elements[i+1]){
                        form.elements[i+1].focus();
                    }
                    return; //for语句里最后返回
                }
            }
        }
    } 

    var tel1 = document.getElementById('tel1');
    var tel2 = document.getElementById('tel2');
    EventUtil.addHandler(tel1, 'keyup', tabForward);
    EventUtil.addHandler(tel2, 'keyup', tabForward);
})();
*/

/*//p454(436) 表单序列化
function serialize(form){
    var parts = [],
    i,
    len,
    field = null,
    j,
    opLen,
    option,
    opValue;
    for(i=0, len = form.elements.length; i < len; i++){
        field = form.elements[i];
        switch(field.type){
            case undefined:
            case 'file':
            case 'submit':
            case 'reset':
            case 'button':
                break;
            case 'select-one':
            case 'select-multiple':
                if(field.name){
                    for(j = 0, opLen = field.option.length; j < opLen; j++){
                        option = field.option[j];
                        opValue = (option.value ? option.value : option.text);
                        parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(opValue));
                    }
                }
                break;
            case 'radio':
            case 'checkbox':
                if(!field.checked){
                    break;
                }
            default:
                if(field.name){
                    parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value));
                }
        }
    }
    return parts.join('&');
}
*/

/*EventUtil.addHandler(window, 'load', function(evnt){
    var frame1 = document.getElementById('fuwenben');
    frame1.contentEditable = 'true';
});
*/

// p507(489) 插入多媒体
/*
var play = document.getElementById('play'),
video = document.getElementById('video'),
curtime = document.getElementById('curtime'),
duration = document.getElementById('duration');
EventUtil.addHandler(window, 'load', function(){
    duration.innerHTML = Math.round(video.duration);
    EventUtil.addHandler(play, 'click', function(){
        if(video.paused){
            video.play();
            play.value = 'Paused';
        }else{
            video.pause();
            play.value = 'Play';
        }
    });
    setInterval(function(){
        curtime.innerHTML = Math.round(video.currentTime);
    },500);
});
*/

//p587 JSON对象序列化
//JSON
var book = {
    "title": "PJ",
    "author": ["Nicholas"],
    "edtion": 3,
    year: 2011,
    toJSON: function(){
        return this.title;
    }
};

var jsonText = JSON.stringify(book);