---
layout: post
title: git进阶
date: 2016-06-22 18:38:21
---

# 复习一下分支

* 每个版本库都会默认创建一个master分支
* 用git branch **branch_name** 来创建新分支
* 用git checkout **branch_name** 切换到其它分支
* 用git checkout -b **branch_name** 创建并切换到新分支
* 用git branch来查看当前本地分支
* 用git merge来rebase分支
* 用git rebase来rebase分支


# HEAD
git一直维护一个HEAD指针，标示着当前工作区的版本。HEAD指针存在.git目录下面的HEAD文件中。

``` shell
$ cat .git/HEAD
ref: refs/heads/master
```

HEAD的内容会随着分支的切换而变化。

```shell
$ git checkout branchA
$ cat .git/HEAD
ref: refs/heads/branchA

$ git branch
* branchA
  master

$ git checkout master
$ cat .git/HEAD
ref: refs/heads/master

$ git checkout HEAD~
Note: checking out 'HEAD~'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by performing another checkout.

If you want to create a new branch to retain commits you create, you may
do so (now or later) by using -b with the checkout command again. Example:

  git checkout -b <new-branch-name>

HEAD is now at 09a8752... initial commit

$ cat .git/HEAD
09a87524de2e8246ad03a2f5a95f82a7ee212bbc

```

画个图来表示这个过程

最开始在master分支上

```
           HEAD
            v
A  -  B  -  C - master

       \ -  D  -  E - branchA

```

然后切换到branchA分支


```
A  -  B  -  C - master

       \ -  D  -  E - branchA
                  ^
                 HEAD
```

切换回master之后再回退一个commit

```
     HEAD
      v
A  -  B  -  C - master

       \ -  D  -  E - branchA

```

# 别名
为了后续演示方便，先讲一下git的别名。
是不是每次都打git status很麻烦？是不是每次都写git log --oneline很麻烦？可以通过设置别名来让命令更简洁。

```
$ git config --global alias.st status
$ git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

然后再试一下效果

```
$ git config --global alias.st status

$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
nothing to commit, working directory clean

$ git st
On branch master
Your branch is up-to-date with 'origin/master'.
nothing to commit, working directory clean

$ git lg
* 5f53557 - (HEAD -> master, origin/master, origin/HEAD) X (2 days ago) <Charles Liu>
* adce75c - (tag: 0.0.2) B (2 days ago) <Charles Liu>
* b58b4b4 - A (2 days ago) <Charles Liu>
* 7cdf153 - (tag: 0.0.1) Initial commit (4 days ago) <dodoinblue>
```

# 重用代码
之前我们讲过分支间的的合并和rebase。当我们使用多分支的时候，我们会碰到在多个分支间共享一部分代码，而不是整个分支。这就要用到cherry-pick。


先看一个例子。看一下我们的当前分支状况

```
$ git log --graph --oneline
* 994ce3d - (HEAD -> another) Y (6 seconds ago) <Charles Liu>
* 94f0e30 - X (21 seconds ago) <Charles Liu>
| * 177556d - (master) D (13 hours ago) <Charles Liu>
| * 8742e75 - C (13 hours ago) <Charles Liu>
| * da8b2e4 - B (13 hours ago) <Charles Liu>
|/
* 9d8149a - A (13 hours ago) <Charles Liu>
* 09a8752 - (origin/master) initial commit (5 weeks ago) <Charles Liu>

$ git cherry-pick da8b
[another d41e2ba] B
 Date: Thu Dec 17 21:20:24 2015 +0800
 1 file changed, 1 insertion(+)

$ git log --graph --oneline
* d41e2ba - (HEAD -> another) B (33 seconds ago) <Charles Liu>
* 994ce3d - Y (10 minutes ago) <Charles Liu>
* 94f0e30 - X (11 minutes ago) <Charles Liu>
| * 177556d - (master) D (13 hours ago) <Charles Liu>
| * 8742e75 - C (13 hours ago) <Charles Liu>
| * da8b2e4 - B (13 hours ago) <Charles Liu>
|/
* 9d8149a - A (13 hours ago) <Charles Liu>
* 09a8752 - (origin/master) initial commit (5 weeks ago) <Charles Liu>
```

用图来表示，cherry-pick实现了这样的效果。

```
A  -  B  -  C  -  D  -  E - dev
              \
      |        \
                \
       \ -  X  -  C' - release

