// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// const ipcRenderer = require('electron').ipcRenderer;
// const clipboard = require('electron').clipboard;
// // var layui = null
// window.clipboard = clipboard
// window.onload = function(){
//   window.changeColor()
// }
// process.once('loaded', () => { // expose to renderer process
 
//   ipcRenderer.on('color-messages', (event, arg) => {
//     console.log(arg)
//     console.log(document.getElementById("colorValue"))
//     changeColor(arg)
//     window.changeColor(arg)
//   });
// })

// window.changeColor = function(color) {
  
//   color = color || "#ccc"
//   if(layui){
//     layui.use('colorpicker', function(){
//       var colorpicker = layui.colorpicker;
//       //渲染
//       colorpicker.render({
//         elem: '#colorSle',
//         color: color, 
//         size: 'lg', 
//         alpha: true, //开启透明度
//         format: 'rgb',
//         change: function(res){
//           changeColor(res)
//         }
//        });
//     });
//   }
//   setTimeout(function(){
//     var layuiColorpicker = document.getElementsByClassName("layui-colorpicker")
//     if(layuiColorpicker && layuiColorpicker[0]){
//       layuiColorpicker[0].click()
//     }
//   }, 260)
// }

// function changeColor(color){
//   // debugger
//   if(!color){
//     return
//   }
//   var model = 1
//   if(color.indexOf("#") != -1){
//     model = 1
//   }else if(color.indexOf("rgba") != -1){
//     model = 4
//   }else{
//     model = 2
//   }
//   var resColor = parseColor(color, model)
//   document.getElementById("colorValue").innerHTML = resColor[0]
//   document.getElementById("colorValueRGBA").innerHTML = resColor[3]
//   document.getElementById("colorShow").style.backgroundColor = resColor[0]
// }


// /**
//  * 颜色转换
//  * @name parseColor
//  * @param con 要转换的值
//  * @param model 模式 1 => Hex;  2 => rgb; 3 => rgba(a为0-255); 4 => rgba(a为0-1)
//  * @return ['Hex', 'rgb', 'ARGB', 'rgba' ]
//  */
// function parseColor(con , model)
// {
//   con = con.replace(/rgba?\(/, '').replace(/\)/, '').replace("#", "")
//   var a  , r , g,  b ; 
//   // debugger
//   switch(model)
//   {
//     case 1:
//       r = parseInt(con.substring(0,2) , 16 );
//       g = parseInt(con.substring(2,4) , 16 );
//       b = parseInt(con.substring(4,6) , 16 );
//       a = 1;
//       break;
//     case 2:
//       var cons = con.split(',');
//       r = cons[0];
//       g = cons[1];
//       b = cons[2];
//       a = 1;
//       break;
//     case 3:
//       r = parseInt(con.substring(2,4) , 16 );
//       g = parseInt(con.substring(4,6) , 16 );
//       b = parseInt(con.substring(6,8) , 16 );
//       a =  (parseInt(con.substring(0,2) , 16 ) /255).toFixed(3) ;
//       break;
//     case 4:
//       cons = con.split(',');
//       r = cons[0];
//       g = cons[1];
//       b = cons[2];
//       a = parseFloat(cons[3]);
//       break;
//     default:
//       break;
//   }
//   var re = [];
  
//   var cr = parseInt(255*(1-a) + r*a );
//   var cg = parseInt(255*(1-a) + g*a );
//   var cb = parseInt(255*(1-a) + b*a );
  
//   var cr16 = setLengthTwo(cr.toString(16));
//   var cg16 = setLengthTwo (cg.toString(16) ); 
//   var cb16 =setLengthTwo( cb.toString(16));
//   re[0] = ("#" + cr16+cg16+cb16).toUpperCase();
//   re[1] = "rgb("+cr+","+cg+","+cb+")";
  
//   var aa = setLengthTwo (parseInt(a*255).toString(16) );
//   var ar = setLengthTwo( parseInt(r ).toString(16)  );
//   var ag = setLengthTwo( parseInt(g ).toString(16)  );
//   var ab = setLengthTwo( parseInt(b ).toString(16)  );
  
//   re[2] = ("#"+ aa + ar + ag + ab ).toUpperCase();
//   re[3] ="rgba(" +  r+","+g+","+b+"," +a + ")";
//   return re

// }
// function setLengthTwo(str)
// {
//   if(str.length == 1)
//     return "0"+str;
//   return str;
// }

