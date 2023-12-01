---
layout: post
title: Microk8s配置
date: 2022-04-28 18:27:31
---

# 目标

我有一个云服务器，一个闲置的J4125+8G的小主机。家里的网络有透明代理，访问各种开发资源更方便一些，所以我打算把一部分测试开发用的服务部署到这个主机里。并且我可以在云服务器上搭建一个frp服务，把公网流量映射到小主机上，方便外网测试。本文主要记录小主机上microk8s的配置过程，frp和透明代理的搭建不覆盖在文章内容里。

## Microk8s

有很多方法可以部署一个测试用的kubernetes集群，选择microk8s只要是图省事。可以随ubuntu一起安装，还有一些默认的组件比如ingress, metallb等可以直接使用。

Microk8s安装很简单。安装Ubuntu 20.04 server的时候选择microk8s为安装组件就可以了，等着安装完成。

也可以在Ubuntu安装完成后执行s`sudo snap install microk8s --classic`安装


## 配置

### 访问权限

登录到ubuntu小主机。首次运行需要给登录用户足够的权限，执行:

```
sudo usermod -a -G microk8s $USER
sudo chown -f -R $USER ~/.kube
```

之后可以重新登录，或者执行`newgrp microk8s`立即成效。

现在可以查看kubernetes集群状态了
```
~$ microk8s status

microk8s is running
high-availability: no
  datastore master nodes: 127.0.0.1:19001
  datastore standby nodes: none
addons:
  enabled:
    ha-cluster           # Configure high availability on the current node
  disabled:
    ambassador           # Ambassador API Gateway and Ingress
    cilium               # SDN, fast with full network policy
...
```

查看资源状态

```
~$ microk8s kubectl get pods

No resources found in default namespace.
```
### 配置kubectl

在Ubuntu系统里，运行`microk8s config`查看集群配置
```
~$ microk8s config
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: CERT_DATA
    server: https://SERVER_IP:16443
  name: microk8s-cluster
contexts:
- context:
    cluster: microk8s-cluster
    user: admin
  name: microk8s
current-context: microk8s
kind: Config
preferences: {}
users:
- name: admin
  user:
    token: ADMIN_USER_TOKEN
```
这里SERVER_IP是ubuntu小主机的局域网IP。CERT_DATA和ADMIN_USER_TOKEN是microk8s生成的秘钥。
回到自己的工作机上，把上面的信息copy到`${HOME}/.kube/config`文件里。这样当工作机和小主机处于同一局域网内时，可以在工作机上运行`kubectl get pods`管理集群里的资源。

#### 公网访问

家里的网络有动态的公网IP, 所以可以通过绑定DDNS+端口映射的方法访问到k8s集群。没有公网IP的话可以配置FRP解决。映射方法不在这里介绍，现在假定microk8s.yourdomain.com:16443映射到了ubuntu小主机SERVER_IP:16443上。那么从公网访问k8s的话，上面的配置里的cluster->server应该由`https://SERVER_IP:16443`改成`https://microk8s.yourdomain.com:16443`。

再此在工作机上执行`microk8s kubectl get pods`会出现下面的错误
```
Unable to connect to the server: x509: certificate is valid for kubernetes, kubernetes.default, kubernetes.default.svc, kubernetes.default.svc.cluster, kubernetes.default.svc.cluster.local, not microk8s.yourdomain.com
```
这是因为集群的ca证书没有包括新添加的域名。解决办法是登录到ubuntu小主机上，执行
```
vim /var/snap/microk8s/current/certs/csr.conf.template
```

找到这一段，然后加上箭头指向的这行
```
[ alt_names ]
DNS.1 = kubernetes
DNS.2 = kubernetes.default
DNS.3 = kubernetes.default.svc
DNS.4 = kubernetes.default.svc.cluster
DNS.5 = kubernetes.default.svc.cluster.local
DNS.6 = microk8s.yourdomain.com #<-- 这里
```

最后重新生成一下certificates
```
sudo microk8s refresh-certs
```

现在回到工作机上，可以看到kubectl已经可以返回正确的信息了
```
~$ kubectl get all
NAME                 TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.152.183.1   <none>        443/TCP   6h41m
```

## 配置 Service account / Jenkins slave

Jenkins可以使用k8s的资源，按需启动一个pod作为slave执行一个job, 之后销毁。授权Jenkins master控制k8s的资源就需要用service account.

### 创建service account
```shell
kubectl create namespace jenkins
kubectl create serviceaccount jenkins --namespace=jenkins
kubectl create rolebinding jenkins-admin-binding --clusterrole=admin --serviceaccount=jenkins:jenkins --namespace=jenkins
```

### 获取service account token
```shell
kubectl -n jenkins get secret $(kubectl -n jenkins get sa/jenkins -o jsonpath="{.secrets[0].name}") -o go-template="{{.data.token | base64decode}}"
```
注意mac系统下会看结尾有一个`%`, 这不是token的一部分。

在Jenkins的Nodes -> Configure Cloud -> Kubernetes cloud detail里，Credential设置为这个token.