```

这里用C'表示cherry-pick之后的结果。C和C'内容上是一致的，但是他们的SHA1是不同的。cherry-pick的时候，建议加上-x参数，这样在新生成的commit meessage里面，会自动生成一句cherry-picked from: xxxxx。

```
$ git cherry-pick -x 8742
[another 82c17ef] C
 Date: Thu Dec 17 21:21:24 2015 +0800
 1 file changed, 1 insertion(+)

$ git lg --all
* 82c17ef - (HEAD -> another) C (14 seconds ago) <Charles Liu>
* d41e2ba - B (23 minutes ago) <Charles Liu>
* 994ce3d - Y (33 minutes ago) <Charles Liu>
* 94f0e30 - X (33 minutes ago) <Charles Liu>
| * 177556d - (master) D (13 hours ago) <Charles Liu>
| * 8742e75 - C (13 hours ago) <Charles Liu>
| * da8b2e4 - B (13 hours ago) <Charles Liu>
|/
* 9d8149a - A (13 hours ago) <Charles Liu>
* 09a8752 - (origin/master) initial commit (5 weeks ago) <Charles Liu>

$ git log
commit 82c17effcea29c9dd96185a2828305426cdd1adc
Author: Charles Liu <dodoinblue@gmail.com>
Date:   Thu Dec 17 21:21:24 2015 +0800

    C

    (cherry picked from commit 8742e75e50762b73e3b08f94d53f9cda09767095)

commit d41e2ba7beacaa2584277a0f75ec2cce861a684e
Author: Charles Liu <dodoinblue@gmail.com>
Date:   Thu Dec 17 21:20:24 2015 +0800

    B

commit 994ce3db3b5acb706a52120e8e340811fa5baf6d
Author: Charles Liu <dodoinblue@gmail.com>
Date:   Fri Dec 18 10:08:06 2015 +0800

    Y

```

# 冲突解决
在做cherry-pick, rebase 或者 merge的时候，有可能会遇到冲突。两个不同的分支上都对同一个文件做了修改，当他们合并到一起的时候，git会询问用户如何处理。

先看一下当前版本库的状态。可以看到版本库master和another对file做了不同的修改。在master上，file文件有三行，分别是A，B和C。another分支上，file文件只有2行，是A和X。

```
$ git lg --all
* b26c4d9 - (HEAD -> another) X (6 seconds ago) <Charles Liu>
| * 8742e75 - (origin/master, master) C (19 hours ago) <Charles Liu>
| * da8b2e4 - B (19 hours ago) <Charles Liu>
|/
* 9d8149a - (origin/another) A (19 hours ago) <Charles Liu>
* 09a8752 - initial commit (5 weeks ago) <Charles Liu>

$ git checkout master
$ cat file
A
B
C

$ git checkout another
$ cat file
A
X
```

下面尝试把master分支上的B拿到another分支上。B commit的SHA1是da8b2e4。

```
$ git cherry-pick da8b
error: could not apply da8b2e4... B
hint: after resolving the conflicts, mark the corrected paths
hint: with 'git add <paths>' or 'git rm <paths>'
hint: and commit the result with 'git commit'

```
这时候，看一下git status输出：

```
$ git status
On branch another
You are currently cherry-picking commit da8b2e4.
  (fix conflicts and run "git cherry-pick --continue")
  (use "git cherry-pick --abort" to cancel the cherry-pick operation)

Unmerged paths:
  (use "git add <file>..." to mark resolution)

	both modified:   file

no changes added to commit (use "git add" and/or "git commit -a")
```

git告诉我们两个分支上都更改了file文件。那么需要看一下file文件现在的内容。

```
$ cat file
A
<<<<<<< HEAD
X
=======
B
>>>>>>> da8b2e4... B
```

要解决这个冲突，需要用文本编辑器或者IDE打开这个文件，把<<<< 和  >>>> （含）之间的部分改成自己希望的样子。其中<<<<到====之间是执行cherry-pick时HEAD上的内容。====到>>>>之间是被cherry-pick过来的内容。

我们把这个文件改成这个样子。

```
A
B
X
```

然后执行

```
$ git add file
$ git cherry-pick --continue

