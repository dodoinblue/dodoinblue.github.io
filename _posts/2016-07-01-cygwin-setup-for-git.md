---
layout: post
title: 安装cygwin下的git环境
date: 2016-07-01
---

> Get that Linux feeling - on Windows

Cygwin在Windows系统上提供了一套类Unix环境, 可以运行常见的Unix/Linux工具集. 安装Cygwin包括两个部分: 安装运行环境和工具包. 这两个步骤都包括在了安装向导里.

首先从cygwin的官网上下载cygwin的安装包. [Install Cygwin](https://cygwin.com/install.html "Install Cygwin").
根据需要选择32位或者64位安装包.

运行安装程序.
![][img-cygwin1]

选择从网络安装
![][img-cygwin2]

选择安装路径
![][img-cygwin3]

选择工具包的安装程序路径. 推荐放在安装路径下的pkg目录.
![][img-cygwin4]

选择一个镜像站下载工具包.
![][img-cygwin5]

连接到镜像站后, 会看到一个工具包的列表.
![][img-cygwin6]

可以通过上面的search文本框来找到我们需要的包.
要想运行git, 需要安装git, openssh, vim
![][img-cygwin7]

下一步, 安装向导从镜像站下载所需的应用包.
![][img-cygwin8]

安装完成后, 运行cygwin
![][img-cygwin9]

## 提示:
请把setep.exe也留在安装目录里一份。如果日后需要再添加或更新工具包/组件，可以重新执行setup.exe




[img-cygwin1]: http://7xpcsj.com1.z0.glb.clouddn.com/cygwin1.png
[img-cygwin2]: http://7xpcsj.com1.z0.glb.clouddn.com/cygwin2.png
[img-cygwin3]: http://7xpcsj.com1.z0.glb.clouddn.com/cygwin3.png
[img-cygwin4]: http://7xpcsj.com1.z0.glb.clouddn.com/cygwin4.png
[img-cygwin5]: http://7xpcsj.com1.z0.glb.clouddn.com/cygwin5.png
[img-cygwin6]: http://7xpcsj.com1.z0.glb.clouddn.com/cygwin6.png
[img-cygwin7]: http://7xpcsj.com1.z0.glb.clouddn.com/cygwin7.png
[img-cygwin8]: http://7xpcsj.com1.z0.glb.clouddn.com/cygwin8.png
[img-cygwin9]: http://7xpcsj.com1.z0.glb.clouddn.com/cygwin9.png