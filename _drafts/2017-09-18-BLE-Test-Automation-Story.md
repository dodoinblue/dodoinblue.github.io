---
layout: post
title: Automated BLE device test tool - The Story
date: 2017-09-04 19:27:31
---

## The problem
I have served 2 wearable device companies. One thing that set wearable device projects from other software projects is that it has a hardware device, in addition to a client and a server as most other mobile application projects have.

In a typical client-server project, client side software and server side software are handled by different teams and engineers often create “dummy” server or client to work independently, so their work won’t rely on the other teams’ progress, and in the meantime, make the debugging easier. This is regarded as a best practice in software industry, and there are plenty frameworks and libraries to help engineers achieve just this.

Things get much more complicated when a Bluetooth device is involved. All the existing HTTP based frameworks and libraries do not apply here, so it is hard to separate a Bluetooth device with its host/server. A client-server system is so common and its underlying HTTP protocol is so well defined, that both Android and iOS have built-in frameworks to help developer fake server response during development. Tools like Charles-Proxy can catch every package send between a client and a server, but similar tools are not available for Bluetooth connections.

What make things even worse is that a Bluetooth device often has very limited UI to give engineer a proper feedback, so in most cases engineers rely on the host app to get all the information they need. For instance, a Bluetooth headset often only has one LED, but that LED is responsible for indicating connectivity status, battery level, play status, control command response, etc. To verify if the device is connected to its host, an engineer must check the UI on the host device to be sure.

On the other side, an app developer cannot develop or debug its work until a hardware device is ready. This make project management a little bit harder as project managers must plan tasks carefully so that one team won’t be blocked by another team.

This also impacts testing. For starters, it is hard to test edge cases. For example, a wearable device needs user’s age, height and weight to calculate calorie consumption. If a tester want to test if setting age to 256 will overflow the firmware, he cannot do that because the max value supported on app’s UI is 150. Second, it is impossible to fake data. When testing the app, it is often required that some data is present. The data comes from device’s sensor, so you’ll see test engineers shake the device while they are in their seat. But what about some cases that require heartrate to reach 180? So, there are a lot of cases that cannot be tested.

## The solution
What make this problem interesting to me is that it is so common in Bluetooth connected projects, whether the product is a wearable device, a smart lock or a connected smart oven. And the solution is potentially applicable to all these projects.
