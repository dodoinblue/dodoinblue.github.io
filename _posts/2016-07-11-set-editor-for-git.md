---
layout: post
title: 为git配置Commit Message的编辑器
date: 2016-07-11
---

一些同学不熟悉VIM 或者 Nano编辑器的常用命令, 因此也对使用git造成一些困难. 鉴于这类用户大多使用windows环境, 这里以cygwin为例介绍一下配置方法.

* 首先要安装好cygwin, 以及cygwin下的git包. 具体方法见: <a href="{% post_url 2016-07-01-cygwin-setup-for-git %}">安装cygwin下的git环境</a>

* 安装喜欢的编辑器. 这里以notepad++ 为例. <a href="https://notepad-plus-plus.org/download/v6.9.2.html">下载notepad++.</a>

* 按照向导安装好notepad++. 比如安装路径在c:\notepad++

* 把notepad++添加到环境变量里. 注意: 如果路径里有空格的话, 需要用""把路径包裹起来.

!['git bash']({{site.baseurl}}/content_image/set-editor-for-git/set_notepadplus_path.png)

* 运行cygwin shell. 如果已经运行着cygwin shell, 请关闭窗口重新运行, 以便新的环境变量可以生效.

* 现在, 在命令行输入如下命令, 可以呼出notepad++的GUI窗口

```bash
$ notepad++
```

* 如果一切正常, 说明notepad++的环境已经设置好. 可以把git的编辑器设置成notepad++了. 执行下述命令:

```
$ git config --global core.editor 'notepad++ "$(cygpath -m "$1")" #'
```

执行成功后, 可以在看全局的.gitconfig看到下述内容:

```
[core]
    editor = "notepad++ \"$(cygpath -m \"$1\")\" #"
```

* 现在可以执行下述命令测试一下是否呼出了notepad++做为编辑器.

```
$ git commit --amend
```

!['git bash']({{site.baseurl}}/content_image/set-editor-for-git/notepadplus_commit_message.png)
