---
title: Volatile关键字
categories:
  - 技术
tags:
  - Java
toc: true
abbrlink: 1069363226
date: 2021-08-12 00:00:00
updated: 2021-08-12 00:00:00
---
### 1 内存模型

#### 缓存不一致问题

计算机在执行程序时，每条指令都是在CPU中执行的，而执行指令过程中，势必涉及到数据的读取和写入。由于程序运行过程中的临时数据是存放在主存（物理内存）当中的，这时就存在一个问题，由于CPU执行速度很快，而从内存读取数据和向内存写入数据的过程跟CPU执行指令的速度比起来要慢的多，因此如果任何时候对数据的操作都要通过和内存的交互来进行，会大大降低指令执行的速度。因此在CPU里面就有了高速缓存。

也就是，当程序在运行过程中，`会将运算需要的数据从主存复制一份到CPU的高速缓存当中`，那么CPU进行计算时就可以直接从它的高速缓存读取数据和向其中写入数据，当运算结束之后，再将高速缓存中的数据刷新到主存当中。

比如有一段代码：

```java
// 理想情况是两个线程都执行一次，最后的结果为2
i = i +1;
```

此代码在单线程执行没有任何问题,而在多线程运行会被覆盖。

```tex
线程1：
读取i=0放到高速缓冲区 ——> i+1 ——> 刷线数据到主存，i=1
线程2：
读取i=0放到高速缓冲区 ——> i+1 ——> 刷线数据到主存，i=1
```

> 因为在多核心cpu中每个线程可能运行于不同的cpu，因此有可能每个线程的高速缓存不是同一个。
>
> 而单核心cpu，是线程调度的，要么分时执行，要么抢占执行，但结果和多核心都是一样的。

---

#### 解决方式

为了解决缓存不一致性问题，通常来说有以下2种解决方法：这2种方式都是 `硬件`层面上提供的方式。

* 通过在总线加LOCK锁的方式

在早期的CPU当中，是通过在总线上加LOCK锁的形式来解决缓存不一致的问题。因为CPU和其他部件进行通信都是通过总线来进行的，如果对总线加LOCK锁的话，也就是说阻塞了其他CPU对其他部件访问（如内存），从而使得只能有一个 `CPU能使用这个变量的内存`。

* 通过缓存一致性协议

上面的方式会有一个问题，由于在锁住总线期间，其他CPU无法访问内存，导致 `效率低下`。所以就出现了缓存一致性协议。最出名的就是Intel 的MESI协议，MESI协议保证了每个缓存中使用的共享变量的副本是一致的。它核心的思想是：当CPU写数据时，如果发现操作的变量是共享变量，即在其他CPU中也存在该变量的副本，会发出信号通知其他CPU将该变量的缓存行置为无效状态，因此当其他CPU需要读取这个变量时，发现自己缓存中缓存该变量的缓存行是无效的，那么它就会从内存重新读取。

### 2 并发编程

#### 原子性

与数据库那个原子性一个概念，就是两个操作是一体的，要么都执行，要么都不执行

#### 可见性

当多个线程访问同一个变量的时候，一个线程修改了值，另外的线程能够立刻看到修改的值

#### 有序性

程序是按照代码的顺序执行的，但JVM在真正执行这段代码的时候不一定能保证是按照顺序执行的，因为可能发生 `指令重排序（Instruction Reorder）`

> 处理器为了提高程序运行效率，可能会对输入代码进行 `优化`，它不保证程序中各个语句的执行先后顺序同代码中的顺序一致，但是它会保证程序最终执行结果和代码顺序执行的结果是一致的。
>
> 而处理器在进行重排序时是会考虑指令之间的数据依赖性，如果指定2必须要用到指令1，则指令1一定会在指令2之前运行的。`指令重排序不会影响单个线程的执行，但是会影响到线程并发执行的正确性。`

想要让程序正常的执行，必须要保证满足这三个条件

### 3 java内存模型

