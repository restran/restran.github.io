/**
 * Created with JetBrains WebStorm.
 * User: Neil
 * DateTime: 13-2-3 下午9:58
 */

Starry = new (function () {
    var width,
        height,
        framePerSecond = 25, //每秒帧数
        p_num = 1500, //绕中心旋转的粒子个数
        p_static_num = 200, //静止的粒子个数
        orbit_range = 420, //最大轨道半径
        orbit_space_range = 60, //在离中心多少半径外才有粒子
        size_range = 2,
        frm_count = 0,
        //fadeFill = "rgba(22,22,22,.6)",
    //角速度系数，最后一个数字参数表示最外层粒子绕中心一圈需要花费的时间
        G = Math.PI * 2 * Math.pow(orbit_range, 1.5) / framePerSecond / 500,
    //中心粒子的实际坐标，用于调整坐标
    //计算时是以中心点为原点的坐标系
        centerPos = {
            x:0,
            y:0
        },
        canvas, ctx,
        p_static_list = [],
        p_list = [];

    this.init = function () {
        canvas = document.getElementById('canvas');
        if (canvas && canvas.getContext) {
            ctx = canvas.getContext('2d');
            window.addEventListener('resize', resizeCanvas, false);
            resizeCanvas();
            initParticles();
            setInterval(Render, 1E3 / framePerSecond);
        }
    };

    function resizeCanvas() {
        canvas.width = window.innerWidth - 5;
        canvas.height = window.innerHeight - 5;
        //重新计算中心粒子的位置
        centerPos.x = Math.round(canvas.width / 2);
        centerPos.y = Math.round(canvas.height / 2);
        var i, p;
        for (i = 0; i < p_static_list.length; i++) {
            p = p_static_list[i];
            p.pos.x *= canvas.width / width;
            p.pos.y *= canvas.height / height;
        }
        width = canvas.width;
        height = canvas.height;
    }

    function initParticles() {
        for (var i = 0; i < p_num; i++) {
            var size = Math.random() * size_range,
                pos = RandomPos(),
                angle = G * Math.pow(pos.x * pos.x + pos.y * pos.y, -0.75),
                color = GenColor(Math.sqrt(pos.x * pos.x + pos.y * pos.y)),
                p = new Particle(pos, angle, size, color);
            p_list.push(p);
        }

        for (i = 0; i < p_static_num; i++) {
            size = Math.random() * size_range;
            pos = {x:Math.random() * canvas.width, y:Math.random() * canvas.height};
            angle = G * Math.pow(pos.x * pos.x + pos.y * pos.y, -0.75);
            color = GenColor(Math.sqrt(pos.x * pos.x + pos.y * pos.y));
            p = new Particle(pos, 0, size, color);
            p_static_list.push(p);
        }
    }

    var Color = [
        { r:254, g:237, b:219, a:1 },
        { r:244, g:217, b:200, a:1 },
        { r:231, g:200, b:180, a:1 },
        { r:157, g:82, b:59, a:1 },
        { r:199, g:153, b:140, a:1 },
        { r:201, g:154, b:146, a:1 },
        { r:157, g:71, b:56, a:1 },
        { r:201, g:170, b:167, a:1 },
        { r:196, g:161, b:157, a:1 },
        { r:180, g:148, b:149, a:1 },
        { r:149, g:66, b:82, a:1 },
        { r:165, g:126, b:153, a:1 },
        { r:172, g:137, b:157, a:1 },
        { r:138, g:113, b:142, a:1 },
        { r:155, g:125, b:163, a:1 },
        { r:77, g:39, b:50, a:1 },
        { r:54, g:63, b:128, a:1 }
    ];

    function GenColor(d) {
        var i = Math.floor(d / orbit_range * Color.length);
        if (i >= Color.length) {
            i = Math.floor(Math.random() * Color.length);
        }
        var c = Color[i];
        var e = 0;//扰动因子
        //alert(c.r);
        c.r += Math.floor(Math.random() * e * 2 - e);
        c.g += Math.floor(Math.random() * e * 2 - e);
        c.b += Math.floor(Math.random() * e * 2 - e);
        return c;
    }


    function RandomPos() {
        var r = orbit_space_range + Math.random() * (orbit_range - orbit_space_range),
            angle = Math.random() * Math.PI * 2;
        return {
            x:Math.sin(angle) * r,
            y:Math.cos(angle) * r
        }
    }

    function Rotate(pos, alphaX, alphaY, alphaZ) {
        //Z Axis Rotation
        //在OXY平面上绕原点旋转
        var x1 = pos.x * Math.cos(alphaZ) - pos.y * Math.sin(alphaZ);
        var y1 = pos.x * Math.sin(alphaZ) + pos.y * Math.cos(alphaZ);
        var z1 = 0;

        //Y Axis Rotation
        //在OXZ平面上绕原点旋转
        var x2 = z1 * Math.sin(alphaY) + x1 * Math.cos(alphaY);
        //var y2 = y1;
        var z2 = z1 - x1 * Math.sin(alphaY);

        //X Axis Rotation
        //在OYZ平面上绕原点旋转
        return {
            x:x2,
            y:y1 * Math.cos(alphaX) - z2 * Math.sin(alphaX)
            //z:y2 * Math.sin(alphaX) + z2 * Math.cos(alphaX)
        };
    }

    function Gradual(pos, size, color_start, color_stop) {
        var fill = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size);
        fill.addColorStop(0, color_start);
        fill.addColorStop(1, color_stop);
        ctx.beginPath();
        ctx.fillStyle = fill;
        ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2, true);
        ctx.fill();
    }

    function Render() {
        frm_count++;
        //ctx.fillStyle = fadeFill;
        //ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //var fill;
        Gradual({x:centerPos.x * 0.5, y:centerPos.y * 0.5}, canvas.width / 2, 'rgba(0,0,10,1)', 'rgba(0,0,10,0)');
        Gradual({x:centerPos.x * 1.5, y:centerPos.y * 1.5}, canvas.width / 2, 'rgba(0,0,10,1)', 'rgba(0,0,10,0)');
        Gradual({x:centerPos.x, y:centerPos.y}, orbit_space_range, 'rgba(254,237,219,0.8)', 'rgba(254,237,219,0)');
        var i, p, pos;
        var size;
        for (i = 0; i < p_list.length; i++) {
            p = p_list[i];
            p.move();
            pos = Rotate(p.pos, 2 * Math.PI * 75 / 360, 2 * Math.PI * -10 / 360, 2 * Math.PI * -5 / 360);
            pos.x += centerPos.x;
            pos.y += centerPos.y;

            if (i % 3 == 0) {
                Gradual(pos, p.size * 30, p.getColorStr(0.1), p.getColorStr(0));
            } else {
                ctx.beginPath();
                ctx.fillStyle = p.getColorStr(1);
                //画圆形粒子，半径为p.size
                ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2, true);
                ctx.fill();
            }
        }

        for (i = 0; i < p_static_list.length; i++) {
            p = p_static_list[i];
            if (frm_count % (i + 1) == 0 && (frm_count % framePerSecond) > (framePerSecond / 3)) {
                size = p.size * (1.5 + Math.random() * 2);
            } else {
                size = p.size * 2.5;
            }
            Gradual(p.pos, size, p.getColorStr(0.9), p.getColorStr(0));
        }
    }
});
//------------------------------------------------------------
var Particle = function (pos, angle, size, color) {
    //坐标
    this.pos = {
        x:pos.x,
        y:pos.y
    };
    //与中心的距离
    this.r = Math.sqrt(this.pos.x * this.pos.x + this.pos.y + this.pos.y);
    //角速度
    this.angle = angle;
    this.size = size;
    this.color = {
        r:color.r,
        g:color.g,
        b:color.b,
        a:color.a
    };
};

Particle.prototype.getColorStr = function (a) {
    return 'rgba(' + this.color.r + ',' + this.color.g
        + ',' + this.color.b + ',' + a + ')';
}

//以角速度angle，绕中心旋转
Particle.prototype.move = function () {
    this.pos.x = Math.cos(this.angle) * this.pos.x - Math.sin(this.angle) * this.pos.y;
    this.pos.y = Math.cos(this.angle) * this.pos.y + Math.sin(this.angle) * this.pos.x;
}