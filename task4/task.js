/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
 function trim(str) {
     return str.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");
 }
 function ifHasNumber(str) {
     if (!trim(str)) {
         alert("城市输入为空，请输入一个城市！");
         return false;
     }
     var pos = trim(str).search(/\d/);
     if (pos >= 0) {
         alert("输入有误，请输入中文或者英文字母，不能包含数字！");
        return false;
     }
     return true;
 }
 function ifHasLetter(str) {
     if (!trim(str)) {
         alert("空气质量输入为空，请输入当前城市的天气质量！");
        return false;
     }
     var pos = trim(str).search(/\D/);
     if (pos >= 0) {
         alert("输入有误，请输入一个合法的正整数，不能包含中文、英文字母或者中间包含空格！");
         return false;
     }
     return true;
 }

 function clear() {
   var city = document.getElementById("aqi-city-input").value;
   var cityValue = document.getElementById("aqi-value-input").value;

     city = "";
     cityValue = "";
 }

function addAqiData() {
  var city = document.getElementById("aqi-city-input").value;
  var cityValue = document.getElementById("aqi-value-input").value;

  if (ifHasNumber(city)) {
      if (ifHasLetter(cityValue)) {
          aqiData[city] = cityValue;
      }
  } else {
      ifHasLetter(cityValue);
  }
}

/**
 * 渲染aqi-table表格
 */
var flag = true;
function renderAqiList() {
  var list = document.getElementById("aqi-table");
  var trList = list.getElementsByTagName("tr");

  for(var i = trList.length - 1; i >= 0; i--){
    trList[i].parentNode.removeChild(trList[i]);
    flag = true;
  }

  for(var data in aqiData){
    if(flag){
      var tr = document.createElement("tr");
      var th1 = document.createElement("th");
      var th2 = document.createElement("th");
      var th3 = document.createElement("th");

      var content1 = document.createTextNode("城市");
      var content2 = document.createTextNode("空气质量");
      var content3 = document.createTextNode("操作");

      th1.appendChild(content1);
      th2.appendChild(content2);
      th3.appendChild(content3);

      tr.appendChild(th1);
      tr.appendChild(th2);
      tr.appendChild(th3);

      tr.style.background = "#000";
      tr.style.color = "#fff";
      tr.style.fontSize = "20px";
      tr.style.lineHeight = "30px";

      list.appendChild(tr);
      flag = false;
    }
    var tr = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var button = document.createElement("button");

    td1.style.background = "#";
    td2.style.color = "green";
    button.style.cursor = "pointer";
    tr.style.background = "#000033";
    tr.style.color = "#ccc";
    tr.style.fontSize = "18px";
    tr.style.lineHeight = "22px";
    tr.style.textAlign = "center";

    var content1 = document.createTextNode(data);
    var content2 = document.createTextNode(aqiData[data]);
    var del = document.createTextNode("删除");

    td1.appendChild(content1);
    td2.appendChild(content2);
    button.appendChild(del);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(button);

    list.appendChild(tr);
  }

  list.style.width = "300px";
  list.style.background = "#ccc";
}


/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(e) {
  // do sth.
  e = e || window.event;
  src = e.target || e.srcElement;
  var tr = parents(src, 'tr');//这样拿到当前点击的元素的父亲(tr);
  var city = tr.firstChild.innerHTML;
  for(var data in aqiData){
    if(city == data){
      delete aqiData[data];
      delete data;
    }
  }
  renderAqiList();
}
function parents(el , parentName){
  var parent = el.parentNode;
  if(!parent)return null;//如果根本就没有父节点，那么返回null

  do{
    if(parent.tagName.toLowerCase() == parentName.toLowerCase()){
      //如果这个就是想要找的节点，就返回这个
      //在jq的校验里还可以校验class名称和其它的属性校验等
      //这个简化版就直接校验标签名称
      return parent;
    }
  }while(parent = parent.parentNode);//递归一直查找父亲的父亲。。

  return null;//如果没有找到，也返回null
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  document.getElementById("add-btn").onclick = function(){
    addBtnHandle();
    clear();
  };
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  var list = document.getElementById("aqi-table")
  EventUtil.addHandler(list, "click", delBtnHandle);
}
window.onload = function(){
  init();
}

var EventUtil = {
  addHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
  preventDefault: function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }
};
