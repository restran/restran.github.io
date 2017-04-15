# restran 个人站点

使用 Hexo 搭建 

安装依赖

	npm install --no-optional

因为有个 bunyan 的依赖 使用了可选的依赖 dtrace-provider，但是 Mac 不支持，因此需要添加 --no-optional

调试预览

	hexo s --debug
	
发布方式

    hexo clean
    hexo deploy