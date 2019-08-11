const ipcRenderer = require('electron').ipcRenderer;
const clipboard = require('electron').clipboard;
const Datastore = require('nedb')
import { shell } from 'electron'
var db = new Datastore({ filename: 'path/to/datafile', autoload: true });
var changeClick = false
window.clipboard = clipboard
var options = null
window.creatColor = function(color) {
  // debugger
  color = color || "#ccc"
    layui.use('colorpicker', function(){
      var colorpicker = layui.colorpicker;
      //渲染
      colorpicker.render({
        elem: '#colorSle',
        color: color, 
        size: 'lg', 
        alpha: true, //开启透明度
        format: 'rgb',
        change: function(res){
          changeColor(res)
        }
       });
    });
  setTimeout(function(){
    var layuiColorpicker = document.getElementsByClassName("layui-colorpicker")
    if(layuiColorpicker && layuiColorpicker[0]){
      // layuiColorpicker[0].click()
    }
  }, 260)
}
  window.creatColor()
  db.find({Id:'userInfo'},function (err, docs) {
    console.log(docs)
    if(docs[0]){
      options = docs[0]
    }
  })
  ipcRenderer.on('color-messages', (event, arg) => {
    // debugger
    console.log(document.getElementById("colorValue"))
    changeColor(arg, true)
    window.creatColor(arg)
  });
  ipcRenderer.on('titleMax-reply', (event, arg) => {
    let icon = document.getElementById("titleMaxIcon") 
    // debugger
   if(arg == "1"){
      // 最大化
      document.getElementById("c").style.display = "block"
      document.getElementById("titleHeaderBox").style.background = "rgba(0,0,0,0)"
      icon.classList.remove("icon-zuidahua")
      icon.classList.add("icon-zuidahuafuben")
      document.getElementsByTagName("html")[0].click = function(){
        document.getElementsByName("cavas")[0].click()
      }
      document.getElementById("titleHeader").onclick = null
   }else if(arg == "0"){
      // 取消最大化
      document.getElementById("c").style.display = "none"
      icon.classList.remove("icon-zuidahuafuben")
      icon.classList.add("icon-zuidahua")
      document.getElementsByTagName("html")[0].click = null
      document.getElementById("titleHeader").onclick = setTitleColor
   }
  });

layui.use('form', function(){
  var form = layui.form;

})
var  layer
layui.use(['layer'], function(){
   layer = layui.layer //弹层
})
document.getElementById("copyHex").onclick = function(){
  // debugger
  var color = document.getElementById("colorValue").innerText
  window.clipboard.writeText(color);
  layer.msg('复制成功：'+color);
}
document.getElementById("copyRGBA").onclick = function(){
  var color = document.getElementById("colorValueRGBA").innerText
  window.clipboard.writeText(color);
  layer.msg('复制成功：'+color);
}
document.getElementById("github").onclick = function(){
  shell.openExternal('https://github.com/1693465722')
}
// 吸色器点击
document.getElementById("getColor").onclick = function(){
  ipcRenderer.send('getColor', '1');
}
// 最小化
document.getElementById("titleMin").onclick = function(){
  ipcRenderer.send('titleMin', '1');
}
// 最大化
document.getElementById("titleMax").onclick = function(){
  var isMax = ipcRenderer.send('titleMax', '1');
 
}
var body = document.getElementsByTagName("body")[0]
body.addEventListener('click', function(e){
  // debugger
})
// 关闭
document.getElementById("titleClose").onclick = function(){
  ipcRenderer.send('titleClose', '1');
}
// 点击生成标题栏颜色
document.getElementById("titleHeader").onclick = setTitleColor
function setTitleColor() {
  // if(changeClick || !options.titleColorChangeClick){
  //   return
  // }
  if(!options.titleColorChangeClick){
    return
  }
  changeClick = true
  var color = creatHexColor()
  document.getElementById("titleHeaderBox").style.backgroundColor = color
  changeColor(color)
  window.creatColor(color)
  // setTimeout(function(){
  //   changeClick = false
  // },500)
}
// 设置
document.getElementById("set").onclick = function(){
  layer.open({
    title:"设置",
    area: ['500px', '400px'],
    btn: ['保存'],
    shadeClose:true,
    scrollbar:false,
    btnAlign: 'c',
    type: 1, 
    skin: 'prop-class',
    yes:function(){
      document.getElementById("submit").click()
    },
    content: ` 
      <form class="layui-form" action="" id="form" lay-filter="form" >
      <div>系统</div>
      <hr class="layui-bg-green">
        <div class="layui-form-item">
          <label class="layui-form-label">取色快捷键</label>
          <div class="layui-input-block">
            <input type="text" name="getColor"   lay-verify="required" placeholder="请输入快捷键" autocomplete="off" class="layui-input" value="" >
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">复制选项</label>
          <div class="layui-input-block">
            <select name="copyOption">
              <option value="" ></option>
              <option value="0">取色后自动复制Hex</option>
              <option value="1">取色后自动复制RGBA</option>
            </select>
          </div>
        </div>
        <div>标题栏</div>
        <hr class="layui-bg-green">
        <div class="layui-form-item">
          <label class="layui-form-label">点击换颜色</label>
          <div class="layui-input-block">
            <input type="checkbox"  lay-skin="switch"  name="titleColorChangeClick">
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">颜色跟随变</label>
          <div class="layui-input-block">
            <input type="checkbox" name="ColorChangeAuto" lay-skin="switch" >
          </div>
        </div>
        <div class="layui-form-item" style="display:none">
          <div class="layui-input-block">
            <button class="layui-btn" lay-submit lay-filter="form" id="submit">立即提交</button>
            <button type="reset" class="layui-btn layui-btn-primary">重置</button>
          </div>
        </div>
      </form>`,
    success:function(){
      layui.use('form', function(){
        var form = layui.form;
        form.render();
        
        if(options){
          form.val("form", options)
          // setValueByIdSelector(options)
        }
        //监听提交
        form.on('submit(form)', function(data){
          console.log(data)
          db.find({Id:'userInfo'},function (err, docs) {
            if(docs[0]){
              console.log(docs);
              options = docs[0]
              if(data.field.ColorChangeAuto == "on"){
                data.field.ColorChangeAuto = true
              }else{
                data.field.ColorChangeAuto = false
              }
              if(data.field.titleColorChangeClick == "on"){
                data.field.titleColorChangeClick = true
              }else{
                data.field.titleColorChangeClick = false
              }
              if(!options.oldGetColor){
                options.oldGetColor = "alt+q"
              }
              if(data.field.getColor != options.oldGetColor){
                ipcRenderer.send('changeGetColor', options.oldGetColor, data.field.getColor );
              }
              data.field.oldGetColor = data.field.getColor
              data.field.Id = "userInfo"
              db.update({ Id: 'userInfo' }, data.field, {}, function () {
                options = data.field
              })
              layer.closeAll()
              layer.msg('保存成功');
            }
          })
          // db.find({}, function(err,e){console.log(e)})
          // db.find({ Id: 'userInfo' },function(err,e){
          //   console.log(e)
          // })
          return false;
        });
      })
    }

  });

}