```

这时候被提示输入commit message。然后保存。再看当前版本库的状态。

```
$ git lg --all
* 8a9aa67 - (HEAD -> another) B (32 seconds ago) <Charles Liu>
* b26c4d9 - X (4 minutes ago) <Charles Liu>
| * 8742e75 - (origin/master, master) C (19 hours ago) <Charles Liu>
| * da8b2e4 - B (19 hours ago) <Charles Liu>
|/
* 9d8149a - (origin/another) A (19 hours ago) <Charles Liu>
* 09a8752 - initial commit (5 weeks ago) <Charles Liu>
```

在实际工作中，通常遇到的冲突会比刚才这个例子大很多。这时候就需要借助第三方工具来解决冲突。这里推荐跨平台的工具kdiff3。
下载kdiff3

> http://kdiff3.sourceforge.net/

Cygwin配置kdiff3，需要在global config文件添加下面的内容：

```
[difftool "kdiff3"]
    cmd = kdiff3 \"$(cygpath -wla $LOCAL)\" \"$(cygpath -wla $REMOTE)\"
    trustExitCode = false
[mergetool "kdiff3"]
    cmd = kdiff3 \"$(cygpath -wla $BASE)\" \"$(cygpath -wla $LOCAL)\" \"$(cygpath -wla $REMOTE)\" -o \"$(cygpath -wla $MERGED)\"
    keepBackup = false
    trustExitCode = false
```

See http://stackoverflow.com/questions/15097053/kdiff3-under-cygwin-git-will-not-invoke


Mac OS上配置kdiff3

```
# http://stackoverflow.com/questions/9776434/git-mergetool-config-on-mac-osx
$ git config --global merge.tool kdiff3

# And if kdiff3 is not in your path also do:
$ git config --global mergetool.kdiff3.path /Applications/kdiff3.app/Contents/MacOS/kdiff3
```

Ubuntu上配置kdiff3

```
# http://stackoverflow.com/questions/15321472/how-could-i-force-mergetool-gui-kdiff3-to-be-always-shown
git config --global mergetool.kdiff3NoAuto.cmd "kdiff3 --L1 \"\$MERGED (Base)\" --L2 \"\$MERGED (Local)\" --L3 \"\$MERGED (Remote)\" -o \"\$MERGED\" \"\$BASE\" \"\$LOCAL\" \"\$REMOTE\""
```

配置好kdiff和git的config之后，我们在来试一次刚才的cherry-pick。

```
$ git reset --hard HEAD~1
HEAD is now at b26c4d9 X
bogon:learngit Charles$ git status
On branch another
nothing to commit, working directory clean

$ git lg --all
* b26c4d9 - (HEAD -> another) X (2 hours ago) <Charles Liu>
| * 8742e75 - (origin/master, master) C (21 hours ago) <Charles Liu>
| * da8b2e4 - B (21 hours ago) <Charles Liu>
|/
* 9d8149a - (origin/another) A (21 hours ago) <Charles Liu>
* 09a8752 - initial commit (5 weeks ago) <Charles Liu>
bogon:learngit Charles$ git cherry-pick da8b
error: could not apply da8b2e4... B
hint: after resolving the conflicts, mark the corrected paths
hint: with 'git add <paths>' or 'git rm <paths>'
hint: and commit the result with 'git commit'

$ git mergetool
Merging:
file

Normal merge conflict for 'file':
  {local}: modified file
  {remote}: modified file

```

这时候kdiff3就会启动。可以看到界面分为上下两个部分。下面是最终的输出结果。上面分成了三块，分别是Base，Local和Remote，分别标记为A，B和C
A: Local是cherry-pick执行时，HEAD的内容。
B: Base是被cherry-pick的那个commit改动之前的样子。
C: Remote是被cherry-pick的那个commit改动之后的结果。

选择你希望的选择的结果，注意可以多选。这里我希望X行在最后，所以选择C和B。

![][img-kdiff3-1]

![][img-kdiff3-2]

![][img-kdiff3-3]

然后保存退出。执行剩下的操作。

```
$ git cherry-pick --continue  # :wq 保存commit message
[another 2995460] B
 Date: Thu Dec 17 21:20:24 2015 +0800
 1 file changed, 1 insertion(+)