> 在Java虚拟机规范中试图定义一种 `Java内存模型（Java Memory Model，JMM）`来屏蔽各个硬件平台和操作系统的内存访问差异，以实现让Java程序在各种平台下都能达到一致的内存访问效果。它定义了程序中变量的访问规则，往大一点说是定义了程序执行的次序。注意，为了获得较好的执行性能，Java内存模型并没有限制执行引擎使用处理器的寄存器或者高速缓存来提升指令执行速度，也没有限制编译器对指令进行重排序。也就是说，`在java内存模型中，也会存在缓存一致性问题和指令重排序的问题`。Java内存模型规定所有的变量都是存在主存当中（类似于前面说的物理内存），每个线程都有自己的工作内存（类似于前面的高速缓存）。线程对变量的所有操作都必须在工作内存中进行，而不能直接对主存进行操作。并且每个线程不能访问其他线程的工作内存。

总结来说JVM中每个线程都有自己独立的虚拟机栈来执行自己的方法，这样如同操作系统的高速缓冲一样，存在可见性问题。

### 4 如何保证三个特性

#### 原子性

```java
x =8;
y = x;  // 包含两步，读取x值，赋值给y
x++;    // 包含三步，读取x值，x+1，赋值给x
x = x+1;
```

上面四个操作只有操作1是原子操作，java中只有 `赋值`，和 `读取值`是原子操作，如果要保证多个操作整体具有原子性，需要同步或者锁来实现(synchronized和Lock)

#### 可见性

对于可见性，Java提供了volatile关键字来保证可见性。当一个共享变量被volatile修饰时，它会保证修改的值会立即被更新到主存，当有其他线程需要读取时，它会去内存中读取新值。

另外，还可通过synchronized和Lock也能够保证可见性，synchronized和Lock能保证同一时刻只有一个线程获取锁然后执行同步代码，并且在释放锁之前会将对变量的修改刷新到主存当中。因此可以保证可见性。

#### 有序性

在Java内存模型中，允许编译器和处理器对指令进行重排序，单线程程序没有问题，多线程会出现有序性问题。

> Java内存模型具备一些先天的“有序性”，即不需要通过任何手段就能够得到保证的有序性，这个通常也称为 `happens-before 原则`。如果两个操作的执行次序无法从happens-before原则推导出来，那么它们就不能保证它们的有序性，虚拟机可以随意地对它们进行重排序。
>
> 下面就来具体介绍下happens-before原则（先行发生原则）：
>
> * 程序次序规则：一个线程内，按照代码顺序，书写在前面的操作先行发生于书写在后面的操作
>
> - 锁定规则：一个unLock操作先行发生于后面对同一个锁额lock操作
> - volatile变量规则：对一个变量的写操作先行发生于后面对这个变量的读操作
> - 传递规则：如果操作A先行发生于操作B，而操作B又先行发生于操作C，则可以得出操作A先行发生于操作C

## 二 JUC

### 1 关键字

#### volatile

一个变量被此关键字修饰后就具备了如下特点：

* 保证了不同线程对这个变量进行操作时的 `可见性`，当一个变量被volatile修饰时，那么对它的修改会立刻刷新到主存,当其它线程需要读取该变量时，会去内存中读取新值。
* 禁止进行指令重排序。

使用volatile关键字并不能保证原子性，如下这段代码，输出的值很随机，正常应该是10000才对。

因为 `a++`这个代码不是原子性的，包含几个步骤：读取,加1，写入内存，三步。因此，此段代码就有可能这样执行：

> 某个时刻  a = 10
>
> 线程1 ——> 读取a=10 a自增
>
> 线程2 ——> 读取到a=10 然后因为此时有别的线程正在进行修改，因此进入阻塞状态
>
> 线程3 ——> 此时恰好修改a值那个线程结束了，因此读到是内存中的a = 11，然和进行自增操作为 a=12
>
> 线程2 ——> 接着对a进行自增操作,a=11
>
> 这样三个线程自增结果却只+1，原因就在于自增操作不是原子的

