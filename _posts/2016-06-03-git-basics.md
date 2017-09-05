---
title: git基础
date: 2016-06-03 15:27:31
---
## Why git?
分布式的版本管理系统。由Linus Torvalds开发。

## 客户端环境

### Windows

* cygwin

![][img-cygwin9]

* Source Tree等图形界面

*推荐用cygwin。接下来的内容、实例代码，适用于cygwin*

提示：

* 安装cygwin时需要选择安装哪些组件。请务必选择git，vim，和openssh。
* 安装cygwin后，请保留一份安装文件在cygwin的目录里。比如cygwin安装到了c:\cygiwn64，那么请把setep.exe也留在这个目录里一份。如果日后需要再添加组件，可以重新执行setup.exe
* 组件的安装位置可以考虑放在cygwin目录下的pkg目录。比如cygwin安装到c:\cygwin64，那么组件目录放在c:\cygiwn64\pkg下面，方便统一管理。

![][img-cygwin7]


## Ubuntu

* Terminal:

![][img-ubuntu-terminal]

```shell
sudo apt-get install git
```

## Mac
* Terminal

![][img-mac-terminal]

```shell
xcode-select --install
```

* Source Tree

## 服务端环境
1. github.com/bitbucket.org/coding.net/gitcafe
2. 自建服务器，比如git, gitlab，phabricator, gerrit。


## 用git工作

### 常用命令

```shell
git clone
git log
git status
git add
git commit
git branch
git checkout
git push
git reset
```

git命令的信息输出非常友好，注意阅读每个命令返回的提示，通常可以看到接下来需要执行的操作，或者解决错误的方法。
每个git命令都有丰富的文档，具体可以查看git的man page。git的子命令也有单独的man page。

```shell
$ git --help #查看git的命令列表
$ man git #查看man page，详细帮助
$ git merge --help #查看git merge的详细帮助
$ man git-merge #效果等同于git merge --help
```

### 获取代码

```shell
$ git clone https://github.com/dodoinblue/learngit.git
```

### 设置用户信息

```shell
$ git config --global user.name "Your Name"
$ git config --global user.email "email@example.com"
#全局配置文件保存在$HOME/.gitconfig文件中
#试试打印出这个文件的内容看看cat $HOME/.gitconfig
```

### 从git服务器上复制版本库
打开命令行窗口，Linux/Mac下用Terminal，Windows下用Cygwin

```shell
$ git clone https://github.com/dodoinblue/learngit.git
#会被提示需要用户名和密码
#输入githab的登陆用户名和登陆密码
```
命令执行成功后，可以在当前目录下找到一个叫learngit的文件夹。
进入文件夹可以看到文件夹的内容

```shell
$ cd learngit
$ ls
#应该能看到README.md
```

通过使用ssh key可以不用每次同步代码时输入用户名和密码。具体方法参考这里的ssh keys部分：

> https://help.github.com/articles/generating-ssh-keys/

然后将公钥添加到这里:
> https://github.com/settings/ssh

### 查看版本库状态

```shell
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
nothing to commit, working directory clean
```

其中

>On branch master

指出了当前分支。

>Your branch is up-to-date with 'origin/master'.

说明了本地版本库和远端版本库之间的同步情况。

>nothing to commit, working directory clean

说明了当前本地版本库有没有改动。

随便在版本库里做一些修改，比如修改README.md这个文件

```shell
$ echo "add another line" >> README.md
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

 modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")
```

下面再创建一个新文件，然后看看版本库的状态

```shell
$ echo "add new file" >> NewFile
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

 modified:   README.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)

 NewFile

no changes added to commit (use "git add" and/or "git commit -a")
```

## 把改动保存到本地版本库
用git add命令把文件改动声明为要提交(commit)，然后用git commit命令把提交(commit)保存在本地。

注意看git status里面的输出内容。
> (use "git add <file>..." to update what will be committed)

可以照着做试试，然后用git status查看状态

```shell
$ git add README.md
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

 modified:   README.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)

 NewFile
```

注意输出内容的变化:
> Changes to be committed:
> modified: README.md

这两行是说，README.md已经被声明为要提交了。

接下来，再把NewFile也声明为要提交，看看版本库状态有什么变化