$ git lg --all
* 2995460 - (HEAD -> another) B (10 seconds ago) <Charles Liu>
* b26c4d9 - X (2 hours ago) <Charles Liu>
| * 8742e75 - (origin/master, master) C (21 hours ago) <Charles Liu>
| * da8b2e4 - B (21 hours ago) <Charles Liu>
|/
* 9d8149a - (origin/another) A (21 hours ago) <Charles Liu>
* 09a8752 - initial commit (5 weeks ago) <Charles Liu>
```

执行git merge 或者 git rebase命令都可能遇到冲突。大家可以自己尝试操作。注意一点，解决完冲突之后，需要执行相应的--continue命令。

## 改写历史

通常我们会碰到这样一个场景。我们修改了一个bug，经过简单测试后commit了。之后发现还需要对这个commit做一些修改。如果再改代码，再commit，我们会在git log里看到2个commit。这不是我们希望的。理想的情况是每一个commit对应这一个完整的fix或者feature，不多不少。这样我们以后需要重用这个bug的时候，只需要cherry-pick一个commit就可以。review代码的时候也可以清晰地追溯问题。

```
$ echo "This line should fix a bug. #1234" > bugfix
$ git add .
$ git commit "bugfix #1234"
$ echo "This line fixes a bug introduced by the line above." >> bugfix
$ git add .
$ git commit "bugfix #1234 again"
$ git log --oneline
d4f4be5 bugfix #1234 again
770d129 bugfix #1234
8742e75 C
da8b2e4 B
9d8149a A
09a8752 initial commit
```

log历史里面有2个commit都是在修1234号bug。这不是我们期望的。让我们回退一个commit，重新在做一次。

```
$ git reset --hard HEAD~
HEAD is now at 770d129 bugfix #1234

$ echo "This line fixes a bug introduced by the line above." >> bugfix
$ git add .
$ git commit --amend -m "bugfix #1234"

$ git log --oneline
e18fb1a bugfix #1234
8742e75 C
da8b2e4 B
9d8149a A
09a8752 initial commit

$ cat bugfix
This line should fix a bug. #1234
This line fixes a bug introduced by the line above.

```
可以看到，虽然log里只有一个commit，但是bugfix文件里的内容包含两次改动的内容。而且需要注意的是，commit被修正后，SHA1号也改变了。

如果第一次的commit之后，改动被push到server上。第二次再做push的时候，需要加-f参数，表示强制更新。任何改写历史的操作都是危险的操作，操作不当会引起代码丢失，历史无法追溯等问题。默认情况下，master分支，dev分支和release分支会被保护起来，禁止-f操作。

```
$ git lg
* 9d8149a - (HEAD -> another, origin/another) A (2 days ago) <Charles Liu>
* 09a8752 - initial commit (6 weeks ago) <Charles Liu>

$ echo "A'" >> file
$ git add .
$ git commit --amend -m "A'"
[another fa5ad5b] A'
 Date: Thu Dec 17 21:19:58 2015 +0800
 1 file changed, 2 insertions(+)
 create mode 100644 file

$ git push origin another
To git@github.com:dodoinblue/learngit.git
 ! [rejected]        another -> another (non-fast-forward)
error: failed to push some refs to 'git@github.com:dodoinblue/learngit.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.

$ git push origin another -f
Counting objects: 3, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (3/3), 278 bytes | 0 bytes/s, done.
Total 3 (delta 0), reused 0 (delta 0)
To git@github.com:dodoinblue/learngit.git
 + 9d8149a...fa5ad5b another -> another (forced update)
