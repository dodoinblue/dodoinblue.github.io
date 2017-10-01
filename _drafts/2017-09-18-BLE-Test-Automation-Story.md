---
layout: post
title: Automated BLE device test tool - The Story
date: 2017-09-04 19:27:31
language: en
---

## The problem
I have served 2 wearable device companies. One thing that set wearable device projects from other software projects is that it has a hardware device, in addition to a client and a server as most other mobile application projects have.

In a typical client-server project, client side software and server side software are handled by different teams and engineers often create “dummy” server or client to work independently, so their work won’t rely on the other teams’ progress, and in the meantime, make the debugging easier. This is regarded as a best practice in software industry, and there are plenty frameworks and libraries to help engineers achieve just this.

Things get much more complicated when a Bluetooth device is involved. All the existing HTTP based frameworks and libraries do not apply here, so it is hard to separate a Bluetooth device with its host/server. A client-server system is so common and its underlying HTTP protocol is so well defined, that both Android and iOS have built-in frameworks to help developer fake server response during development. Tools like Charles-Proxy can catch every package send between a client and a server, but similar tools are not available for Bluetooth connections.

What make things even worse is that a Bluetooth device often has very limited UI to give engineer a proper feedback, so in most cases engineers rely on the host app to get all the information they need. For instance, a Bluetooth headset often only has one LED, but that LED is responsible for indicating connectivity status, battery level, play status, control command response, etc. To verify if the device is connected to its host, an engineer must check the UI on the host device to be sure.

On the other side, an app developer cannot develop or debug its work until a hardware device is ready. This make project management a little bit harder as project managers must plan tasks carefully so that one team won’t be blocked by another team.

This also impacts testing. For starters, it is hard to test edge cases. For example, a wearable device needs user’s age, height and weight to calculate calorie consumption. If a tester want to test if setting age to 256 will overflow the firmware, he cannot do that because the max value supported on app’s UI is 150. Second, it is impossible to fake data. When testing the app, it is often required that some data is present. The data comes from device’s sensor, so you’ll see test engineers shake the device while they are in their seat. But what about some cases that require heartrate to reach 180? So, there are a lot of cases that cannot be tested.

## The solution
What make this problem interesting to me is that it is so common in Bluetooth connected projects, whether the product is a wearable device, a smart lock or a connected smart oven. And therefore, the solution is potentially applicable to all these projects. 

I remember that a couple of years ago when Apple updated its Mac line, it included Bluetooth Low Energy support in all its Mac products. After a little investigation, I found out that all recent laptop models have BLE chip built-in, and the Chip can work as a master or a slave, which means I’m not only able to send commands to a BLE device, I can also turn the laptop into a BLE device!

So, the next question is how to control the BLE chip? Android uses a API called HCI to control its BLE chip, and the good news is that HCI is also available on Linux. And on Mac and Windows OS, they have similar interfaces. Thanks to a lot of open source projects on Github, I found a lot of HCI bindings in different languages, such as C++, python and JS. 

Then is the implementation. The tool I created has two modes, master mode and slave mode. In master mode, it sends commands to a BLE device and parse the response. You can do something like this in a command-line console: 
```js
master.setRestingHR(50)
master.readRestingHR() // return 50
master.startDataSync() // return binary steam of sync data
```
As a slave, it receives all the commands sent by companion app and feed predefined response back. You can start the slave by a command line command like this:
```bash
Slave –device-name Fake-Tracker –heartrate 67
```
Then in the companion app a device with name Fake-Tracker can be found. When connected, 
If you are interested in the implementation details, please go to my blog at: http://www.supersuperstar.com

## The result
By combining the master mode of my utility and existing unit test framework such as Mocha.js, I created a test script that can send hundreds of different settings, both valid and invalid, to verify if the firmware can handle these commands as expected. This reduces the time spent on full firmware test from 2 days to less than 5 min, and the test coverage is much higher than we used to have. 

On the app’s side, much more scenarios can be tested now using the slave mode.  For instance, tester can set a corrupted binary stream as sync data and see if app can handle this scenario well. 

This tool also enables E2E testing. Data in a wearable device system is usually generated by the device, and then synchronized to mobile app via Bluetooth and then transferred to a database in the cloud. With this new tool, we are working on automated tests that generate some data using the slave mode, and then verify if the data is saved correctly on the cloud.