```shell
$ git add NewFile

$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

 new file:   NewFile
 modified:   README.md
```

文件已经被声明为要提交了，那么现在要把提交保存在本地。这里要用到git commit命令。

```shell
$ git commit -m "My very first git commit"
```

*-m*的意思是添加一个commit message。如果不加-m，命令行会跳转到编辑器，可以输入更多信息。用命令 *git commit --help* 可以查看更多帮助。
再次用*git status*查看版本库状态，得到干净的版本库：
$ git status

```shell
On branch master
Your branch is ahead of 'origin/master' by 1 commit.
  (use "git push" to publish your local commits)
nothing to commit, working directory clean
```

## 查看提交历史
使用git log可以产看提交历史。

```shell
$ git log
commit a9f137adab0e8855b39caa47b9513724341878ed
Author: Charles Liu <dodoinblue@gmail.com>
Date:   Fri Nov 20 18:51:50 2015 +0800

    My very first git commit

commit 09a87524de2e8246ad03a2f5a95f82a7ee212bbc
Author: Charles Liu <dodoinblue@gmail.com>
Date:   Tue Nov 10 14:25:00 2015 +0800

    initial commit
```

其中，
>commit 09a87524de2e8246ad03a2f5a95f82a7ee212bbc

是commit的SHA1值，是每个commit的唯一标示。

>Author: Charles Liu <dodoinblue@gmail.com>

是commit的作者，是由前面*git config xxx*设置的。
Date是commit的日期，容易理解。

>initial commit

最后是commit的标题。commit的标题和正文，是通过空行分开的。为了让git log的输出简明，请保持commit标题小于65个英文字符，并且和正文件空行。

git log的输出内容是可以配置的。比如加--oneline参数得到的结果是这样的

```shell
$ git log --oneline
a9f137a My very first git commit
09a8752 initial commit
```

## git reset
在继续下面的例子之前，需要清理一下版本库。我希望把版本库恢复到刚下载的状态。
刚下载时，版本库只有一个点。

> 09a8752 initial commit

可以执行下面的命令，丢弃所有"09a8752"之后的改动，把master分支恢复到09a8752上面去。

```shell
$ git reset --hard 09a8752
```

*--hard*的意思是丢弃所有改动。现在执行以下*git log --oneline*看一下。

## 创建新分支
首先，使用*git branch*来查看分支情况。

```shell
$ git branch
* master
```

下面用*git branch -b branch-name*来创建新分支。

```shell
$ git branch -b branchA
$ git branch -b branchB
```


然后再用git branch查看

```shell
$ git branch
  branchA
* branchB
  master
```
可以看到现在有3个分支，*表示出了当前分支branchB。
用git log来查看以下版本库的提交历史。

```shell
$ git log --graph --pretty="%h %s %d"
* 09a8752 initial commit  (HEAD -> branchB, origin/master, origin/HEAD, master, branchA)
```
可以看到，当前的版本库的头，指向branchB, branchA和master分支。新分支创建后，默认指向命令执行时版本库的当前位置，即HEAD。

## 切换分支
下面，我们把分支切换到branchA, 然后做几个提交。

```shell
$ git checkout branchA
$ echo "content 1" >> file_1
$ git add .
$ git commit -m "commit 1"
$ echo "content 2" >> file_2
$ git add .
$ git commit -m "commit 2"
$ ls
README.md
file_1
file_2
```

切换到branchB，再看一下本地文件

```
$ git checkout branchB
$ ls
README.md
```
现在就只剩下了README.md这个文件。

再做一个commit

```shell
$ echo "content 3" >> file_3
$ git add .
$ git commit -m "commit 3"
```

看一下版本库的提交历史

```shell
$ git log --format="%h %s %d" --graph --all
* 468e0b4 commit 3  (HEAD -> branchB)
| * 4d7d08f commit 2  (branchA)
| * be1bb7b commit 1 
|/  
* 09a8752 initial commit  (origin/master, origin/HEAD, master)
```

为了能让大家看清楚分支的关系，在git log命令后面加上了*--graph*参数。*--all*参数表示要列出所有分支的log。
试一下不加--all会有什么输出？

