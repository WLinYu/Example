var jiandao = document.getElementById("jiandao");
var shitou = document.getElementById("shitou");
var bu = document.getElementById("bu");

var flag = 0;
var text_flag = 0;

var user = document.getElementById("text-user");
var Computer = document.getElementById("text-computer");
var text_result = document.getElementById("result");

jiandao.onclick = function(){
  user.src = this.src;
  text_flag = 1;
  setComputer();
  result();
};
shitou.onclick = function(){
  user.src = this.src;
  text_flag = 2;
  setComputer();
  result();
};
bu.onclick = function(){
  user.src = this.src;
  text_flag = 3;
  setComputer();
  result();
};

//设置电脑随机出拳函数
function setComputer(){
  var r = Math.random();
  if(r < 0.33){
    Computer.src = jiandao.src;
    flag = 1;
  }else if( r < 0.66){
    Computer.src = shitou.src;
    flag = 2;
  }else{
    Computer.src = bu.src;
    flag = 3;
  }
};

//判断结果函数
function result(){
  switch(flag){
    case 1:
        if(text_flag === 1){
        text_result.innerHTML = "相等";
    }else if(text_flag === 2){
      text_result.innerHTML = "赢了";
    }else{
      text_result.innerHTML = "输了";
    }
      break;
  case 2:
       if(text_flag === 2){
        text_result.innerHTML = "相等";
    }else if(text_flag === 3){
      text_result.innerHTML = "赢了";
    }else{
      text_result.innerHTML = "输了";
    }
      break;
    default:
       if(text_flag === 3){
        text_result.innerHTML = "相等";
    }else if(text_flag === 1){
      text_result.innerHTML = "赢了";
    }else{
      text_result.innerHTML = "输了";
    }
      break;
  }
};
