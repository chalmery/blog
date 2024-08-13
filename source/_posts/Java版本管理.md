---
title: Java版本管理
categories:
  - 工具
tags:
  - Java
toc: true
abbrlink: 2427860074
date: 2023-07-15 00:00:00
updated: 2023-07-15 00:00:00
---

在接触前端的时候发现了nvm这样的工具，可以一行命令切换使用的node版本，非常方便，作为一个Java程序员，java是否有版本管理工具呢？

## [jenv](https://www.jenv.be/)

> 官网的解释: jEnv is a command line tool to help you forget how to set the JAVA_HOME environment variable
>
> 使用一条命令可以轻松配置JAVA_HOME到环境变量。

用法是：

```shell
jenv <command> [<args>]
# 命令参考：
list                  列出所有添加的版本
add name path         添加 将 JDK 添加到 jenv 中
change name           改变版本为指定名称的jdk
```

## archlinuxjdk

在 archlinux 中提供了命令：archlinuxjdk用来管理jdk版本，参考 [archwiki](https://wiki.archlinuxcn.org/wiki/Java#%E5%9C%A8JVM%E9%97%B4%E5%88%87%E6%8D%A2)

```shell
archlinux-java <COMMAND>

COMMAND:
status                    列出已安装并启用的 Java 环境
get                          返回设置为默认的 Java 环境的短名称
set <JAVA_ENV>	强制 <JAVA_ENV> 设置为默认值
unset	                取消当前默认 Java 环境
fix	                       修复无效/损坏的默认 Java 环境配置
```
