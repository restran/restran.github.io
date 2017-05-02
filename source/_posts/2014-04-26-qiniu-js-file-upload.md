---
title: 七牛云存储的 Web 前端文件上传
layout: post
category: [技术]
tagline: 
keywords: 七牛,qiniu,前端,js,文件上传,web,uploader
tags: [前端]
---

七牛是不错的云存储产品，特别是有免费的配额可供使用，存点小文件或者博客的插图什么的还是不错的。以下介绍在自己的 Web 应用中上传文件到七牛的方法。

## 基本思想

当我们想把本地的文件通过浏览器上传到自己的七牛云存储空间上时，就有两种思路

>  1. 将文件直接上传到服务端，再由服务端将文件传输至七牛
>  2. 向服务端请求七牛的文件上传token，然后将文件上传至七牛（授权式上传）

第1种方法较好解决，参考[七牛的文档][1]即可，第2种方法效率较高，这里介绍第2种。使用Javascript在Web前端上传文件的方法，七牛官方给出了[文档][2]和[例子][3]。核心内容在于这几点：

> 1. 指定上传按钮的ID
> 2. 创建一个uploader
>       2.1 绑定上传按钮的ID
>       2.2 设置获取上传token的服务端url


```html
<div id="btn-uploader">
    <a id="pickfiles" href="javascript:void 0;">Upload File</a>
</div>
```

这里上传按钮的ID是pickfiles

```javascript
uploader = Qiniu.uploader({
    //...
});
```

## 设置uploader的参数

七牛的Javascript SDK使用到了[Plupload][4]，在初始化`uploader`时，可以为其传递Plupload中给定的[Option][5]，而不仅局限于七牛例子中给出的。例如可以添加`multi_selection`和`filters`来限制上传时，文件的选择。

## 文件命名

当文件上传至七牛云存储时，文件的命名显得尤为重要，缺省情况下，七牛会使用上传文件的名字命名，然而文件重名将难以避免，并且重名将导致无法上传或覆盖旧文件。为了解决这一问题，有三种方法

> 1. 由qiniu自动生成唯一的文件名，在`uploader`中设置`unique_names=true`
> 2. 由服务端生成文件名，在`uploader`中设置`save_key=true`，并且在服务端返回token时，设置`policy.saveKey`的值为所要保存的文件名。
> 3. Web 前端自定义文件名，`key`函数中设置文件名，缺点是文件名无法有效管理。

以下使用Python和Flask框架为例，介绍服务端生成文件名的方法。

```python
import json
import qiniu.rs

@app.route("/qiniu-token/")
def qiniu_token():
    policy = qiniu.rs.PutPolicy('your-bucket-name')
    policy.saveKey = 'save_key'#设置上传文件的文件名
    uptoken = policy.token()
    return json.dumps({'uptoken': uptoken})
```

服务端会返回如下格式的JSON，里面已包含了文件名

```javascript
{
    "uptoken": "0MLvWPnyya1WtPnXFy9KLyGHyFPNdZceomL..."
}
```

但是服务端仍无法获悉本地文件的文件类型，因此无法给出恰当的文件名，虽然设置文件名时缺失扩展名，不影响文件的下载，但明显不漂亮。

这时就需要先在本地先获取文件扩展名后，再向服务端请求，由服务端安排一个文件名（服务端掌握所有文件的信息，可以方便文件的命名和管理）。

在`uploader`的`init`参数中，有一个`key`参数，可以为其绑定函数来设置文件名。该函数启用的前提是`save_key`和`unique_names`设为`false`。

在`key`对应的函数中使用ajax向服务端请求文件名，然后与文件的扩展名组合后就得到了恰当的文件名了。特别注意的是，这里的ajax调用用使用同步的方式，因为需要在该函数返回前就得到服务端回应的信息，如果使用异步的方式，函数都返回了，服务端还没响应呢。

```javascript
uploader = Qiniu.uploader({
    //...
    init: {
        'Key': function(up, file) {
            //当save_key和unique_names设为false时，该方法将被调用
            var key = "";
            $.ajax({
                url: '/qiniu-token/get-key/',
                type: 'GET',
                async: false,//这里应设置为同步的方式
                success: function(data) {
                    var ext = Qiniu.getFileExtension(file.name);
                    key = data + '.' + ext;
                },
                cache: false
            });
            return key;
        }
        //...
    }
});
```

以下是uploader的详细设置，其他完整的信息请参考七牛的例子，并加以改造。

```javascript
uploader = Qiniu.uploader({
    runtimes: 'html5,flash,html4',
    browse_button: 'pickfiles',//上传按钮的ID
    container: 'btn-uploader',//上传按钮的上级元素ID
    drop_element: 'btn-uploader',
    max_file_size: '100mb',//最大文件限制
    flash_swf_url: '/static/js/plupload/Moxie.swf',
    dragdrop: false,
    chunk_size: '4mb',//分块大小
    uptoken_url: '/qiniu-token/',//设置请求qiniu-token的url
    //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
    // uptoken : '<Your upload token>',
    //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
    // unique_names: true,
    // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
    // save_key: true,
    // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
    domain: 'http://your-bucket-name.qiniudn.com/',//自己的七牛云存储空间域名
    multi_selection: false,//是否允许同时选择多文件
    //文件类型过滤，这里限制为图片类型
    filters: {
      mime_types : [
        {title : "Image files", extensions: "jpg,jpeg,gif,png"}
      ]
    },
    auto_start: true,
    init: {
        'FilesAdded': function(up, files) {
            //do something
        },
        'BeforeUpload': function(up, file) {
            //do something
        },
        'UploadProgress': function(up, file) {
            //可以在这里控制上传进度的显示
            //可参考七牛的例子
        },
        'UploadComplete': function() {
            //do something
        },
        'FileUploaded': function(up, file, info) {
           //每个文件上传成功后,处理相关的事情
           //其中 info 是文件上传成功后，服务端返回的json，形式如
           //{
           //  "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
           //  "key": "gogopher.jpg"
           //}
           var domain = up.getOption('domain');
           var res = eval('(' + info + ')');
           var sourceLink = domain + res.key;//获取上传文件的链接地址
           //do something
        },
        'Error': function(up, err, errTip) {
            alert(errTip);
        },
        'Key': function(up, file) {
            //当save_key和unique_names设为false时，该方法将被调用
            var key = "";
            $.ajax({
                url: '/qiniu-token/get-key/',
                type: 'GET',
                async: false,//这里应设置为同步的方式
                success: function(data) {
                    var ext = Qiniu.getFileExtension(file.name);
                    key = data + '.' + ext;
                },
                cache: false
            });
            return key;
        }
    }
});
```

  [1]: http://developer.qiniu.com/docs/v6/index.html
  [2]: https://developer.qiniu.com/kodo/sdk/1283/javascript
  [3]: https://github.com/qiniupd/qiniu-js-sdk
  [4]: http://www.plupload.com/
  [5]: http://www.plupload.com/docs/Options