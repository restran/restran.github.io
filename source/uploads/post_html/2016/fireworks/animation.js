var Color=function(r,g,b,a)
{this.r=r;this.g=g;this.b=b;this.a=a;}
Color.prototype.clone=function()
{return new Color(this.r,this.g,this.b,this.a);}
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
{obj.color.a=flag=='in'?1.0:0.0;clearInterval(int);}
else
{obj.color.a+=cps;}}})(this,cps),this.inv)},appendChild:function(sprite)
{if(this.childs==null)
this.childs=[];this.childs.push(sprite);},drawChild:function()
{if(this.childs!=null&&this.childs.length>0)
{for(var i=0;i<this.childs.length;i++)
{this.childs[i].draw();}}}}
var Frame=function(x,y,w,h)
{this.interval=null;this.inv=25;this.sprites=[];this.x=x;this.y=y;this.w=w;this.h=h;}
Frame.prototype={begin:function(fps)
{this.inv=fps;this.interval=setInterval((function(param)
{return function(){param.render();}})(this),fps);},render:function()
{this.ctx.clearRect(this.x,this.y,this.w,this.h)
for(var i in this.sprites)
{if(typeof(this.sprites[i])=="function")
continue;this.sprites[i].draw();}},addSprite:function(name,sprite)
{this.sprites[name]=sprite;},stop:function()
{clearInterval(this.interval)},clear:function()
{for(var i in this.sprites)
{if(this.sprites[i].x>this.w&&this.sprites[i].y>this.h)
{delete this.sprites[i]}}},clearAll:function()
{for(var i in this.sprites)
{delete this.sprites[i];}}}
var Word=function(ctx,x,y,c)
{this.ctx=ctx;this.x=x;this.y=y;this.fontSize=14;this.font='14px sans-serif'
this.c=c;this.flag=false;this.ready=false;}
Word.prototype=new Sprite();Word.prototype.draw=function()
{this.ctx.fillStyle=this.color.getRGBAStr();this.ctx.font=this.font;this.ctx.textBaseline='top';this.ctx.fillText(this.c,this.x,this.y);this.drawChild();}
var Particle=function(ctx,x,y,dec,g,vx,vy,eng,color)
{this.ctx=ctx;this.x=x;this.y=y;this.dec=dec;this.g=g;this.vx=vx;this.vy=vy;this.eng=eng;this.color=color;}
Particle.prototype=new Sprite();Particle.prototype.sizeOK=function()
{}
Particle.prototype.zoom=function(per)
{}
Particle.prototype.sizeRand=function(per)
{}
Particle.prototype.clone=function()
{return new Particle(this.ctx,this.x,this.y,this.dec,this.g,this.vx,this.vy,this.eng,this.color.clone());}
Particle.prototype.move=function()
{this.vx*=this.dec;this.vy*=this.dec;this.vy+=this.g;this.x+=this.vx;this.y+=this.vy;this.eng*=this.dec;}
Particle.prototype.fadeOut=function(count,inv)
{var cps=1.0/count;var int=setInterval((function(obj,cps){return function()
{if(count--<=0)
{obj.color.a=0.0;obj.dead=true;clearInterval(int);}
else
{obj.color.a-=cps;}}})(this,cps),inv);}
Particle.prototype.setMoveTo=function(dx,dy,tc)
{var d_=this.dec/(1-this.dec);var dn_=Math.pow(this.dec,tc-1);var temp1=(1-dn_*this.dec)*d_;this.vx=(dx-this.x)/temp1;var temp2=this.g*(d_*(tc-1-d_*(1-dn_))+tc);this.vy=((dy-this.y)-temp2)/temp1;this.eng=0.1/Math.pow(this.dec,tc);}
var RectPart=function(ctx,x,y,dec,g,vx,vy,eng,color,w,h)
{this.ctx=ctx;this.x=x;this.y=y;this.dec=dec;this.g=g;this.vx=vx;this.vy=vy;this.eng=eng;this.color=color;this.w=w;this.h=h;}
RectPart.prototype=new Particle();RectPart.prototype.sizeOK=function()
{return this.w>0&&this.h>0?true:false;}
RectPart.prototype.zoom=function(per)
{this.w*=per;this.h*=per;}
RectPart.prototype.clone=function()
{return new RectPart(this.ctx,this.x,this.y,this.dec,this.g,this.vx,this.vy,this.eng,this.color.clone(),this.w,this.h);}
RectPart.prototype.sizeRand=function(per)
{this.w*=(1-per)+Math.random()*(per*2);this.w=Math.floor(this.w);this.h*=(1-per)+Math.random()*(per*2);this.h=Math.floor(this.h);}
RectPart.prototype.draw=function()
{this.ctx.fillStyle=this.color.getRGBAStr();this.ctx.fillRect(this.x,this.y,this.w,this.h);}
var CirclePart=function(ctx,x,y,dec,g,vx,vy,eng,color,r)
{this.ctx=ctx;this.x=x;this.y=y;this.dec=dec;this.g=g;this.vx=vx;this.vy=vy;this.eng=eng;this.color=color;this.r=r;}
CirclePart.prototype=new Particle();CirclePart.prototype.draw=function()
{this.ctx.fillStyle=this.color.getRGBAStr();this.ctx.beginPath();this.ctx.arc(this.x,this.y,this.r,0,Math.PI*2);this.ctx.closePath();this.ctx.fill();}
CirclePart.prototype.zoom=function(per)
{this.r*=per;}
CirclePart.prototype.sizeOK=function()
{return this.r>0?true:false;}
CirclePart.prototype.clone=function()
{return new CirclePart(this.ctx,this.x,this.y,this.dec,this.g,this.vx,this.vy,this.eng,this.color.clone(),this.r);}
CirclePart.prototype.sizeRand=function(per)
{this.r*=(1-per)+Math.random()*(per*2);this.r=Math.floor(this.r);}
var Firework=function(ctx,color,srper)
{this.ctx=ctx;this.color=color;this.fw=null;this.ps=new Array();this.pse=null;this.hasExplode=false;this.srper=srper;}
Firework.prototype=new Sprite();Firework.prototype.rise=function(dy,tc,inv,pn,dat)
{this.fw.setMoveTo(this.fw.x,dy,tc);var count=tc;var int=setInterval((function(obj){return function()
{if(count--<=0)
{obj.explode(pn,dat,inv);clearInterval(int);}
else
{obj.fw.move();}}})(this),inv);}
Firework.prototype.explode=function(pn,dat,inv)
{this.ps=new Array(pn);this.hasExplode=true;var angle,v,vx,vy,x,y;var i,j,minEng,eng;minEng=0.5;this.pse.x=this.fw.x;this.pse.y=this.fw.y;for(i=0;i<pn;i++)
{this.ps[i]=this.pse.clone();this.ps[i].sizeRand(this.srper);}
for(i=0;i<dat.length;i++)
{this.ps[i].setMoveTo(dat[i][0],dat[i][1],dat[i][2]);if(this.ps[i].eng<minEng)
{minEng=this.ps[i].eng;}}
minEng-=0.2;for(i=dat.length;i<pn;i++)
{angle=Math.random()*Math.PI*2;v=1+Math.random()*15;vx=Math.cos(angle)*v;vy=Math.sin(angle)*v;this.ps[i].vx=vx;this.ps[i].vy=vy;eng=minEng*((1-0.3)+Math.random()*(0.3*2));this.ps[i].eng=eng;}
var int=setInterval((function(obj){return function()
{if(obj.ps.length==0)
{clearInterval(int);}
for(i in obj.ps)
{if(obj.ps[i].eng<=0.1)
{if(obj.ps[i].color.a<=0||!obj.ps[i].sizeOK)
{obj.ps.splice(i,1);}
else
{obj.ps[i].color.a-=0.05;obj.ps[i].zoom(0.9);obj.ps[i].move();}}
else
{obj.ps[i].move();}}}})(this),inv);}
Firework.prototype.draw=function()
{if(this.hasExplode==true)
{for(i in this.ps)
{if(this.ps[i].color.a>0&&this.ps[i].sizeOK)
{this.ps[i].draw();}}}
else
{this.fw.draw();}}
var SCENE_BEGIN=false;function sceneMain(canvas,canvasW,canvasH)
{SCENE_BEGIN=true;var ctx=canvas.getContext('2d');var frm=new Frame(0,0,canvasW,canvasH);frm.ctx=ctx;frm.begin(25);var time=0;time+=sceneOne(ctx,frm)+500;var count=12;var int2=setInterval((function()
{clearInterval(int2);frm.clearAll();sceneTwo(ctx,frm,count);}),time);time+=(count-1)*500+85*frm.inv+1500;var tcc=1;var int3=setInterval((function()
{clearInterval(int3);frm.clearAll();sceneThree(ctx,frm,canvasW);var int31=setInterval((function()
{if(tcc--<=0)
{clearInterval(int31);}
else
{frm.clearAll();sceneThree(ctx,frm,canvasW);}}),140*frm.inv);}),time);time+=(140*frm.inv)*(tcc+1);var int4=setInterval((function()
{clearInterval(int4);frm.clearAll();sceneFour(ctx,frm,canvasW);}),time);time+=200*frm.inv+1000;var int5=setInterval((function()
{clearInterval(int5);frm.clearAll();sceneFive(ctx,frm);}),time);}
var colorArr=new Array(new Color(229,82,28,1.0),new Color(245,160,27,1.0),new Color(112,171,98,1.0),new Color(37,141,205,1.0));function sceneOne(ctx,frm)
{var str1='那些看似细小、微不足道的东西，在特定的时机、特定的位置，';var str2='也可以构成特殊的意义。';var fontSize=22;var wordStr1=new Array(str1.length);var wordStr2=new Array(str2.length);var time1=1000;var time=0;var i,j;i=0;var count=0;var int=setInterval((function()
{if(i<str1.length)
{wordStr1[i]=new Word(ctx,50+fontSize*i,150,str1[i]);wordStr1[i].font=fontSize+'px 黑体';wordStr1[i].fontSize=fontSize;wordStr1[i].color=colorArr[3].clone()
time1=1000;wordStr1[i].fade(time1,'in');frm.addSprite(count++,wordStr1[i]);i++;}
else
{clearInterval(int);}}),150);j=0;time+=(str1.length-1)*150+(time1-150)+800;var int1=setInterval((function()
{clearInterval(int1);var int2=setInterval((function()
{if(j<str2.length)
{wordStr2[j]=new Word(ctx,50+fontSize*j,190,str2[j]);wordStr2[j].font=fontSize+'px 黑体';wordStr2[j].fontSize=fontSize;wordStr2[j].color=colorArr[3].clone()
wordStr2[j].fade(time1,'in');frm.addSprite(count++,wordStr2[j]);j++;}
else
{clearInterval(int2);}}),150);}),time);time+=(str2.length-1)*150+(time1-150)+1200;var int3=setInterval((function()
{clearInterval(int3);for(var j in frm.sprites)
{frm.sprites[j].fade(1000,'out');}}),time);time+=1200;return time;}
var cosDat=new Array([0,0],[0,6],[0,12],[0,18],[0,24],[0,30],[0,36],[6,36],[12,36],[18,36],[24,36],[50,0],[56,0],[44,6],[62,6],[40,12],[66,12],[40,18],[66,18],[40,24],[66,24],[44,30],[62,30],[50,36],[56,36],[82,0],[118,0],[85,6],[115,6],[88,12],[112,12],[91,18],[109,18],[94,24],[106,24],[97,30],[103,30],[100,36],[135,0],[141,0],[147,0],[153,0],[159,0],[135,6],[135,12],[135,18],[141,18],[147,18],[153,18],[159,18],[135,24],[135,30],[135,36],[141,36],[147,36],[153,36],[159,36]);var cosSmile=new Array([-15,-15],[15,-15],[-22,10],[22,10],[-19,14],[19,14],[-15,17],[15,17],[-10,19],[10,19],[-5,20],[5,20],[0,20]);function sceneTwo(ctx,frm,count)
{var i,x,dy,u,tc;var int=setInterval((function()
{if(count--<=0)
{clearInterval(int);return;}
x=100+Math.floor(Math.random()*700);dy=100+Math.floor(Math.random()*150);var dat=new Array();u=(4+Math.floor(Math.random()*3));tc=30+Math.floor(Math.random()*15);for(i=0;i<cosSmile.length;i++)
{dat[i]=new Array(3);dat[i][0]=x+cosSmile[i][0]*u;dat[i][1]=dy+cosSmile[i][1]*u;dat[i][2]=tc;}
var fw=new Firework(ctx,colorArr[Math.floor(Math.random()*colorArr.length)].clone(),0.2);fw.fw=new CirclePart(ctx,x,550,0.95,0.25,0,0,0,fw.color.clone(),10);fw.pse=new CirclePart(ctx,0,0,0.95,0.25,0,0,0,fw.color.clone(),5);fw.rise(dy,40,frm.inv,20,dat);frm.addSprite(count,fw);}),500);}
function sceneThree(ctx,frm,canvasW)
{var count=12;var countb=count;var u=4;var offsetX=Math.round((canvasW-164*u)/2);var offsetY=220;var time1=100;var num=cosDat.length;var i,j,jb;var flag=new Array(num);var flagCount=0;for(i=0;i<num;i++)
{flag[i]=false;}
var int=setInterval((function()
{if(count--<=0)
{clearInterval(int);return;}
var dat=new Array();for(i=0;i<8;i++)
{j=Math.floor(Math.random()*num);jb=j;if(flag[j]==true&&flagCount<num)
{do
{j=(j+1)%num;}
while(flag[j]==true&&j!=jb);}
flag[j]=true;flagCount++;dat[i]=new Array(3);dat[i][0]=offsetX+cosDat[j][0]*u;dat[i][1]=offsetY+cosDat[j][1]*u;dat[i][2]=84-(countb-count)*(time1/frm.inv);}
var fw=new Firework(ctx,colorArr[Math.floor(Math.random()*colorArr.length)].clone(),0.5);fw.fw=new CirclePart(ctx,100+Math.floor(Math.random()*700),550,0.95,0.25,0,0,0,fw.color.clone(),10);fw.pse=new CirclePart(ctx,0,0,0.95,0.25,0,0,0,fw.color.clone(),5);fw.rise(Math.floor(Math.random()*150),40,25,20,dat);frm.addSprite(count,fw);}),time1);}
function sceneFour(ctx,frm,canvasW)
{var u=4;var offsetX=Math.round((canvasW-164*u)/2);var offsetY=200;var num=cosDat.length;var i,j,k;var time1=500;var numArr=new Array(11,14,13,19);j=0;k=0;var int=setInterval((function()
{if(j>=numArr.length)
{clearInterval(int);return;}
var dat=new Array(numArr[j]);for(i=0;i<numArr[j];i++)
{dat[i]=new Array(3);dat[i][0]=offsetX+cosDat[k][0]*u;dat[i][1]=offsetY+cosDat[k][1]*u;dat[i][2]=180-j*(time1/frm.inv)-40;k++;}
var fw=new Firework(ctx,colorArr[j].clone(),0.2);fw.fw=new CirclePart(ctx,850,550,0.95,0.25,0,0,0,fw.color.clone(),10);fw.pse=new CirclePart(ctx,0,0,0.95,0.25,0,0,0,fw.color.clone(),5);fw.rise(80,40,25,25,dat);frm.addSprite(j,fw);j++;}),time1);}
function sceneFive(ctx,frm)
{var str1='因为，';var str2='。。。';var str3='是刻意的。';var fontSize=22;var wordStr1=new Array(str1.length);var wordStr2=new Array(str2.length);var wordStr3=new Array(str3.length);var time1=1500;var time=0;var i,j,k;i=0;var count=0;var offsetX=100;var int=setInterval((function()
{if(i<str1.length)
{offsetX+=fontSize;wordStr1[i]=new Word(ctx,offsetX,200,str1[i]);wordStr1[i].font=fontSize+'px 黑体';wordStr1[i].fontSize=fontSize;wordStr1[i].color=colorArr[0].clone()
wordStr1[i].fade(time1,'in');frm.addSprite(count++,wordStr1[i]);i++;}
else
{clearInterval(int);}}),200);j=0;time+=(str1.length-1)*200+(time1-200);var int1=setInterval((function()
{clearInterval(int1);var int2=setInterval((function()
{if(j<str2.length)
{offsetX+=fontSize;wordStr2[j]=new Word(ctx,offsetX,200,str2[j]);wordStr2[j].font=fontSize+'px 黑体';wordStr2[j].fontSize=fontSize;wordStr2[j].color=colorArr[0].clone()
wordStr2[j].fade(time1,'in');frm.addSprite(count++,wordStr2[j]);j++;}
else
{clearInterval(int2);}}),1500);}),time);time+=(str2.length-1)*1500+(time1-1500)+time1*2;k=0;var int3=setInterval((function()
{clearInterval(int3);var int4=setInterval((function()
{if(k<str3.length)
{offsetX+=fontSize;wordStr3[k]=new Word(ctx,offsetX,200,str3[k]);wordStr3[k].font=fontSize+'px 黑体';wordStr3[k].fontSize=fontSize;wordStr3[k].color=colorArr[0].clone()
wordStr3[k].fade(time1,'in');frm.addSprite(count++,wordStr3[k]);k++;}
else
{clearInterval(int4);}}),200);}),time);time+=(str3.length-1)*200+(time1-200)+time1;var int5=setInterval((function()
{clearInterval(int5);for(var m in frm.sprites)
{frm.sprites[m].fade(1000,'out');}}),time);time+=1200;var int6=setInterval((function()
{clearInterval(int6);frm.clearAll();frm.stop();SCENE_BEGIN=false;}),time);}