function changeColor(color, main = false){
  // debugger
  if(!color){
    return
  }
  var model = 1
  if(color.indexOf("#") != -1){
    model = 1
  }else if(color.indexOf("rgba") != -1){
    model = 4
  }else{
    model = 2
  }
  if(options.ColorChangeAuto){
    document.getElementById("titleHeaderBox").style.backgroundColor = color
  }
  var resColor = parseColor(color, model)
  document.getElementById("colorValue").innerHTML = resColor[0]
  document.getElementById("colorValueRGBA").innerHTML = resColor[3]
  document.getElementById("colorShow").style.backgroundColor = resColor[0]
  document.getElementsByTagName("body")[0].style.backgroundColor = resColor[0]
  if(main){
    switch (options.copyOption){
      case "0":
        document.getElementById("copyHex").click()
        break;
      case "1":
          document.getElementById("copyRGBA").click()
        break
    }
  }

}
function creatHexColor(){

  var i = 0;
  var str = "#";
  var random = 0;
  var aryNum = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

  for(i = 0; i < 6; i++)
  {
    random = parseInt(Math.random() * 16);

    str += aryNum[random];
  }
  return str
}




/**
 * 颜色转换
 * @name parseColor
 * @param con 要转换的值
 * @param model 模式 1 => Hex;  2 => rgb; 3 => rgba(a为0-255); 4 => rgba(a为0-1)
 * @return ['Hex', 'rgb', 'ARGB', 'rgba' ]
 */
function parseColor(con , model)
{
  con = con.replace(/rgba?\(/, '').replace(/\)/, '').replace("#", "")
  var a  , r , g,  b ; 
  // debugger
  switch(model)
  {
    case 1:
      r = parseInt(con.substring(0,2) , 16 );
      g = parseInt(con.substring(2,4) , 16 );
      b = parseInt(con.substring(4,6) , 16 );
      a = 1;
      break;
    case 2:
      var cons = con.split(',');
      r = cons[0];
      g = cons[1];
      b = cons[2];
      a = 1;
      break;
    case 3:
      r = parseInt(con.substring(2,4) , 16 );
      g = parseInt(con.substring(4,6) , 16 );
      b = parseInt(con.substring(6,8) , 16 );
      a =  (parseInt(con.substring(0,2) , 16 ) /255).toFixed(3) ;
      break;
    case 4:
      cons = con.split(',');
      r = cons[0];
      g = cons[1];
      b = cons[2];
      a = parseFloat(cons[3]);
      break;
    default:
      break;
  }
  var re = [];
  
  var cr = parseInt(255*(1-a) + r*a );
  var cg = parseInt(255*(1-a) + g*a );
  var cb = parseInt(255*(1-a) + b*a );
  
  var cr16 = setLengthTwo(cr.toString(16));
  var cg16 = setLengthTwo (cg.toString(16) ); 
  var cb16 =setLengthTwo( cb.toString(16));
  re[0] = ("#" + cr16+cg16+cb16).toUpperCase();
  re[1] = "rgb("+cr+","+cg+","+cb+")";
  
  var aa = setLengthTwo (parseInt(a*255).toString(16) );
  var ar = setLengthTwo( parseInt(r ).toString(16)  );
  var ag = setLengthTwo( parseInt(g ).toString(16)  );
  var ab = setLengthTwo( parseInt(b ).toString(16)  );
  
  re[2] = ("#"+ aa + ar + ag + ab ).toUpperCase();
  re[3] ="rgba(" +  r+","+g+","+b+"," +a + ")";
  return re

}
function setLengthTwo(str)
{
  if(str.length == 1)
    return "0"+str;
  return str;
}





