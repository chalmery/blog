---
title: Rust学习(二)：所有权
categories:
  - Rust
tags: 
  - Rust
toc: true


date: 2022-05-14 00:00:00
updated: 2022-05-14 00:00:00
---
## 1 栈和堆

> 现代处理器在内存中跳转越少就越快

栈内存(`所有存放在栈内存的数据必须有已知的固定的大小`)

* 因为放入栈的数据大小都是固定的，因此入栈的时候很快，因为挨着放就行了

堆内存（heap）

* 编译时大小未知，或者程序运行时会变化的数据存放在 `堆`
* 堆对于内存的组织性差一些，因为大小不固定，或者会改变，因此，需要分配空间，而这就需要操作系统去找到一块足够大的空间
* 访问数据的时候也更慢，因为有个寻址的过程

函数调用

在调用函数的时候，会将函数的入参传入函数，包括入参的指针信息，然后，函数的这些参数信息会压栈，等执行完成会出栈

## 2  所有权的规则

> 所有权存在的原因就是因为上面的堆内存，因为这块是不确定的，有的是需要回收的。

所有权（系统）是 Rust 最为与众不同的特性，对语言的其他部分有着深刻含义。它让 Rust 无需垃圾回收（garbage collector）即可保障内存安全，因此理解 Rust 中所有权如何工作是十分重要的。本章，我们将讲到所有权以及相关功能：借用（borrowing）、slice 以及 Rust 如何在内存中布局数据

* 每个值都有一个变量，这个变量就是该值的所有者
* 每个值，同时只能有一个所有者
* 当所有者超出作用域的时候，这个值会被删除

定义一个字符串hello，其内存结构是这样的

