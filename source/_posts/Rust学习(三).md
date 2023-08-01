---
title: Rust学习(三)：结构体枚举和模式匹配
categories:
  - 技术
tags:
  - Rust
toc: true
abbrlink: 379577363
date: 2022-05-15 00:00:00
updated: 2022-05-15 00:00:00
---
## 1 Struct

结构体实例化的顺序可以不与定义时候一样，但是所有属性都得实例化。结构体实例声明为可变的时候其所有属性都是可变的。

### 基本的结构体

声明一个结构体

```rust
struct User{
    name : String,
    email : String,
    sign_in_count : u64,
    archive : bool,
}

fn main(){
    let mut  user = User{
        email : String::from("ycc@123.com"),
        name : String::from("ycc"),
        sign_in_count : 1,
        archive : false,
    };
    println!("{}",user.email);
}
```

struct作为函数的返回值：

```rust
fn fun()-> User{
    User{
        email : String::from("ycc@123.com"),
        name : String::from("ycc"),
        sign_in_count : 1,
        archive : false,
    };
}
```

字段初始化简写的方式，省略赋值的操作

```rust
fn build_user(name:String,email:String) ->User{
    User{
        // email : email,
        // name : name,
        email,
        name,
        sign_in_count : 1,
        archive : false,
    };
}
```

当想基于一个struct来创建一个新的struct的时候，可以使用下面的语法糖：

```rust
fn main(){
    let user1 = User{
        email : String::from("ycc@123.com"),
        name : String::from("ycc"),
        sign_in_count : 1,
        archive : false,
    };
    let user2 = User{
        email : String::from("233@gmail.com"),
        ..user1
    };
}
```

### Tuple Struct

元组结构体，适用于给tuple分类型，让这个元组不同于其他的元组，比如可以声明一个元组结构体来描述，颜色RGB，正方形，圆。。。等等

先复习下元组：元组内可以放入不同类型的值

```rust
fn main(){
    let trple = (1,"a",3); // 元组
    let (a,b,c) = trple; // 解构
    println!("{}",a)
}
```

元组结构体：

```rust
fn main(){
    // 元组结构体
    let white = Color(0,0,0);
    let orange = Color(2,5,1);
}
struct Color(i32,i32,i32);
```

### 没有任何字段的Struct

可以定义一个没有任何内容的struct，叫做 `Unit-like struct`，可以实现抽象的描述，但是又不需要存储元素内容的场景可以适用。

### struct的所有权

Struct里面可以放数据，也可以放引用（生命周期），生命周期保证只要struct实例是有效的，那么里面的引用就是有效的，如果使用引用却不使用生命周期就会报错

### 小例子

实现计算矩形的面积：

```rust
struct Rectangle {
    length: u32,
    width: u32,
}
fn get_area(r : &Rectangle) -> u32 {
    r.length * r.width
}
fn main() {
    let r = Rectangle{
        length:10,
        width:10,
    };
    let area = get_area(&r);
    println!("{}",area);
}
```

注意这里传入的是结构体的引用，因此，在 方法执行结束，main方法依然有 Rectangle的实例r的所有权，因此还可以打印：

```rust
println!("{}",r)
```

但如果直接这么打印编译会报错：提示没有实现这个接口，或则使用第二种方法

> = help: the trait `std::fmt::Display` is not implemented for `Rectangle`
> = note: in format strings you may be able to use `{:?}` (or {:#?} for pretty-print) instead

而当你使用第二种方式打印的话还会报错：

```rust
println!("{:?}",r)
println!("{:#?}",r) //美化打印
```

提示你没有时间Debug接口，或者使用这个注解，放在结构体上面，

> = help: the trait `Debug` is not implemented for `Rectangle`
> = note: add `#[derive(Debug)]` to `Rectangle` or manually `impl Debug for Rectangle`

### 方法

方法表示与这个结构体有关的函数，使用关键字 `impl`来表示，可以有很多个代码快，除了特别的方法，一般的方法第一个参数总是自己，用 `&self`表示,方法调用可以省略自身的引用入参

* self 可以是 借用：`&self`，也可以是：`safe`表示获取所有权，也可以是可变的，也就是说和普通的参数没啥区别

```rust
impl Rectangle {
    fn get_area(&self) -> u32 {
        self.length * self.width
    }
}
fn main() {
    let r = Rectangle{
        length:10,
        width:10,
    };
    let area = r.get_area();
    println!("{}",area);
}

```

方法调用的运算符

在c/c++中方法调用，是这样的：object->someting() 和 (*object).someting()这两者等价

* object是个指针，星号表示解指针，变为对象
* Rust提供了自动的引用，或者解引用，在调用方法的时候，rust会自动的补上，&，& mut 等，来匹配上方法的入参

关联函数：

```rust
impl Rectangle {
    fn square(size:u32) -> Rectangle {
        Rectangle{
            length :size,
            width :size,
        }
    }
}

fn main() {
   // 关联函数的调用
    let squ = Rectangle::square(10);
    println!("{:#?}",squ)
}

```

## 2 枚举

定义一个枚举，不过看了半天，没有发现和java类似的那种常量形式的枚举定义方式

```rust
enum IP_ADDRESS{
    V4(String,u32),
    V6,
}
```

标准库的Option `<T>`枚举包含在预导入模块中的，可以直接使用，其结构为：

```rust
pub enum Option<T> {
    None,
    Some( T),
}
```

当想使用包裹着值的，y变量时候，提示需要转换才行，不能直接使用，这样就保证了空安全的情况

```rust
fn main() {
    let x : i8 = 5;
    let y : Option<i8> = Some(5);

    //let z = y.expect("i8");

    let sum = x + z;

    println!("{}",sum);
}
```

## 3 模式匹配

模式匹配必须穷举所有的可能，否则编译不予通过

```rust
fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => {
            println!("Lucky penny!");
            1
        }
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

附带值的模式匹配：

```rust
#[derive(Debug)] // 这样可以立刻看到州的名称
enum UsState {
    Alabama,
    Alaska,
    // --snip--
}

enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("State quarter from {:?}!", state);
            25
        }
    }
}
```

可以使用占位符 `-`来表示其他情况

```rust
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        _ => (),
    }
```

针对一种情况，可以使用if letif let，代码更为简洁

```rust
fn main(){
    let v = Some(1);
    match v {
        Some(3)=> println!("3"),
        _ => (),
    }
    //针对一种情况，可以使用if let
    if let Some(3) = v {
        println!("3")
    }

}
```
