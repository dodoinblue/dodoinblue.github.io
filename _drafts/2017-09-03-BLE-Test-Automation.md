---
layout: post
title: BLE设备的自动化测试
date: 2017-09-04 19:27:31
---

在软硬结合的项目中，针对软件和硬件间通讯接口的测试普遍是一个难点。主要的原因是这个测试需要同时控制软件和硬件，很难将两者分开。比如一个运动追踪器和它的app项目，如果要测试屏幕亮度的设置，就需要用手机发送一条指令到运动追踪器中，然后，由于硬件本身的局限，测试工程师只能通过观察屏幕亮度定性的测试，很难定量的测量设置数据是否正确。反之亦然。如果App中的某个事件需要在配速6分钟每公里时触发，那么测试工程师只能去真的跑步或者疯狂的摇硬件设备来触发这个条件。

![][img-tbbt-fitbit]

显然这样做有很多问题。首先这很麻烦，也不能覆盖所有情况。假如需要测试`当用户心率达到200时发出警报`这样一个case，显然在保证测试人员安全的前提下是做不到的。其次，同常软硬件项目同时进行，也就是说测试硬件时依赖一个并不稳定的软件，或者测试软件时依赖一个并不稳定的硬件，这令人非常不放心，并且项目的某些部分必须等到对应的功能或者UI实现后才能开始进行开发，严重影响项目进度。另外，以上操作都很难自动化，所以每次需要回归测试的时候，测试工程师都需要重复这些非常麻烦，甚至很难实现的操作。

这个问题的一个解决办法是做仿真。通过做一个仿真器，放在软硬件设备之间，当测试、开发硬件时，模拟软件部分；当测试、开发软件时，模拟硬件部分。通常做一个仿真器是一个费时费钱的工作，只有土豪公司才有可能投入去做。幸运的是，蓝牙模块普遍内置于笔记本电脑里，对于台式机来说，一个蓝牙适配器只要几十块钱。我们可以通过电脑的蓝牙来模拟蓝牙硬件设备。这样我们就可以很容易地控制测试条件，并且非常方便的集成到自动化测试系统中。


[img-tbbt-fitbit]: http://7xpcsj.com1.z0.glb.clouddn.com/The_Big_Bang_Theory_fitbit.gif