```

刚才介绍了改写最近的一个commit的方法。如果发现需要修改的commit已经被其他commit覆盖了，需要用**git rebase -i**这个命令。这里不做介绍。

## gitignore
把不希望提交到版本库的文件添加到.gitignroe里面。git就不会追踪这些文件的变化。
比较有用的是IDE自动生成的文件，编译结果目录，涉及到密码等的配置文件。

## Tag
每一个commit都有一个唯一的SHA1号做标示。但是这个SHA1号不便于记忆，也不能直观地反映出两个SHA1之间的关系。我们可以用Tag来解决这个问题。

Tag可以理解为SHA1的一个别名。下面这段代码演示了给“initial commit”这个点打一个tag。

```
$ git tag -a 0.0.1 09a87 -m "0.0.1: initial draft"
$ git lg --all
* fa5ad5b - (HEAD -> another, origin/another) A' (5 minutes ago) <Charles Liu>
| * 8742e75 - (origin/master, master) C (2 days ago) <Charles Liu>
| * da8b2e4 - B (2 days ago) <Charles Liu>
| * 9d8149a - A (2 days ago) <Charles Liu>
|/
* 09a8752 - (tag: 0.0.1) initial commit (6 weeks ago) <Charles Liu>
```

可以用git tag -l命令来查看所有的tag。

```
$ git tag -l
0.0.1
```


## 在工作中使用git

## 获取代码

绝大多数情况下，我们都是要从一个已有的git版本库中获取代码。那么我们需要做的就是从远端服务器clone代码。

```
git clone https://github.com/dodoinblue/learngit.git
```
从项目首页可以找到下载地址。

![][img-PR1]

## 更新代码
比如我们更新master分支。执行下面的命令：

```
git chekcout master
git pull --rebase
```

这里有几个要注意的地方。
首先要保证本地的版本库干净，没有未commit的改动。
第二，要切换到想更新的分支上去。
第三，使用--rebase参数。如果不加--rebase，默认pull下来的代码和本地代码做merge。如果本地的commit还没有上传，又和pull下来的代码merge到了一起，再上传前要做额外的处理。

## 修改一个bug

首先确认目标分支，即我们要再哪个分支上解决这个问题。假设我们要在dev分支上解决一个bug。
第二步，更新目标分支。这部分参考上面一小节的内容。
第三步，新建一个topic分支。所有的改动都在topic分支上做。

```
$ git checkout -b bugfix-1234
```

第四步，coding。修改代码->自己测试->继续修改->测试通过
第五步，commit代码

```
$ git add files_to_stage
$ git commit

```
这里不要用-m参数。让git带你进入编辑器，输入完整的commit信息。
关于如何写commit message，每个项目都会有一些不同的要求。我们看一下Linux Kernel对Patch的要求。

> http://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/tree/Documentation/SubmittingPatches?id=HEAD#l521


> For these reasons, the "summary" must be no more than 70-75
characters, and it must describe both what the patch changes, as well
as why the patch might be necessary.  It is challenging to be both
succinct and descriptive, but that is what a well-written summary
should do.

所以，我认为，一个合格的Commit Message有如下要求：
1. 要包含两部分，一是Summary/Title，二是详细内容。二者之间要空一行。
2. Title要小于70个英文字符。
3. 标记bug/feature id。正文部分，如果项目管理工具本身有标记feature或者任务的id，还有bug的id，那么最好在正文中明确写出bug编号或者feature编号，以方便项目管理工具予以统计。在最后一行，但是在生成的cherry-pick from字样之上，写BugId=1234。或者FeatureId=1234。

一个示例message:
> http://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/commit/?id=41a0c249cb8706a2efa1ab3d59466b23a27d0c8b

```
proc: fix -ESRCH error when writing to /proc/$pid/coredump_filter
Writing to /proc/$pid/coredump_filter always returns -ESRCH because commit
774636e19ed51 ("proc: convert to kstrto*()/kstrto*_from_user()") removed
the setting of ret after the get_proc_task call and incorrectly left it as
-ESRCH.  Instead, return 0 when successful.
```

更多关于commit message的讨论可以看这篇blog：

> http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html

第六步，上传代码

```
git push origin bugfix-1234
```

第七步，创建一个Pull Request或者Merge Request。（简称PR）

![][img-PR1]

第八步，技术负责人Review PR。测试从PR上取代码，编译打包并测试。

![][img-PR2]

第九步，Review OK并且测试OK，由技术负责人merge这个PR。


## 与同事合作做一个feature

做一个feature和解一个bug的流程是相似的。不同的是，一个feature可能工作的周期更长，包含多个commit，并且可能是多个开发者合作完成的。假设2个工程师分别是david和bob，其中David为feature的Arch。大致的工作过程大概是这样的:

1. David在dev分支的最新点新建了一个feature分支，叫feature-something-cool
2. Bob更新本地版本库，然后切换到feature-something-cool.
3. David把feature分成了2个task: cool-service, cool-ui。
3. David从feature-something-cool上面新建了topic分支david-cool-service, 然后开始coding。
4. Bob也从feature-something-cool上面建了个topic分支bob-cool-ui
5. 当David完成了他的任务，并且自测完成，把代码push到server，创建一个PR。
6. 同时，Bob也完成了他的部分，上传了代码并且创建了PR。
7. 大量的代码review。Merge一部分代码。
8. Merge另一部分代码，很可能需要做冲突解决的工作。
9. 创建一个从feature-something-cool到dev分支的PR。测试开始大量验收测试。Dev分支上的Arch要review代码。
10. 测试完成。Review OK。
11. Dev分支的Arch接受PR，Merge进dev分支。


## 发布一个版本

当所有的feature都完成后，项目就达到了Function Complete的里程碑。这时候主要的任务是让产品稳定下来，解决bug，提高性能和稳定性。这时候，我们要从dev分支branch out一个叫做release分支的分支，在release分支上，只进满足我们目标的fix，及解决bug，提高稳定性，或者提高了性能的fix。如果改动带来得风险大于收益，我们可以考虑把这个fix放进dev分支观察，充分测试后，在下一个版本发布。

```
$ git checkout dev
$ git checkout -b releae-1.0