## 分支合并
假设我们很满意我们在分支b上的改动，先下需要把他合并到master里面去。需要执行下面的命令。

```shell
$ git checkout master
$ git merge branchB
```
查看以下版本库的commit变化。

```shell
$ git log --format="%h %s %d" --graph --all
* 468e0b4 commit 3  (HEAD -> master, branchB)
| * 4d7d08f commit 2  (branchA)
| * be1bb7b commit 1 
|/  
* 09a8752 initial commit  (origin/master, origin/HEAD)
```
可以看到，当前的HEAD同时指向master和branchB，也就是两个点合并到了一起。再看看文件系统的变化。

```shell
$ ls
README.md file_3
```

branchB上的改动也被拿到了master里面去。
这就是最常见的merge操作。这部分操作，在实际工作中，很大程度上会被版本库的merge request或者pull request来处理，不需要手动操作。

另外值得一提的是，git的帮助文档写的很详细，从git merge的帮助文档可见一斑。下面截取了一段描述：


```shell
Assume the following history exists and the current branch is "master":

                     A---B---C topic
                    /
               D---E---F---G master

Then "git merge topic" will replay the changes made on the topic branch since it diverged from master (i.e., E) until its current commit (C) on top of master, and record the result in a new commit along with the names of the two parent commits and a log message from the user describing the changes.

                     A---B---C topic
                    /         \
               D---E---F---G---H master
```
## rebase分支
branchA创建的时候，是从当时的master分支的HEAD取的，即09a8752。之后的两个改动，commit 1和commit 2，也都是基于09a8752之上做的。现在master已经有了新的改动， 我们希望更新branchA，使它基于最新的master代码。这就需要用rebase。

首先，查看一下帮助文档:

```shell
$ git rebase --help
Assume the following history exists and the current branch is "topic":

                     A---B---C topic
                    /
               D---E---F---G master

From this point, the result of either of the following commands:

           git rebase master
           git rebase master topic

would be:

                             A'--B'--C' topic
                            /
               D---E---F---G master
```

<br>

```shell
$ git rebase master
First, rewinding head to replay your work on top of it...
Applying: commit 1
Applying: commit 2
```

再看一下我们自己的版本库状态：

```shell
$ git log --format="%h %s %d" --graph --all
* 2b4fa74 commit 2  (HEAD -> branchA)
* 52f653f commit 1 
* 468e0b4 commit 3  (master, branchB)
* 09a8752 initial commit  (origin/master, origin/HEAD)
```

可以看到，现在本地的HEAD志向branchA的最上端，branchA里的两个commit，commit 1和commit 2是基于已经merge到master里的commit 3的。

## git push 和git pull，同步远端本本库。
为了演示的目的，我们需要重新clone一下版本库。执行如下操作，可以再$HOME/repository文件夹下clone两次，分别到learngit和learngit2目录。

```shell
$ cd $HOME/repository
$ git clone git@github.com:dodoinblue/learngit.git
$ git clone git@github.com:dodoinblue/learngit.git learngit2
```
在git clone后面在加一个参数，就是要clone到的位置。

看一下版本库情况

```shell
$ git log --format="%h %s %d" --graph --all
* 09a8752 initial commit  (HEAD -> master, origin/master, origin/HEAD)
```
看到，learngit只包含最初的状态，即只有initial commit这一个点。这是因为，之前我们做的branchA，branchB，都没有上传到远端服务器。

下面，我们在learngit文件夹下，创建一个分支，新建一个commit，并且上传到服务器上。

```shell
$ cd $HOME/repository/learngit
$ git checkout master
$ git checkout  -b branch1
$ echo "changes on branch 1" > file1
$ git add .
$ git commit -m "commit 1 in folder 1"
$ git push origin branch1
```

去另外一个文件夹检查一下。

```shell
$ cd $HOME/repository/learngit2
$ git log --format="%h %s %d" --graph --all
* 09a8752 initial commit  (HEAD -> master, origin/master, origin/HEAD)
```
可以看到 learngit2仍然没有得到learngit文件夹内做的改动。这是因为learngit2文件夹还没有和远端服务器同步状态。要得到最新的代码，需要做git pull

