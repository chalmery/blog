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
commands   列出所有可用的 jenv 命令
local       设置或显示本地应用程序特定的 Java 版本
global     设置或显示全局 Java 版本
shell      设置或显示 shell 特定的 Java 版本
rehash      刷新 jenv shims（安装可执行文件后运行此命令）
version     显示当前Java版本及其来源
versions    列出 jenv 可用的所有 Java 版本
which      显示可执行文件的完整路径
whence     列出包含给定可执行文件的所有 Java 版本
add         添加 将 JDK 添加到 jenv 中
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
