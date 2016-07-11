---
layout: post
title: 配置git log graph高亮显示多分支commit树
date: 2016-07-09
---

使用git shell命令行可以很大的提高git的使用效率, 不过, 在命令行模式下看跨分支的commit关系不如gitk图形界面来的方便.
其实可以通过配置git log --graph命令, 让命令行下看commit树状结构和gitk一样清楚.

只需要在命令行下执行这样一样命令即可.

```bash
$ git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

这个命令等效于编辑全局.gitconfig文件:

```bash
[alias]
    lg = log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

```

配置之后, 执行下述命令, 即可显示单分支的git graph. (注意: $ 是提示符, 不需要输入)

```bash
$ git lg
```

如果需要看多分枝之间的关系, 需要加*--all*后缀

```bash
$ git lg --all
```


使用效果如下:
!['git bash']({{site.baseurl}}/content_image/git.101.slides/git_cli.png)