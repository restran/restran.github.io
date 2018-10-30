function getUrlParam(name, default_value) {
    //构造一个含有目标参数的正则表达式对象
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    // decodeURI，处理中文问题
    var url = window.location.search.substr(1);
    console.log(url);
    try {
        url = decodeURI(url);
    } catch (e) {
    }
    var r = url.match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return default_value; //返回参数值
}

var text = getUrlParam('text', null);
if (text == null) {
    text = '生日快乐!';
}

document.getElementById('text').innerText = text;