# accept fix 1234: "Fix nullpointer when loading profile photo at first startup"
# accept fix 1234: "Reduce CPU load by replacing float variables in HR algorithm"

```
当测试达标后，我们给release分支的最终点打一个tag。

```
$ git tag -a 1.0.0
```

让git跳转到编辑器，把1.0.0这个版本的release note写清楚。
比如这样
```
1.0.0 release. Add bluetooth support

New feature:
Feature 123: Support BT 2.1
Feature 124: User friendly Pairing process.
Feature 125: Reduce BT connection time

Bugfixes:
Bug 1234: Improved stability

```

可以用git log先查看好修改历史。假设上一个发布版本是0.9.9，可以用这个命令来查看修改历史：

```shell
$ git log --oneline 0.9.9..1.0.0
```

Tag的message写好后，把tag推送到服务器。

```shell
$ git push origin 1.0.0
```


## 规划分支
我们访问一些开源项目的下载页面时，经常会看到同时有多个版本存在。比如ubuntu，现在同时存在14.04.3 LTS和15.10两个版本，两个版本同时存在并且演进。

在git中，用多分支可以很容易地帮助我们管理多个版本。比如我们可以用下面的方式实现类似ubuntu这样的分支策略：

```
A  -  B  -  C  -  D  -  X‘ -  F  -  G - dev
            |        /   \
            |       /     M  -  N  -  O - release-branch-15
            |  cherry-pick      ^
            |     /           15.10
            |     |
             \ -  X  -  Y  -  Z  - release-branch-14
                  ^           ^
                14.0.1      14.0.3

```

这样的分支规划反应了一般的软件项目的实践：有一根开发分支（不稳定分支），永远有最新的功能。有一根稳定分支，经过不断测试但是不包含最新的功能。开发分支不稳定是指没有严格测试过，并不代表可以随意deliver代码。通常，对于新代码，需要建一个短期存在的topic分支，topic分支上的代码需要经过基础的测试（单元测试和冒烟测试），才能继承进dev分支。当开发进入了预定的里程碑（milestone），所有的功能都已经实现，这时候需要拉出一个release分支，不进新功能，只解bug，提高稳定性。这时候，团队的一部分成员继续开发新功能，并且把新功能deliver进dev分支。另一部分成员负责提高稳定性，把它们集成到release分支里去。

对于稳定性问题，如果问题同时存在在dev分支和release分支上，比较好的做法是先把fix集成进dev分支，经过测试后，再集成进release分支。对于dev分支不适用的改动，可以直接deliver进release分支。



[img-kdiff3-1]: http://7xpcsj.com1.z0.glb.clouddn.com/kdiff3-1.png
[img-kdiff3-2]: http://7xpcsj.com1.z0.glb.clouddn.com/kdiff3-2.png
[img-kdiff3-3]: http://7xpcsj.com1.z0.glb.clouddn.com/kdiff3-3.png
[img-PR1]: http://7xpcsj.com1.z0.glb.clouddn.com/PR1.png
[img-PR2]: http://7xpcsj.com1.z0.glb.clouddn.com/PR2.png
[img-PR3]: http://7xpcsj.com1.z0.glb.clouddn.com/PR3.png


