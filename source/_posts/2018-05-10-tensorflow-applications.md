---
title: 深度学习和 TensorFlow 的有趣应用
layout: post
category: [TensorFlow]
tagline: 
show_reward: true
tags: [TensorFlow, AI]
---

TensorFlow 是 Google 开源的深度学习的软件库，可用于各种感知和语言理解任务的机器学习，可应用到客服、广告等领域。TensorFlow 一直以来的一个目标就是帮助尽量多的开发者把深度学习的技术利用起来，最终使得更多的用户从中受益。TensorFlow 支持多种软硬件环境，开发者可以在 Python、C++、Java、Go、C# 等很多开发环境中使用。Google 在 2017年推出了 TensorFlow Lite，它是专门针对移动和嵌入式应用场景打造的机器学习软件库，支持 iOS 和 Android。

![tensorflow.png](/uploads/post_img/2018/05/tensorflow.png "")

一些资料合集

- [awesome-tensorflow](https://github.com/jtoy/awesome-tensorflow)

## 图像和视频处理

### 照片艺术风格化

神经风格是将一张照片的风格迁移到另一张照片上的过程，同时保留相关的特张，通过这个项目，可以使用 TensorFlow 创建自己的 Prisma 应用程序。

![img-4.jpg](/uploads/post_img/2018/05/img-4.jpg "")

- [neural-style](https://github.com/anishathalye/neural-style)
- [color-independent-style-transfer](https://github.com/pavelgonchar/color-independent-style-transfer)，[中文介绍](https://zhuanlan.zhihu.com/p/21836208)

### 图像创作

素描图片自动上色

![img-5.jpg](/uploads/post_img/2018/05/img-5.jpg "")

二次元妹子头像生成

![img-7.jpg](/uploads/post_img/2018/05/img-7.jpg "")


- [素描图片自动上色](https://github.com/pfnet/PaintsChainer)，[在线演示地址](http://paintschainer.preferred.tech/)
- [使用神经匹配和融合生成相似图像](https://github.com/awentzonline/image-analogies)
- [灰度图上色](https://github.com/pavelgonchar/colornet)
- [二次元妹子头像生成](https://github.com/jayleicn/animeGAN)
- [autodraw](https://www.autodraw.com/)，手绘草图，搜索对应的简笔画
- [image2image](https://affinelayer.com/pixsrv/index.html)

### 图像分类/物体识别

识别上传地图片里边包含哪些物体，比如说我们在这个图片里边能够识别出这个是沙发、另外一个是人，等等这一系列的一些物体识别。以及在医学上的应用，如皮肤癌图像分类，通过手机拍照，做早期皮肤癌的检测，相关成果发表在 Nature 上。

![img-1.gif](/uploads/post_img/2018/05/img-1.gif "")

![img-2.jpg](/uploads/post_img/2018/05/img-2.jpg "")


- [tfClassifier](https://github.com/akshaypai/tfClassifier)
- [看花识名](http://www.infoq.com/cn/articles/application-of-tensorflow-in-intelligent-terminal)

### 背景虚化处理

Android 手机相机最近有个自拍功能可以通过应用深度视觉模型非常准确地分离出前景和背景，然后就可以分别处理。而传统的办法是在手机上装两个摄像头，相对而言，利用深度学习算法既降低了手机的造价，又可以让现有的手机增加功能。

### 图像描述

识别图片内容，并用文字描述图片中的内容。还有的是根据图片内容，自动写一个故事。

- [im2txt](https://github.com/iFighting/models/tree/master/im2txt)，图像描述
- [neural-storyteller](https://github.com/ryankiros/neural-storyteller)，根据图片内容自动写一个故事
- 微信小程序-智能识图

### 图片放大

将模糊图片放大成高清图片。

![img-3.jpg](/uploads/post_img/2018/05/img-3.jpg "")

- [bigjpg](https://bigjpg.com/)，这个项目是基于 [waifu2x](https://github.com/nagadomi/waifu2x) 和 [torch](https://github.com/torch/torch7)

### 人体行为识别

- [LSTM-Human-Activity-Recognition](https://github.com/guillaume-chevalier/LSTM-Human-Activity-Recognition/)

### 人脸识别

- [openface](https://github.com/cmusatyalab/openface)
- [insightface](https://github.com/deepinsight/insightface)

### 换脸

自动替换图片和视频中人物的脸为其他人。

![img-6.png](/uploads/post_img/2018/05/img-6.png "")

- [faceswap](https://github.com/deepfakes/faceswap)
- [exploring-deepfakes](https://hackernoon.com/exploring-deepfakes-20c9947c22d9)

### OCR

识别图片中的文字

- [TensorFlow与中文手写汉字识别](https://zhuanlan.zhihu.com/p/24698483)
- [自然场景中文文字检测和不定长中文OCR识别](https://zhuanlan.zhihu.com/p/33127851)

## 自然语言处理

可以用于智能问答、聊天机器人、智能客服、智能评卷、自动阅卷评分、句子分类和情绪分析等。

- [句子分类 cnn-text-classification-tf](https://github.com/dennybritz/cnn-text-classification-tf)
- [中文古诗自动作诗机器人](https://github.com/jinfagang/tensorflow_poems)

## 音频处理

- [语音合成](https://github.com/ibab/tensorflow-wavenet)
- [音乐创作](https://github.com/tensorflow/magenta)
- [Tacotron语音合成](https://github.com/keithito/tacotron)
- [语音转文字](https://github.com/mozilla/DeepSpeech)

## 训练机器玩游戏

- [TensorKart](https://github.com/kevinhughes27/TensorKart)
- [FlappyBird](https://github.com/yenchenlin/DeepLearningFlappyBird)
- [用深度神经网络和树搜索学习围棋](https://github.com/Rochester-NRT/RocAlphaGo)

## 推荐系统

推荐系统在很多地方都会用，在推荐领域，已经有很多存在的并且被广泛应用的方法，比如协同过滤。现在可以使用深度神经网络让推荐的效果变得更好。

- [TF-recomm](https://github.com/songgc/TF-recomm)
- [深度学习在推荐系统中的一些应用](https://zhuanlan.zhihu.com/p/22597010)
- [使用深度学习Keras和TensorFlow打造一款音乐推荐系统](https://yq.aliyun.com/articles/154475)
- [深度学习在美团点评推荐平台排序中的运用](https://tech.meituan.com/dl.html)

## 其他

- [树莓派搭建的自动驾驶玩具车](https://github.com/RyanZotti/Self-Driving-Car)

![self-driving-car.jpg](/uploads/post_img/2018/05/self-driving-car-toy.jpg "")

## 参考文献

- https://www.leiphone.com/news/201704/82OUlsEhA3K3di8Y.html
