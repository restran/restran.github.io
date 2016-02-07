function sceneMain(a,b,c){SCENE_BEGIN=!0;var d=a.getContext("2d"),e=0;sceneOne(d,b,c),e+=4500;var f=new Array(32),g=setInterval(function(){clearInterval(g),sceneTwo(d,f,b,c)},e);e+=5500;var h=new Frame(0,0,b,c-KEY_H-GRID_UNIT);h.ctx=d;var i=setInterval(function(){clearInterval(i),sceneThree(d,f,h)},e),j=setInterval(function(){if(WORD_MOVE_COUNT==0){WORD_MOVE_COUNT=-1,h.stop(),clearInterval(j),sceneFour(d,f,c),e=1e4;var g=setInterval(function(){clearInterval(g),sceneFive(d,f,b,c)},e);e+=15e3;var i=setInterval(function(){clearInterval(i),sceneSix(a,d,b,c)},e)}},1500)}function sceneOne(a,b,c){var d=new Array(15),e=10,f=(b-e*19)/2,g=(c-e*7)/2;d[0]=new Rect(a,f,g,e*4,e),d[1]=new Rect(a,f+e*3,g+e,e,e*2),d[2]=new Rect(a,f,g+e*3,e*4,e),d[3]=new Rect(a,f,g+e*4,e,e*2),d[4]=new Rect(a,f,g+e*6,e*4,e),d[5]=new Rect(a,f+e*6,g,e*4,e),d[6]=new Rect(a,f+e*6,g+e,e,e*5),d[7]=new Rect(a,f+e*9,g+e,e,e*5),d[8]=new Rect(a,f+e*6,g+e*6,e*4,e),d[9]=new Rect(a,f+e*12,g,e,e*7),d[10]=new Rect(a,f+e*15,g,e*4,e),d[11]=new Rect(a,f+e*18,g+e,e,e*2),d[12]=new Rect(a,f+e*15,g+e*3,e*4,e),d[13]=new Rect(a,f+e*15,g+e*4,e,e*2),d[14]=new Rect(a,f+e*15,g+e*6,e*4,e);var h=1500,k="urlrddrlurulrld",l=new Frame(0,0,b,c);for(i in d)d[i].color=new Color(244,35,39,1),d[i].fade(h,"in");var m=setInterval(function(){l.ctx=a,l.begin(),clearInterval(m);for(j in d)d[j].fadeMove(k[j],1,h,"out",!0),l.addSprite(j,d[j++])},h*1.5),n=setInterval(function(){l.stop(),clearInterval(n)},h*2.8)}function sceneTwo(a,b,c,d){var e=GRID_UNIT,f=KEY_W,g=KEY_H,h=c+1,i=d-g-e,j;for(j=31;j>=0;j--)b[j]=new Rect(a,h,i,f,g),b[j].color=new Color(254,8,0,.8),h-=f+1;j=32;var k=setInterval(function(){--j<0?clearInterval(k):b[j].fadeMoveLeft()},140)}function getIndex(a){var b=3;return a.charCodeAt()==32?-1:(a=a.toUpperCase(),a.charCodeAt()-65+b)}function sceneThree(a,b,c){var d=wordGrid.length;WORD_MOVE_COUNT=d;var e=new Array(d),f=new Array(d),g,h,i,j;for(g=0;g<d;g++)f[g]=!1;for(g=0;g<d;g++){h=Math.floor(Math.random()*d);if(f[h]==1)while(f[h]==1)h=(h+1)%d;f[h]=!0,i=wordGrid[h][0],j=wordGrid[h][1],e[g]={x:i+i*GRID_UNIT,y:j+j*GRID_UNIT}}c.begin();var k=setInterval(function(){for(g in c.sprites)c.sprites[g].moveTo(e[g].x,e[g].y,5)},25),l=0,m,n=350,o=0,p=setInterval(function(){l<e.length?(h=getIndex(musicStr[o++]),h!=-1&&(b[h].pressDown(n),m=new Word(a,b[h].x+8,b[h].y-GRID_UNIT,poemStr[l]),m.color=new Color(255,0,0,1),m.fadeMoveUp(1,1500),c.addSprite(l++,m))):clearInterval(p)},n*1.8)}function sceneFour(a,b,c){var d=b.length,e=setInterval(function(){--d<0?clearInterval(e):b[d].stretchMove(3,c-KEY_H-GRID_UNIT,"up")},200)}function sceneFive(a,b,c,d){var e=b.length/2,f=1e3,g=200,h=setInterval(function(){--e<0?clearInterval(h):(b[e].fade(f,"out"),b[b.length-e-1].fade(f,"out"))},g),i=32,j="\u8ba9\u4e16\u754c\u56e0\u4f60\u800c\u4e0d\u540c",k=new Word(a,Math.round((c-i*j.length)/2),Math.round((d-i)/2),j);k.font=i+"px \u6977\u4f53",k.fontSize=i,k.color=new Color(223,12,8,1);var l=g*b.length/2,m=2e3,n=setInterval(function(){k.fade(m,"in"),clearInterval(n)},l);l+=m*1.5;var o=setInterval(function(){k.fade(m*1.5,"out"),clearInterval(o)},l),p=20,q="a production posted @ 2012-1-22 thank those who helped me to carry it out",r=new Word(a,Math.round((c-p*q.length/2)/2),Math.round((d-p)/2)+p*1.5,q);r.font=p+"px arial",r.fontSize=p,r.color=new Color(110,119,120,1),l+=m*2;var s=setInterval(function(){r.fadeMove("u",1,f,"in",!1),clearInterval(s)},l);l+=f*3;var t=setInterval(function(){r.fadeMove("u",1,f,"out",!1),clearInterval(t)},l)}function sceneSix(a,b,c,d){a.width=window.innerWidth-20,a.height=window.innerHeight-55;var e=[new Color(38,89,254,0),new Color(48,100,254,0),new Color(68,160,254,0),new Color(180,200,254,0)],f=0,g=20,h=setInterval(function(){b.clearRect(0,0,a.width,a.height);for(var c=e.length-1;c>=0;c--){var d=f+c*Math.PI*12;b.fillStyle=e[c].getRGBAStr();var g=Math.abs(Math.pow(Math.sin(d/100),2))*200,h=Math.abs(Math.pow(Math.sin(d/100+10),2))*200,i=Math.abs(Math.pow(Math.sin(d/90+2),2))*300,j=Math.abs(Math.pow(Math.sin(d/90+1),2))*300;b.beginPath(),b.moveTo(0,g+10),b.bezierCurveTo(a.width/3,i,a.width/3*2,j,a.width,h+10),b.lineTo(a.width,a.height),b.lineTo(0,a.height),b.lineTo(0,g+10),b.closePath(),b.fill()}f++},g),i=2e3,j=i/g,k=.3,l=k/j;count2=j;var m=setInterval(function(){if(count2-->0)for(var a in e)e[a].a+=a==0?l*2:l;else clearInterval(m)},g),n=setInterval(function(){clearInterval(n);var b=setInterval(function(){if(j-->0)for(var f in e)e[f].a-=f==0?l*2:l;else clearInterval(h),clearInterval(b),a.width=c,a.height=d,SCENE_BEGIN=!1},g)},i*2)}var Color=function(a,b,c,d){this.r=a,this.g=b,this.b=c,this.a=d};Color.prototype.getRGBAStr=function(){return"rgba("+this.r+","+this.g+","+this.b+","+this.a+")"};var Sprite=function(){this.bgc="rgb(255, 255, 255)",this.x=0,this.y=0,this.inv=25,this.color=new Color(0,0,0,1),this.speed={x:1,y:1}};Sprite.prototype={draw:function(){},erase:function(){},move:function(){this.x+=this.speed.x,this.y+=this.speed.y;if(this.childs!=null&&this.childs.length>0)for(var a=0;a<this.childs.length;a++)this.childs[a].speed=this.speed,this.childs[a].move()},fade:function(a,b){var c=a/this.inv,d=1/c;c++,b=="in"?this.color.a=0:(this.color.a=1,d*=-1);var e=setInterval(function(a,d){return function(){c--<=0?(a.color.a=b=="in"?1:0,a.erase(),a.draw(),clearInterval(e)):(a.color.a+=d,a.erase(),a.draw())}}(this,d),this.inv)},fadeMove:function(a,b,c,d,e){var f,g,h=c/this.inv;switch(a){case"u":f=0,g=b*-1;break;case"d":f=0,g=b;break;case"l":f=b*-1,g=0;break;case"r":f=b,g=0}var i=this.color.a/h;h++,d=="out"&&(i=-1*i);if(e==1)var j=setInterval(function(a){return function(){h--<=0?clearInterval(j):(a.x+=f,a.y+=g,a.color.a+=i)}}(this),this.inv);else var j=setInterval(function(a){return function(){h--<=0?clearInterval(j):(a.erase(),a.x+=f,a.y+=g,a.color.a+=i,a.draw())}}(this),this.inv)},appendChild:function(a){this.childs==null&&(this.childs=[]),this.childs.push(a)},drawChild:function(){if(this.childs!=null&&this.childs.length>0)for(var a=0;a<this.childs.length;a++)this.childs[a].draw()}};var Frame=function(a,b,c,d){this.interval=null,this.sprites=[],this.x=a,this.y=b,this.w=c,this.h=d};Frame.prototype={begin:function(a){this.interval=setInterval(function(a){return function(){a.render()}}(this),a)},render:function(){this.ctx.clearRect(this.x,this.y,this.w,this.h);for(var a in this.sprites){if(typeof this.sprites[a]=="function")continue;this.sprites[a].draw()}},addSprite:function(a,b){this.sprites[a]=b},stop:function(){clearInterval(this.interval)},clear:function(){for(var a in this.sprites)this.sprites[a].x>this.w&&this.sprites[a].y>this.h&&delete this.sprites[a]}};var Rect=function(a,b,c,d,e){this.ctx=a,this.x=b,this.y=c,this.w=d,this.h=e};Rect.prototype=new Sprite,Rect.prototype.draw=function(){this.ctx.fillStyle=this.color.getRGBAStr(),this.ctx.fillRect(this.x,this.y,this.w,this.h)},Rect.prototype.erase=function(){this.ctx.fillStyle=this.bgc,this.ctx.fillRect(this.x,this.y,this.w,this.h)},Rect.prototype.fadeMoveLeft=function(){var a=1,b=30,c=1/b;this.color.a=0,this.w=0;var d=setInterval(function(e){return function(){e.ctx.fillStyle=e.bgc,e.ctx.fillRect(e.x,e.y,e.w,e.h),e.x-=a,--b<=0?clearInterval(d):e.w+=a,e.color.a+=c,e.ctx.fillStyle=e.color.getRGBAStr(),e.ctx.fillRect(e.x,e.y,e.w,e.h)}}(this),this.inv)},Rect.prototype.pressDown=function(a){this.ctx.fillStyle=this.bgc,this.ctx.fillRect(this.x,this.y,this.w,this.h),this.color.a-=.3,this.ctx.fillStyle=this.color.getRGBAStr(),this.ctx.fillRect(this.x+1,this.y,this.w-2,this.h-5);var b=setInterval(function(a){return function(){a.ctx.fillStyle=a.bgc,a.ctx.fillRect(a.x,a.y,a.w,a.h),a.color.a=1,a.ctx.fillStyle=a.color.getRGBAStr(),a.ctx.fillRect(a.x,a.y,a.w,a.h),clearInterval(b)}}(this),a)},Rect.prototype.stretchMove=function(a,b,c){var d=Math.ceil(b/a),e;c=="up"?(e=a*-1,this.h+=d*a,this.ctx.fillStyle=this.color.getRGBAStr()):(this.y-=a,e=a,this.h-=d*a,this.ctx.fillStyle=this.bgc);var f=setInterval(function(b){return function(){d--==0?clearInterval(f):(b.y+=e,b.ctx.fillRect(b.x,b.y,b.w,a))}}(this),this.inv)};var Word=function(a,b,c,d){this.ctx=a,this.x=b,this.y=c,this.fontSize=14,this.font="14px sans-serif",this.c=d,this.flag=!1,this.ready=!1};Word.prototype=new Sprite,Word.prototype.erase=function(){this.ctx.fillStyle=this.bgc,this.ctx.fillRect(this.x-5,this.y-5,this.fontSize*this.c.length+10,this.fontSize+10)},Word.prototype.draw=function(){this.ctx.fillStyle=this.color.getRGBAStr(),this.ctx.font=this.font,this.ctx.textBaseline="top",this.ctx.fillText(this.c,this.x,this.y),this.drawChild()},Word.prototype.fadeMoveUp=function(a,b){var c=b/this.inv,d=1/c;this.color.a=0;var e=setInterval(function(b){return function(){c--<=0?(b.color.a=1,b.ready=!0,clearInterval(e)):(b.y+=a*-1,b.color.a+=d)}}(this),this.inv)},Word.prototype.moveTo=function(a,b,c){var d;this.flag==0&&this.ready==1&&(this.x==a&&this.y==b?(this.flag=!0,WORD_MOVE_COUNT--):(this.x!=a&&(d=Math.floor(Math.random()*c),d=Math.abs(this.x-a)<d?Math.abs(this.x-a):d,this.x+=this.x>a?d*-1:d),this.y!=b&&(d=Math.floor(Math.random()*c),d=Math.abs(this.y-b)<d?Math.abs(this.y-b):d,this.y+=this.y>b?d*-1:d)))};var WORD_MOVE_COUNT=-1,GRID_UNIT=14,KEY_W=29,KEY_H=50,SCENE_BEGIN=!1,poemStr="\u5076\u7136\u5f90\u5fd7\u6469\u6211\u662f\u5929\u7a7a\u91cc\u7684\u4e00\u7247\u4e91\u5076\u5c14\u6295\u5f71\u5728\u4f60\u7684\u6ce2\u5fc3\u4f60\u4e0d\u5fc5\u8bb6\u5f02\u66f4\u65e0\u987b\u6b22\u559c\u5728\u8f6c\u77ac\u95f4\u6d88\u706d\u4e86\u8e2a\u5f71\u4f60\u6211\u76f8\u9022\u5728\u9ed1\u591c\u7684\u6d77\u4e0a\u4f60\u6709\u4f60\u7684\u6211\u6709\u6211\u7684\u65b9\u5411\u4f60\u8bb0\u5f97\u4e5f\u597d\u6700\u597d\u4f60\u5fd8\u6389\u5728\u8fd9\u4ea4\u4f1a\u65f6\u4e92\u653e\u7684\u5149\u4eae\u96e8\u540e\u5e2d\u6155\u5bb9\u751f\u547d\u5176\u5b9e\u4e5f\u53ef\u4ee5\u662f\u4e00\u9996\u8bd7\u9759\u9759\u76fc\u671b\u641c\u5bfb\u6000\u5e26\u7740\u9010\u6e10\u52a0\u6df1\u7684\u5e55\u8272\u7ecf\u8fc7\u4e0d\u53ef\u77e5\u7684\u6ce5\u6dd6\u5728\u6697\u9ed1\u7684\u4e91\u5c42\u91cc\u7ec8\u5730\u6d41\u4e0b\u4e86\u6cea\u4e3a\u6240\u6709\u9519\u8fc7\u6216\u8005\u5e76\u6ca1\u6709\u9519\u8fc7\u7684\u76f8\u9047\u751f\u547d\u5176\u5b9e\u5230\u6700\u540e\u603b\u80fd\u6210\u8bd7\u5728\u6ec2\u6cb1\u7684\u96e8\u540e\u6211\u7684\u5fc3\u7075\u5c06\u66f4\u4e3a\u6d01\u51c0\u5982\u679c\u4f60\u80af\u7b49\u5f85\u6240\u6709\u6f02\u6d6e\u4e0d\u5b9a\u7684\u4e91\u5f69\u5230\u4e86\u6700\u540e\uff0c\u7ec8\u4e8e\u90fd\u4f1a\u6c47\u6210\u6cb3\u6d41",musicStr="LJ LI JIH HGFGHGHIJLJ LP ONO HGFGHGHIHLMNONONMLML HIJKJKLHIJLMNONONPOPOQL HIJKJKJIHGHLMNONOPONML HIJKJKLHHMLLMNONOPOPQL HIJKJKLHHMLLMNONOPOPQL HIJIJILHIJHLMNONOMNLKLJJJKLJEE IIIJKIEEHHHIJIGH GFGHGFEFML IKJIHHGFIIHFFGH",wordGrid=new Array([7,3],[14,3],[5,4],[6,4],[7,4],[8,4],[9,4],[11,4],[12,4],[13,4],[11,5],[5,6],[9,6],[11,6],[6,7],[8,7],[11,7],[12,7],[13,7],[14,7],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8],[11,8],[13,8],[7,9],[11,9],[13,9],[5,10],[6,10],[7,10],[8,10],[9,10],[11,10],[13,10],[7,11],[11,11],[13,11],[5,12],[7,12],[9,12],[11,12],[13,12],[4,13],[7,13],[10,13],[13,13],[6,14],[7,14],[9,14],[13,14],[21,3],[21,4],[21,5],[22,5],[23,5],[24,5],[25,5],[26,5],[27,5],[28,5],[29,5],[20,6],[25,6],[19,7],[25,7],[21,8],[22,8],[23,8],[24,8],[25,8],[26,8],[27,8],[28,8],[21,9],[25,9],[21,10],[25,10],[19,11],[20,11],[21,11],[22,11],[23,11],[24,11],[25,11],[26,11],[27,11],[28,11],[29,11],[25,12],[25,13],[25,14],[36,3],[40,3],[36,4],[40,4],[36,5],[38,5],[39,5],[40,5],[41,5],[42,5],[43,5],[34,6],[36,6],[37,6],[40,6],[43,6],[34,7],[36,7],[40,7],[43,7],[34,8],[36,8],[40,8],[43,8],[34,9],[36,9],[37,9],[38,9],[39,9],[40,9],[41,9],[42,9],[43,9],[44,9],[36,10],[40,10],[36,11],[39,11],[41,11],[36,12],[39,12],[41,12],[36,13],[38,13],[42,13],[36,14],[37,14],[43,14],[44,14],[55,3],[56,3],[57,3],[50,4],[51,4],[52,4],[53,4],[54,4],[50,5],[50,6],[54,6],[50,7],[54,7],[50,8],[51,8],[52,8],[53,8],[54,8],[55,8],[56,8],[57,8],[58,8],[54,9],[51,10],[54,10],[57,10],[51,11],[54,11],[58,11],[50,12],[54,12],[59,12],[49,13],[54,13],[59,13],[52,14],[53,14],[54,14])