```java
public class Test0 {
    public  volatile int a  =0;
    // 自增操作
    public  void setA(){
        a++;
    }
    // 10个线程每个线程让a+1，1000次
    public static void main(String[] args) {
        Test0 test = new Test0();
        for (int i = 0; i < 10; i++) {
            new Thread(new Runnable() {
                @Override
                public  void run() {
                    for (int j = 0; j <1000; j++) {
                        test.setA();
                    }

                }
            }).start();
        }
        Thread.sleep(2000); // 保证上面执行完成
        System.out.println(test.a); // 数值随机
    }
}
```

有三种方式来解决原子性问题：

```java
// 1 同步
public synchronized void setA(){
    a++;
}
// 2 锁
private Lock lock = new ReentrantLock();
public  void setA(){
    lock.lock();
    a++;
    lock.unlock();
}
// 3 原子整数
public AtomicInteger a = new AtomicInteger();
public  void setA(){
    a.getAndIncrement();
}
```

原理和实现机制

> 　　下面这段话摘自《深入理解Java虚拟机》：
>
> 　　“观察加入volatile关键字和没有加入volatile关键字时所生成的汇编代码发现，加入volatile关键字时，会多出一个lock前缀指令”
>
> 　　lock前缀指令实际上相当于一个内存屏障（也成内存栅栏），内存屏障会提供3个功能：
>
> 　　1）它确保指令重排序时不会把其后面的指令排到内存屏障之前的位置，也不会把前面的指令排到内存屏障的后面；即在执行到内存屏障这句指令时，在它前面的操作已经全部完成；
>
> 　　2）它会强制将对缓存的修改操作立即写入主存；
>
> 　　3）如果是写操作，它会导致其他CPU中对应的缓存行无效。

使用场景

1. 单例模式

```java
// 双重检查锁定模式 （Double check locked）
public class Test4 {
    private volatile static Test4 test4 ;
    private Test4(){};

    public static Test4 getTest4() {
        if (test4==null){
            synchronized (Test4.class){
                if (test4==null){
                    test4 = new Test4();
                }
            }
        }
        return test4;
    }
}
```

刚开始是有疑问的，感觉volatile关键字根本没必要呀，其实是为了禁止指令重排，保证 `test4 = new Test4()`顺序执行，创建对象并赋值有如下的虚拟机指令：

```
0: new   // 创建一个对象，在堆内开辟空间，并将地址放入虚拟机栈顶            
3: dup   // 复制操作数栈顶值，并将其压入栈顶，也就是说此时操作数栈上有连续相同的两个对象地址；
4: invokespecial #3 //执行构造方法             
7: astore_1 // 将地址赋值
```

1. 创建对象分配堆空间
2. 执行构造方法
3. 将对象地址赋值给变量

上面这三个步骤，2，3是依赖一的，所以2，3一定会在1之后执行，而2，3可能会因为指令重排而发生 `3执行在2之前`，因此可能会出现下面的情况：

|   | 线程1                | 线程2                 |
| - | -------------------- | --------------------- |
| 1 | 判断是否为null(true) |                       |
| 2 | 获取锁               |                       |
| 3 | 判断是否为null(true) |                       |
| 4 | 发生指令重排         |                       |
| 5 | 创建对象             |                       |
| 6 | 将对象地址赋值给变量 | 判断是否为null(false) |
| 7 |                      | return                |
| 8 | 执行构造方法         |                       |

在线程1执行构造方法之前，线程2直接将没有初始化的地址返回了，因此线程2要执行操作的时候会出现问题，比如线程1在构造方法对成员变量进行赋值，而线程2获取时候发现还是默认值。

因此volatile的重要性就体现出来了，禁止指令重排序将保证上述问题不会发生。

## 参考

[Java并发编程：volatile关键字解析 - Matrix海子](https://www.cnblogs.com/dolphin0520/p/3920373.html)

[双重检查锁单例模式为什么要用volatile关键字？](https://www.cnblogs.com/zhuifeng523/p/11360012.html)
