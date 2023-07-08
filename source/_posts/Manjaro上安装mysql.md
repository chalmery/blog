---
title: Manjaro上安装mysql
categories:
  - Linux
tags:
  - Linux
toc: true
---

## 一 下载mysql

无论是使用自带商店，还是pacman,yay都是可以的

![image-20220312145320693](https://img.yangcc.top/img/image-20220312145320693.png)

## 二 配置

1. 打开终端初始化mysql：复制日志中打印的随机密码

```sh
sudo mysqld --initialize --user=mysql --basedir=/usr --datadir=/var/lib/mysql
```

2. 然后启动mysql

```sh
1.首先启动MySQL
sudo systemctl start mysqld
2.登录
mysql -u root -p
3.修改密码
ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'root';
4. 开机自启
sudo systemctl enable mysqld.service
```

3. 添加环境变量

```sh
1.编辑profile文件，配置环境变量
export MYSQL_HOME=/usr/local/mysql
export PATH=$PATH:$MYSQL_HOME/bin
2.立即生效
source /etc/profile
```

4. 重启服务

```sh
sudo systemctl restart mysqld
mysql -u root -p 
```

