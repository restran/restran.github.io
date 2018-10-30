var Color=function(r,g,b,a)
{this.r=r;this.g=g;this.b=b;this.a=a;}
Color.prototype.getRGBAStr=function()
{return'rgba('+this.r+','+this.g+','+this.b+','+this.a+')';}
var Sprite=function()
{this.bgc='rgb(255, 255, 255)';this.x=0;this.y=0;this.inv=25;this.color=new Color(0,0,0,1.0);this.speed={x:1,y:1};}
Sprite.prototype={draw:function()
{},erase:function()
{},move:function()
{this.x+=this.speed.x;this.y+=this.speed.y;if(this.childs!=null&&this.childs.length>0)
{for(var i=0;i<this.childs.length;i++)
{this.childs[i].speed=this.speed;this.childs[i].move();}}},fade:function(time,flag)
{var count=time/this.inv;var cps=1/count;count++;if(flag=='in')
{this.color.a=0.0;}
else
{this.color.a=1.0;cps*=-1;}
var int=setInterval((function(obj,cps){return function()
{if(count--<=0)
{obj.color.a=flag=='in'?1.0:0.0;obj.erase();obj.draw();clearInterval(int);}
else
{obj.color.a+=cps;obj.erase();obj.draw();}}})(this,cps),this.inv)},fadeMove:function(direction,speed,time,flag,useFrm)
{var xc,yc;var count=time/this.inv;switch(direction)
{case'u':xc=0;yc=speed*-1;break;case'd':xc=0;yc=speed;break;case'l':xc=speed*-1;yc=0;break;case'r':xc=speed;yc=0;break;}
var acps=this.color.a/count;count++;if(flag=='out')
{acps=-1*acps;}
if(useFrm==true)
{var int=setInterval((function(obj)
{return function()
{if(count--<=0)
{clearInterval(int);}
else
{obj.x+=xc;obj.y+=yc;obj.color.a+=acps;}}})(this),this.inv);}
else
{var int=setInterval((function(obj)
{return function()
{if(count--<=0)
{clearInterval(int);}
else
{obj.erase()
obj.x+=xc;obj.y+=yc;obj.color.a+=acps;obj.draw();}}})(this),this.inv);}},appendChild:function(sprite)
{if(this.childs==null)
this.childs=[];this.childs.push(sprite);},drawChild:function()
{if(this.childs!=null&&this.childs.length>0)
{for(var i=0;i<this.childs.length;i++)
{this.childs[i].draw();}}}}
var Frame=function(x,y,w,h)
{this.interval=null;this.sprites=[];this.x=x;this.y=y;this.w=w;this.h=h;}
Frame.prototype={begin:function(fps)
{this.interval=setInterval((function(param)
{return function(){param.render();}})(this),fps);},render:function()
{this.ctx.clearRect(this.x,this.y,this.w,this.h)
for(var i in this.sprites)
{if(typeof(this.sprites[i])=="function")
continue;this.sprites[i].draw();}},addSprite:function(name,sprite)
{this.sprites[name]=sprite;},stop:function()
{clearInterval(this.interval)},clear:function()
{for(var i in this.sprites)
{if(this.sprites[i].x>this.w&&this.sprites[i].y>this.h)
{delete this.sprites[i]}}}}
var Rect=function(ctx,x,y,w,h)
{this.ctx=ctx;this.x=x;this.y=y;this.w=w;this.h=h;}
Rect.prototype=new Sprite();Rect.prototype.draw=function()
{this.ctx.fillStyle=this.color.getRGBAStr();this.ctx.fillRect(this.x,this.y,this.w,this.h);}
Rect.prototype.erase=function()
{this.ctx.fillStyle=this.bgc;this.ctx.fillRect(this.x,this.y,this.w,this.h);}
Rect.prototype.fadeMoveLeft=function()
{var speed=1;var count=30;var acps=1.0/count;this.color.a=0.0;this.w=0;var int=setInterval((function(obj)
{return function()
{obj.ctx.fillStyle=obj.bgc;obj.ctx.fillRect(obj.x,obj.y,obj.w,obj.h);obj.x-=speed;if(--count<=0)
{clearInterval(int);}
else
{obj.w+=speed;}
obj.color.a+=acps;obj.ctx.fillStyle=obj.color.getRGBAStr();obj.ctx.fillRect(obj.x,obj.y,obj.w,obj.h);}})(this),this.inv);}
Rect.prototype.pressDown=function(time)
{this.ctx.fillStyle=this.bgc;this.ctx.fillRect(this.x,this.y,this.w,this.h);this.color.a-=0.3;this.ctx.fillStyle=this.color.getRGBAStr();this.ctx.fillRect(this.x+1,this.y,this.w-2,this.h-5);var int=setInterval((function(obj)
{return function()
{obj.ctx.fillStyle=obj.bgc;obj.ctx.fillRect(obj.x,obj.y,obj.w,obj.h);obj.color.a=1.0;obj.ctx.fillStyle=obj.color.getRGBAStr();obj.ctx.fillRect(obj.x,obj.y,obj.w,obj.h);clearInterval(int);}})(this),time);}
Rect.prototype.stretchMove=function(speed,distance,direction)
{var count=Math.ceil(distance/speed);var cy;if(direction=='up')
{cy=speed*-1;this.h+=count*speed;this.ctx.fillStyle=this.color.getRGBAStr();}
else
{this.y-=speed;cy=speed;this.h-=count*speed;this.ctx.fillStyle=this.bgc;}
var int=setInterval((function(obj)
{return function()
{if(count--==0)
{clearInterval(int);}
else
{obj.y+=cy;obj.ctx.fillRect(obj.x,obj.y,obj.w,speed);}}})(this),this.inv);}
var Word=function(ctx,x,y,c)
{this.ctx=ctx;this.x=x;this.y=y;this.fontSize=14;this.font='14px sans-serif'
this.c=c;this.flag=false;this.ready=false;}
Word.prototype=new Sprite();Word.prototype.erase=function()
{this.ctx.fillStyle=this.bgc;this.ctx.fillRect(this.x-5,this.y-5,this.fontSize*this.c.length+10,this.fontSize+10);}
Word.prototype.draw=function()
{this.ctx.fillStyle=this.color.getRGBAStr();this.ctx.font=this.font;this.ctx.textBaseline='top';this.ctx.fillText(this.c,this.x,this.y);this.drawChild();}
Word.prototype.fadeMoveUp=function(speed,time)
{var count=time/this.inv;var acps=1.0/count;this.color.a=0.0;var int=setInterval((function(obj)
{return function()
{if(count--<=0)
{obj.color.a=1.0;obj.ready=true;clearInterval(int);}
else
{obj.y+=speed*-1;obj.color.a+=acps;}}})(this),this.inv);}
Word.prototype.moveTo=function(dx,dy,speed)
{var c;if(this.flag==false&&this.ready==true)
{if(this.x==dx&&this.y==dy)
{this.flag=true;WORD_MOVE_COUNT--;}
else
{if(this.x!=dx)
{c=Math.floor(Math.random()*speed);c=Math.abs(this.x-dx)<c?Math.abs(this.x-dx):c;this.x+=this.x>dx?c*-1:c;}
if(this.y!=dy)
{c=Math.floor(Math.random()*speed);c=Math.abs(this.y-dy)<c?Math.abs(this.y-dy):c;this.y+=this.y>dy?c*-1:c;}}}}
var WORD_MOVE_COUNT=-1;var GRID_UNIT=14;var KEY_W=29;var KEY_H=50;var SCENE_BEGIN=false;function sceneMain(canvas,canvasW,canvasH)
{SCENE_BEGIN=true;var ctx=canvas.getContext('2d');var time=0;sceneOne(ctx,canvasW,canvasH);time+=4500;var rectArr=new Array(32);var int2=setInterval((function()
{clearInterval(int2);sceneTwo(ctx,rectArr,canvasW,canvasH);}),time);time+=5500;var frm=new Frame(0,0,canvasW,canvasH-KEY_H-GRID_UNIT);frm.ctx=ctx;var int3=setInterval((function()
{clearInterval(int3);sceneThree(ctx,rectArr,frm);}),time);var int4=setInterval(function()
{if(WORD_MOVE_COUNT==0)
{WORD_MOVE_COUNT=-1;frm.stop();clearInterval(int4);sceneFour(ctx,rectArr,canvasH);time=10000;var int5=setInterval((function()
{clearInterval(int5);sceneFive(ctx,rectArr,canvasW,canvasH);}),time);time+=15000;var int6=setInterval((function()
{clearInterval(int6);sceneSix(canvas,ctx,canvasW,canvasH);}),time);}},1500);}
function sceneOne(ctx,canvasW,canvasH)
{var rectArr=new Array(15);var u=10;var x=(canvasW-u*19)/2;var y=(canvasH-u*7)/2;rectArr[0]=new Rect(ctx,x,y,u*4,u);rectArr[1]=new Rect(ctx,x+u*3,y+u,u,u*2);rectArr[2]=new Rect(ctx,x,y+u*3,u*4,u);rectArr[3]=new Rect(ctx,x,y+u*4,u,u*2);rectArr[4]=new Rect(ctx,x,y+u*6,u*4,u);rectArr[5]=new Rect(ctx,x+u*6,y,u*4,u);rectArr[6]=new Rect(ctx,x+u*6,y+u,u,u*5);rectArr[7]=new Rect(ctx,x+u*9,y+u,u,u*5);rectArr[8]=new Rect(ctx,x+u*6,y+u*6,u*4,u);rectArr[9]=new Rect(ctx,x+u*12,y,u,u*7);rectArr[10]=new Rect(ctx,x+u*15,y,u*4,u);rectArr[11]=new Rect(ctx,x+u*18,y+u,u,u*2);rectArr[12]=new Rect(ctx,x+u*15,y+u*3,u*4,u);rectArr[13]=new Rect(ctx,x+u*15,y+u*4,u,u*2);rectArr[14]=new Rect(ctx,x+u*15,y+u*6,u*4,u);var time1=1500;var dir='urlrddrlurulrld';var frm=new Frame(0,0,canvasW,canvasH);for(i in rectArr)
{rectArr[i].color=new Color(244,35,39,1);rectArr[i].fade(time1,'in');}
var int2=setInterval(function()
{frm.ctx=ctx;frm.begin();clearInterval(int2);for(j in rectArr)
{rectArr[j].fadeMove(dir[j],1,time1,'out',true);frm.addSprite(j,rectArr[j++]);}},time1*1.5);var int3=setInterval(function()
{frm.stop();clearInterval(int3);},time1*2.8);}
function sceneTwo(ctx,rectArr,canvasW,canvasH)
{var u=GRID_UNIT;var w=KEY_W;var h=KEY_H;var x=canvasW+1;var y=canvasH-h-u;var i;for(i=31;i>=0;i--)
{rectArr[i]=new Rect(ctx,x,y,w,h);rectArr[i].color=new Color(254,8,0,0.8);x-=w+1;}
i=32;var int1=setInterval((function()
{if(--i<0)
{clearInterval(int1);}
else
{rectArr[i].fadeMoveLeft();}}),140);}
var poemStr='\
偶然\
徐志摩\
我是天空里的一片云\
偶尔投影在你的波心\
你不必讶异\
更无须欢喜\
在转瞬间消灭了踪影\
\
你我相逢在黑夜的海上\
你有你的\
我有我的\
方向\
你记得也好\
最好你忘掉\
在这交会时互放的光亮\
\
雨后\
席慕容\
\
生命\
其实也可以是一首诗\
静静盼望\
搜寻\
怀带着逐渐加深的幕色\
经过不可知的泥淖\
在暗黑的云层里\
终地流下了泪\
为所有错过或者并没有错过的相遇\
\
生命\
其实到最后总能成诗\
在滂沱的雨后\
我的心灵将更为洁净\
如果你肯等待\
所有漂浮不定的云彩\
到了最后，终于都会汇成河流\
'
var musicStr='\
LJ LI JIH HGFGHGHIJ\
LJ LP ONO HGFGHGHIH\
LMNONONMLML HIJKJKLHIJ\
LMNONONPOPOQL HIJKJKJIHGH\
LMNONOPONML HIJKJKLHHML\
LMNONOPOPQL HIJKJKLHHML\
LMNONOPOPQL HIJIJILHIJH\
LMNONOMNLKL\
JJJKLJEE IIIJKIEE\
HHHIJIGH GFGHG\
FEFML IKJIH\
HGFIIHFFGH\
\
'
var wordGrid=new Array([7,3],[14,3],[5,4],[6,4],[7,4],[8,4],[9,4],[11,4],[12,4],[13,4],[11,5],[5,6],[9,6],[11,6],[6,7],[8,7],[11,7],[12,7],[13,7],[14,7],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8],[11,8],[13,8],[7,9],[11,9],[13,9],[5,10],[6,10],[7,10],[8,10],[9,10],[11,10],[13,10],[7,11],[11,11],[13,11],[5,12],[7,12],[9,12],[11,12],[13,12],[4,13],[7,13],[10,13],[13,13],[6,14],[7,14],[9,14],[13,14],[21,3],[21,4],[21,5],[22,5],[23,5],[24,5],[25,5],[26,5],[27,5],[28,5],[29,5],[20,6],[25,6],[19,7],[25,7],[21,8],[22,8],[23,8],[24,8],[25,8],[26,8],[27,8],[28,8],[21,9],[25,9],[21,10],[25,10],[19,11],[20,11],[21,11],[22,11],[23,11],[24,11],[25,11],[26,11],[27,11],[28,11],[29,11],[25,12],[25,13],[25,14],[36,3],[40,3],[36,4],[40,4],[36,5],[38,5],[39,5],[40,5],[41,5],[42,5],[43,5],[34,6],[36,6],[37,6],[40,6],[43,6],[34,7],[36,7],[40,7],[43,7],[34,8],[36,8],[40,8],[43,8],[34,9],[36,9],[37,9],[38,9],[39,9],[40,9],[41,9],[42,9],[43,9],[44,9],[36,10],[40,10],[36,11],[39,11],[41,11],[36,12],[39,12],[41,12],[36,13],[38,13],[42,13],[36,14],[37,14],[43,14],[44,14],[55,3],[56,3],[57,3],[50,4],[51,4],[52,4],[53,4],[54,4],[50,5],[50,6],[54,6],[50,7],[54,7],[50,8],[51,8],[52,8],[53,8],[54,8],[55,8],[56,8],[57,8],[58,8],[54,9],[51,10],[54,10],[57,10],[51,11],[54,11],[58,11],[50,12],[54,12],[59,12],[49,13],[54,13],[59,13],[52,14],[53,14],[54,14]);function getIndex(c)
{var offset=3;if(c.charCodeAt()==32)
{return-1;}
else
{c=c.toUpperCase();return c.charCodeAt()-65+offset;}}
function sceneThree(ctx,rectArr,frm)
{var num=wordGrid.length;WORD_MOVE_COUNT=num;var wordDes=new Array(num);var flag=new Array(num);var i,j,ox,oy;for(i=0;i<num;i++)
{flag[i]=false;}
for(i=0;i<num;i++)
{j=Math.floor(Math.random()*num);if(flag[j]==true)
{while(flag[j]==true)
{j=(j+1)%num;}}
flag[j]=true;ox=wordGrid[j][0];oy=wordGrid[j][1];wordDes[i]={x:ox+ox*GRID_UNIT,y:oy+oy*GRID_UNIT};}
frm.begin();var int1=setInterval(function()
{for(i in frm.sprites)
{frm.sprites[i].moveTo(wordDes[i].x,wordDes[i].y,5);}},25);var k=0;var word;var time1=350;var m=0;var int2=setInterval(function()
{if(k<wordDes.length)
{j=getIndex(musicStr[m++]);if(j!=-1)
{rectArr[j].pressDown(time1);word=new Word(ctx,rectArr[j].x+8,rectArr[j].y-GRID_UNIT,poemStr[k]);word.color=new Color(255,0,0,1.0);word.fadeMoveUp(1,1500);frm.addSprite(k++,word);}}
else
{clearInterval(int2);}},time1*1.8);}
function sceneFour(ctx,rectArr,canvasH)
{var i=rectArr.length;var int1=setInterval((function()
{if(--i<0)
{clearInterval(int1);}
else
{rectArr[i].stretchMove(3,canvasH-KEY_H-GRID_UNIT,'up');}}),200);}
function sceneFive(ctx,rectArr,canvasW,canvasH)
{var i=rectArr.length/2;var time1=1000;var time2=200;var int1=setInterval((function()
{if(--i<0)
{clearInterval(int1);}
else
{rectArr[i].fade(time1,'out');rectArr[rectArr.length-i-1].fade(time1,'out');}}),time2);var fontSize=32;var str='让世界因你而不同';var wordStr=new Word(ctx,Math.round((canvasW-fontSize*str.length)/2),Math.round((canvasH-fontSize)/2),str);wordStr.font=fontSize+'px 楷体';wordStr.fontSize=fontSize;wordStr.color=new Color(223,12,8,1.0);var time3=time2*rectArr.length/2;var time4=2000;var int2=setInterval((function()
{wordStr.fade(time4,'in');clearInterval(int2);}),time3);time3+=time4*1.5;var int3=setInterval((function()
{wordStr.fade(time4*1.5,'out');clearInterval(int3);}),time3);var fontSize2=20;var str2='a production posted @ 2012-1-22 thank those who helped me to carry it out';var wordStr2=new Word(ctx,Math.round((canvasW-fontSize2*str2.length/2)/2),Math.round((canvasH-fontSize2)/2)+fontSize2*1.5,str2);wordStr2.font=fontSize2+'px arial';wordStr2.fontSize=fontSize2;wordStr2.color=new Color(110,119,120,1.0);time3+=time4*2.0;var int4=setInterval((function()
{wordStr2.fadeMove('u',1,time1,'in',false);clearInterval(int4);}),time3);time3+=time1*3;var int5=setInterval((function()
{wordStr2.fadeMove('u',1,time1,'out',false);clearInterval(int5);}),time3);}
function sceneSix(canvas,ctx,preW,preH)
{canvas.width=window.innerWidth-20;canvas.height=window.innerHeight-55;var waves=[new Color(038,089,254,0.0),new Color(048,100,254,0.0),new Color(068,160,254,0.0),new Color(180,200,254,0.0)]
var i=0;var inv=20;var int1=setInterval((function()
{ctx.clearRect(0,0,canvas.width,canvas.height);for(var j=waves.length-1;j>=0;j--)
{var offset=i+j*Math.PI*12;ctx.fillStyle=(waves[j].getRGBAStr());var randomLeft=Math.abs(Math.pow(Math.sin(offset/100),2))*200;var randomRight=Math.abs(Math.pow(Math.sin((offset/100)+10),2))*200;var randomLeftConstraint=Math.abs(Math.pow(Math.sin((offset/90)+2),2))*300;var randomRightConstraint=Math.abs(Math.pow(Math.sin((offset/90)+1),2))*300;ctx.beginPath();ctx.moveTo(0,randomLeft+10);ctx.bezierCurveTo(canvas.width/3,randomLeftConstraint,canvas.width/3*2,randomRightConstraint,canvas.width,randomRight+10);ctx.lineTo(canvas.width,canvas.height);ctx.lineTo(0,canvas.height);ctx.lineTo(0,randomLeft+10);ctx.closePath();ctx.fill();}
i++;}),inv);var time=2000;var count=time/inv;var da=0.3;var cps=da/count;count2=count;var int2=setInterval((function()
{if(count2-->0)
{for(var l in waves)
{waves[l].a+=l==0?cps*2:cps;}}
else
{clearInterval(int2);}}),inv);var int3=setInterval((function()
{clearInterval(int3);var int4=setInterval((function()
{if(count-->0)
{for(var m in waves)
{waves[m].a-=m==0?cps*2:cps;}}
else
{clearInterval(int1);clearInterval(int4);canvas.width=preW;canvas.height=preH;SCENE_BEGIN=false;}}),inv);}),time*2);}