![image.png](https://img.yangcc.top/img/image-20220511222035-ei8rafo.png)

而当将携带此字符串值的变量s1赋值给s2的时候，s1在栈中就不可用,失效了，不同于浅拷贝，这种方式被称为移动（Move）

而如果需要实现深拷贝的功能的话，则需要实现 `clone`方法，类似java

而针对栈上面的数据比如基本类型：整数，布尔，浮点数，字符等是放在栈上的，不需要拷贝这些东西，因此引出了 `复制`的概念：

```rust
let x = 5
let y = x
// 到这里其实x和y都是有效的，因为是放在栈上的数据，对这些数据的复制操作是默认执行的 
```

rust提供了 `Copy trait(复制 接口)`

* 如果一个类型实现了这个接口，那么旧的变量在值茶u年底后还是有效的，类似上面的代码
* 如果一个类型，或者这个类型的一部分实现了 `Drop trait(释放 接口)`，那么这个类型就不允许去实现 `Copy trait(复制 接口)`了

实现了复制接口的有：

* 整数类型，布尔，字符，浮点，Tuple(这个元组内的所有类型都是实现了复制接口)

### 2. 1 所有权和函数

将值赋给函数或者变量，在语义是其实是一样的：

```rust
fun main(){
  let s = String::from("hello")

  take1(s)
// s 在这里就失效了，因为传递给方法了

  let x = 5

  take2(x)
// 在这里x依然是有效的，因为传递给方法的仅仅是副本
}
fun take1(str:String){
 println!("{}",str)
}//方法执行结束，会释放str所在的堆内存

fun take2(num:i32){
 println!("{}",num)
}//什么也不会发生

```

一个变量的所有权总是符合这样的模式：

* 把一个值赋给变量的时候就会发生移动（Move）
* 包含这个堆数据的变量离开作用域，值就会被drap函数清理，除非数据的所有权移动到另一个变量了

如何让，一个函数使用一个值，但是不拥有所有权呢？

* 简单但麻烦的方式，就是返回一个元组，将入参原封不动的返回
* 使用Rust的特性 `引用（Reference）`

### 2.2 引用

使用 `&`符号，表示使用这个值，但是不获得其所有权

```rust
fn main(){
    let s1 = String::from("Hello");
    let len = get_lenth(&s1);

    println!("{} length is {}",s1,len);
}

fn get_lenth(s: &String) -> usize {
    s.len()
}
```

这段代码在内存中的形式是这样的：

* s表示一个指针，这个指针指向另一个指针s1,s1指向堆内存

![image.png](https://img.yangcc.top/img/image-20220511232030-kg9held.png)

而引用的内容，是否可以修改呢？，我们尝试在上面的方法内修改变量，会报如下的错：

> s.push_str(", World");
> |     ^^^^^^^^^^^^^^^^^^^^^ `s` is a `&` reference, so the data it refers to cannot be borrowed as mutable
>
> （S是引用，所以它引用的数据不能作为可变数据来借用）

因为引用，也是存放在栈上的，和变量一样是不可变的，而变量可以通过 `mut`来表示可变变量，那引用呢？答案是可以的：

```rust
fn main(){
//首先这个变量是可变的
    let mut s1 = String::from("Hello");
//其次，这个引用也得是可变的
    let len = get_lenth(&mut s1);

    println!("{} length is {}",s1,len);
}
// 方法的入参也得是可变的
fn get_lenth(s: &mut String) -> usize {
    s.push_str(", World");
    s.len()
}
```

#### 1 可变引用

可变引用的限制：

* 在一个作用域内，对于某块数据，只能有一个可变引用

这样做的好处有就是在编译的时候防止 `数据竞争`，以下三种情况都满足的情况会发生数据竞争

* 多个指针同时访问一个数据
* 至少有一个指针用于写入数据
* 没有任何机制来同步对数据的访问

但是我们可以通过创建作用域的方式，来允许非同时创建多个可变引用

```rust
fn main(){
    let mut s = String::from("Hello");
    {
        let m1 = &mut s;
    }

    let m2 = &mut s;
}
```

 还有一个限制：

> 不可以同时拥有一个可变引用和不可变引用

#### 2 悬空指针

`悬空指针(Dangling Pointer)`，或者叫野指针，指向内存一个地址，但是这块内存已经被回收了，甚至已经分配给别人了，而Rust永远不会出现这个问题

* Rust保证了，在引用一个数据的时候，编译器会保证，在引用离开作用域之前，数据不会离开作用域

```rust
fn main(){
    let s = dangle();
}
//这里会报错
fn dangle() -> &String {
    let str = String::from("hello");
    &str
}
```

上面的代码编译会报错，因为str在方法结束就销毁了，而str的引用却返回了，也就是出现了野指针，这样在rust编译会不通过的

## 3 切片

Rust的一种 `不持有所有权`的数据类型，英文slice，可以用于解决下面的问题

### 小例子

返回第一个空格的下标，这里其实是有问题的，因为，这个index是不合字符串s绑定的，表示的只是之前算过的值，而不是当前的值，可以看到仅仅是返回一个空格下标这么多代码，还有bug

```rust
fn main(){
    let s = String::from("Hello World");
    let index = first_world(&s);

    s.clear();
    println!("{}",index);
}

fn first_world(str : &String) ->usize{
    let bytes = str.as_bytes();
    // iter会返回一个迭代器
    // enumerate会将迭代器包装为一个元组，1 索引， 2 元素的引用
    for (i,&item) in bytes.iter().enumerate() {
        if item == b' ' {
            return  i;
        }  
    }
    str.len()
}

```

### 字符串切片

左闭右开的语法：以及部分语法糖

```rust
fn main(){
    let  s = String::from("Hello World");
    let h1 = &s[0..5];
    let w1 = &s[6..11];
    //语法糖
    let h2 = &s[..5];
    let w2 = &s[6..];
    let all = &s[..];
}

```

字符串切片在内存中的结构，指向堆内存数据的一部分

![image.png](https://img.yangcc.top/img/image-20220514114501-m8cf3p5.png)

改造之前的小例子，使其返回一个字符串切片,字符串切片的类型标识为：&str

```rust
fn main(){
    let  s = String::from("Hello World");
    let str = first_world(&s);
    println!("{}",str);
}

fn first_world(s: &String) ->&str{
    let bytes = s.as_bytes();
    // iter会返回一个迭代器
    // enumerate会将迭代器包装为一个元组，1 索引， 2 元素的引用
    for (i,&item) in bytes.iter().enumerate() {
        if item == b' ' {
            return  &s[..i];
        }  
    }
    &s[..]
}
```

### 字符串字面值

字符串字面值，是什么类型的呢，没错就是切片

![image.png](https://img.yangcc.top/img/image-20220514120104-h08z6ie.png)

### 将切片作为参数

之前的例子都是字符串引用作为入参：

```rust
fn first_world(s: &String) ->&str{
}
```

其实，可以使用切片作为入参，这样切片可以作为入参，二字符串可以传入完整的切片，入参更为多样了。因为切片还是一种引用嘛，一样的

[Rust教程]: https://www.bilibili.com/video/BV1hp4y1k7SV?p=8&spm_id_from=pageDriver
