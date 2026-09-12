---
title: Rust学习(一)：猜数字游戏
categories:
  - 技术
tags:
  - Rust
toc: true
abbrlink: 2690763544
date: 2022-03-14 00:00:00
updated: 2022-03-14 00:00:00
---
## 一 Rust安装

Rust安装极为简单，先下载rustup

![image-20220314220250790](https://img-yangcc.oss-cn-beijing.aliyuncs.com/blog/image-20220314220250790.png)

之后使用命令下载：

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

在vscode下载插件 `rust-analyzer`即可快速开发

![image-20220314220452099](https://img-yangcc.oss-cn-beijing.aliyuncs.com/blog/image-20220314220452099.png)

## 二 cargo

cargo就是rust的包管理工具，与npm,maven等是一样的，一般rustup来安装rust会自带cargo，常见命令如下

```sh
# 创建一个catgo项目
cargo new 项目
# 编译和执行结果，可以用来检验是否编写错误
cargo run 
# 发布的构建，编译会优化，代码更快，但是编译时间更长
cargo build --release
# 普通的构建
cargo build
```

## 三 猜数字游戏

```rust
use rand::Rng;
use std::cmp::Ordering; //Ordering是一个枚举类型
use std::io; //Rng是一个trait 可以认为是接口
             //rust默认会倒入prelude这个模块
fn main() {
    println!("猜一个数字");
    //i32 u32 i64 都是整形
    let number = rand::thread_rng().gen_range(1..101);
    // loop表示无限循环
    loop {
        let mut guess = String::new();
        // io函数读取输  使用expect方法，表示如果result是err则执行
        io::stdin().read_line(&mut guess).expect("无法读取行");

        //将字符串转为整形 parse方法返回中为Result
        // 隐藏shadow 隐藏重名的旧变量，从18行开始，变量guess类型就变了
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            //_：此通配符表示不关心这个值
            Err(_) => continue,
        };

        println!("你猜测的数是：{}", guess);

        //match表达式：可以让我们根据 枚举值选择不同的操作，就相当于if else
        //cmp就是compere，比较的意思
        match guess.cmp(&number) {
            //三个枚举分别表示小大等
            Ordering::Less => println!("Too Small!"),
            Ordering::Greater => println!("Too Big!"),
            Ordering::Equal => {
                println!("You Win!");
                break;
            }
        }
    }
}
```

参考：

[Rust教程]: https://www.bilibili.com/video/BV1hp4y1k7SV?p=8&spm_id_from=pageDriver