```shell
$ cd $HOME/repository/learngit2
$ git pull
From git@github.com:dodoinblue/learngit.git
 * [new branch]      branch1    -> origin/branch1
Already up-to-date.
```
再看*git branch --all*的输出

在learngit2里面，对branch1做一些修改，然后同步到learngit里面去。

```shell
$ cd $HOME/repository/learngit2
$ git checkout branch1
$ echo "another fix" >> file1
$ git add .
$ git commit -m "commit 2 from foler2"
$ git push origin branch1
```

回到learngit，尝试pull一下branch1的代码。

```shell
$ cd $HOME/repository/learngit
$ git checkout branch1
$ git pull --rebase
remote: Counting objects: 3, done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 0), reused 0 (delta 0)
Unpacking objects: 100% (3/3), done.
From git@github.com:dodoinblue/learngit.git
   664ca52..c808687  branch1    -> origin/branch1
There is no tracking information for the current branch.
Please specify which branch you want to rebase against.
See git-pull(1) for details

    git pull <remote> <branch>

If you wish to set tracking information for this branch you can do so with:

    git branch --set-upstream-to=origin/<branch> branch1
```

根据提示，有两种方法解决这个问题。一种是把命令打全，即*git pull origin branch1*。另一种是设置一下remote tracking branch，这样以后就不用再打全命令了，简写git pull就可以了。

```shell
git branch --set-upstream-to=origin/branch1 branch1
```

设置remote tracking branch，有很多情况可以自动执行。
* 在git push的时候，加一个-u参数，就可以自动关联远程和本地的分支。
* 在git checkout分支的时候，如果有一个远程分支叫branch2，且没有本地分支叫branch2，那么执行git checkout branch2，会自动在本地创建branch2，并且把远端的branch2设置为remote tracking branch。

##  一个常规的工作流程
通常，开始一个任务之前，要做下面几件事。
1. 清理一下unstaged的改动，可以选择丢弃掉，新建commit，或者暂存起来（stash）
2. 更新(pull)一下主分支，即你的改动需要提交到的那个分支，通常是master。
3. 基于最新的代码，新建一个分支。我们管这个分支叫topic分支。
4. 改**一个**bug或者实现**一个**新功能。
5. stage全部或者部分文件，commit。
6. push到远端本本库

## 创建新版本库

```shell
mkdir myproj
git init
```
这样就创建了一个本地版本库， 可以在这里做本地操作，比如git status, git add, git merge, git reset, git log, git commit等。如果想把代码push到服务器，需要在服务器上创建版本库。

## 创建远端版本库
不同的服务有不同的UI界面。下面是在githab里新建版本库的步骤。
1. 登陆进githab。在右上角找到“new project”的图标，一个小加号。
2. 填一个版本库的名字
3. 选择一个域，即这个库是属于你个人的还是你的team的。
4. 选择访问权限
5. 添加说明
6. 完成保存

到这步，已经创建了一个空的版本库。页面上会有提示接下来的操作，如何提交代码。





[img-cygwin1]: http://7xpcsj.com1.z0.glb.clouddn.com/cygwin1.png
[img-cygwin2]: http://7xpcsj.com1.z0.glb.clouddn.com/cygwin2.png
[img-cygwin3]: http://7xpcsj.com1.z0.glb.clouddn.com/cygwin3.png
[img-cygwin4]: http://7xpcsj.com1.z0.glb.clouddn.com/cygwin4.png
[img-cygwin5]: http://7xpcsj.com1.z0.glb.clouddn.com/cygwin5.png
[img-cygwin6]: http://7xpcsj.com1.z0.glb.clouddn.com/cygwin6.png
[img-cygwin7]: http://7xpcsj.com1.z0.glb.clouddn.com/cygwin7.png
[img-cygwin8]: http://7xpcsj.com1.z0.glb.clouddn.com/cygwin8.png
[img-cygwin9]: http://7xpcsj.com1.z0.glb.clouddn.com/cygwin9.png


[img-mac-terminal]: http://7xpcsj.com1.z0.glb.clouddn.com/mac-terminal.png
[img-ubuntu-terminal]: http://7xpcsj.com1.z0.glb.clouddn.com/ubuntu-terminal.png
