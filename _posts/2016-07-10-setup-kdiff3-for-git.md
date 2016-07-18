---
layout: post
title: 为git配置冲突解决工具kdiff3
date: 2016-07-10
---

# cygwin环境

首先确保cygwin的git环境已经安好， 详见<a href="{% post_url 2016-07-01-cygwin-setup-for-git %}">安装cygwin下的git环境</a>

* 首先下载安装kdiff3. <a href="https://sourceforge.net/projects/kdiff3/">下载kdiff3</a>
  ** 建议把kdiff3安装在一个不带空格的路径里。比如c:\kdiff3 ** 

* 接下来是配置gitconfig，让它在解决冲突的时候能找到并启动kdiff3. 假设kdiff3被安装在了c:\kdiff3目录

```shell
$ git config --global merge.tool kdiff3
$ git config --global mergetool.kdiff3.path /cygdrive/c/kdiff3/kdiff3.exe
```

  * 注意这里的路径，是把windows的路径翻译成了cygwin能理解的路径。 Windows的c盘对应着/cygdrive/c这个目录。原来c盘下的kdiff3目录就是/cygdrive/c/kdiff3。以此类推。 
  * 注意空格等特殊字符要用\符号转译。

* 到此配置结束。下次遇到冲突， git会尝试使用kdiff3解决。

另外， 也可以将kdiff3目录加入到环境变量里， 这样做有两个好处。 一是不用配置gitconfig里面的path， 因为系统知道如何找到kdiff3了。 二是在命令行可以直接执行kdiff3命令唤起工具， 而不用被动的等到解决冲突的时候才用这个工具。

配置完成后， 使用如下图：
!['git bash']({{site.baseurl}}/content_image/setup-kdiff3/git-mergetool-cmd.png)

当遇到冲突时， 输入git mergetool命令, kdiff3会自动启动。
!['git bash']({{site.baseurl}}/content_image/git.101.slides/kdiff3_workspace.png)


