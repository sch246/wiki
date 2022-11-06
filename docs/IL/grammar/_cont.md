---
sidebar_position: 4
title: continuation
---

import Cover from '@site/src/components/cover/main';

如何实现协程？

首先，协程是什么？

协程是异步的一种手段，那异步是什么？

异步是相对同步而言的，而所谓同步，就是只能将事情一件一件地执行

一次只能执行一件事情，并且必须等待这件事情执行完成后才能执行下一件事情

直到最后一件事情执行完毕，程序运行结束

当我们用同步的方式执行大量需要等待外界反应(io)的事情，例如等待网络相应，访问文件时，绝大部分时间都消耗在等待上，而不是程序的运行上

这是对资源的极大浪费，会严重影响效率

这时候我们采取的措施就叫异步

异步的手段有多种，多进程，多线程，以及协程都是异步，粒度从大到小，消耗也从大到小

协程仅仅是在代码块之间进行切换，不需要和操作系统打什么交道，但是同时也需要程序员的精准控制<Cover>(好像说得其它就不需要了一样)</Cover>

协程可以让不同任务在调度中异步运行，为此需要保存不同任务的运行状态，好在合适的时候继续

问题来了

任务怎么保存？怎么将运行到一半的程序的状态保存下来呢？

说到保存程序的运行状态，一定会想到 python 中的生成器: 通过在函数中插入`yield`，可以保存函数的运行状态

没错，至少在 python 中，初步的协程基于 `yield`

而 lisp 里面有个`cont`对象(`continuation`)，它可以用来实现`yield`

<details>
<summary>`yield`是什么？</summary>

- [知乎 - 如何理解Python中的yield用法?](https://zhuanlan.zhihu.com/p/268605982)
- [CSDN - yield( )函数的使用](https://blog.csdn.net/wordwarwordwar/article/details/85554847)

`yield`的用法和`return`类似

通过使用`yield`，可以让一段代码分多次运行，多次返回

运行一段，暂停，返回个值，什么时候在外面又需要了，继续运行，可能再返回个值

它可以用来生成`迭代器`

比如

```python
def gen(i=0):
    while True:
        yield i
        i += 1
```

外面每次运行都会得到下一个`i`

需要注意的是加了`yield`的函数就变成了`生成器`，调用它并不会运行函数，而是返回一个`迭代器`

继续调用`迭代器`才是运行函数中的代码块

</details>

## cont

- [知乎 - 什么是「continuation」？ - 脚趾头的回答](https://www.zhihu.com/question/61222322/answer/607650660)
- [知乎 - 如何解释 Lisp 中 call/cc 的概念？ - 脚趾头的回答](https://www.zhihu.com/question/21954238/answer/522888860)
- [知乎 - C 语言如何实现 continuation？ - TASKCTL的回答](https://www.zhihu.com/question/30918811/answer/1291388068)

:::caution

lisp中`cont`的使用是通过`call/cc`触发的，它会将当前局部变量的`cont`塞进它的参数(得是一个函数)中运行

我不知道为什么 lisp 里要这么做而不是直接返回`cont`，因此这里可能会有问题

:::

`cont`可以理解为`continue`的缩写，全名是`continuation`

你可以将它当作函数的`return`语句使用

接收一个值，结束当前运行，并且返回值到函数的调用处

但是不同的是，这个玩意可以作为对象传递，而返回的地方仍然不变

这意味着什么？它破坏了入栈出栈的规则，把调用栈变成了调用树

举个简单的例子

你在函数中把`cont`传递给其它函数，其它函数内部用它接收个值，就结束了一切直接返回到最开始的那个函数该返回的地方了

<Cover>你可能想到了尾递归优化，你没想错，事实确实如此</Cover>

你甚至可以用它将它自己返回出去，这会导致更加混沌的结果

举个例子，调用一个函数f，返回了它的`cont`，然后程序继续运行

运行了几段平平无奇的代码之后，突然，这个cont接收到了一个值

于是，即使是在函数外面，程序也中断了，世界回到了原来f该返回的位置，好像什么都没有发生过一样

除了这次返回的是那个值，而不是上一次返回的`cont`之外

<Cover>是不是感觉很神奇，确实就是那么神奇</Cover>

很显然，这个返回到原来位置的性质可以用来保存函数运行状态，可以用来实现`yield`

:::tip 补充一点

虽然上面一直是将它和函数一起说的，函数也确实可以带`cont`，不过要获得`cont`是可以用专门的操作符创建的

:::

## yield

在大致了解了`cont`之后，`yield` 应该怎么用它实现？

思路很简单，在函数内调用`yield`时，原地创建一个`cont`，并且和可能的值一起返回出去，让外面继续运行，等待外面调用这个`cont`，接收到一个值，函数内就可以继续运行了

有个小小的问题是，继续运行后，怎么返回到外面调用`cont`的地方？总不能出了函数继续从头运行吧？

那么对面也创建一个扔过来不就行了）

在外面调用函数内的`cont`时，原地创建一个`cont`，和值一起传过来，并且传过来之后，覆盖这个函数原本的`cont`，那么函数返回时就能够返回到正确的位置了

代码从一个地方分支，然后在不同的分支间互相传递`cont`，保证对面能返回到自己这边来，从而形成了调用树

## 调用树

如果直接把调用栈改成调用树的话，`cont`对象大概只需要记录当前运行到哪一段代码，以及当前在这个树的哪个位置

:::caution

实际上我目前为止的话语具有误导性，`cont`生成的并不是树，而是将栈，将函数运行状态复制一个

其真正含义是"执行程序剩下要做的事情"，是确实的跳跃"世界线"

不过管他呢，我寻思下面的栈共享也没啥坏处，我就这么搞了

在我的想法这里，`cont`严格来说不是"世界线"，它如果更改了树的主干，是可以影响到其它分叉上的

:::

把前面的例子画成图来看看

![cont返回自身](https://s2.loli.net/2022/10/25/82XoavHBzORGYAL.jpg)

这个`cont`是在调用`f`的位置创建的，在`f`内用`cont`返回了它自身

在外面运行一段时间后，第二次返回了一个值

![yield的实现](https://s2.loli.net/2022/10/25/NhgF1jUyIovGWR3.jpg)

这个是`yield`的示意，圆圈代表对应`cont`的位置

调用`f`，创建了灰色`cont`

`f`里面创建了蓝色`cont`并且用灰色`cont`返回

运行一些代码后创建了红色`cont`并且用蓝色`cont`返回到`f`里面

最后用红色`cont`返回

很显然树的末端必须有`cont`在当前的分支上面，否则意味着无法返回到这个位置，那么也就可以删掉了

这大概可以通过引用计数来完成

但是果然，将调用栈变成调用树还是太麻烦了，这意味着保存`cont`在树上的位置不能简单通过一个数字达成，以及栈变成树结构的其它什么麻烦

那么如果要保持基本的栈的形状的话，就意味着需要把分支上的变量字典存进`cont`对象里面

如果每次压栈都会创建一个`cont`。。。

它会需要存储，当前的局部变量字典(栈顶)，当前函数运行到了哪里

以及上一个`cont`，这样就能方便地寻找局部变量

保存上一个`cont`还形成了链表，保证上面一串的引用计数不会归零，除非这个`cont`已经不存在了——那也自然意味着这个分支没法跳转到，需要被删除

而调用`cont`时，可以检查当前的调用栈，找到重合的位置，从分支开始整个替换

到这里为止，整个栈已经被`cont`对象给上位替换了

![cont树](https://s2.loli.net/2022/10/25/jZdKJqv62TOLyND.jpg)

图中，当前栈在哪里取决于当前运行的程序在哪条分支上面，而其它分支需要以`cont`变量的形式存在

虽然栈变成了奇怪的东西，但是依旧可以正常运行，妙啊）

## cont与frame

咱看看`python`怎么实现`yield`的

- [知乎 - Python源码剖析--yield的实现原理](https://zhuanlan.zhihu.com/p/358035238)

其它太长不看

> gen_send_ex 会复用 frame对象，并记录它的 f_stacktop及f_lasti。这两个值是能够驱动generator迭代的核心机制。

`frame`，这玩意不就和我刚刚定义的`cont`几乎一模一样吗

- [bilibili - 【python】python的骨架frame——你写的代码都是运行在它里面的？](https://b23.tv/BV1iB4y1S7nT)

同样是每次调用函数都会创建，同样指向上一个对象，同样保存变量字典，同样保存当前执行到哪个位置。。。

就差个跳转到`frame`状态的方法了

## 尾递归优化

- [腾讯云 - 面试官：说一说递归如何优化-尾递归优化](https://cloud.tencent.com/developer/article/1694405)

我打算让函数的最后一项默认丢到函数的`cont`里，那这样怎么实现尾递归优化呢

如果要尾递归优化，就必须保证函数的最后一个要执行的动作是函数调用

如果`(cont (fun xx))`的解析是将后面的表达式求值再塞进`cont`的话，实际上就并没有做到这一点

不过可以将`cont`的行为硬编码啊

在用`frame`替代栈的情况下，想想函数调用时发生了什么(我这里就设定它们等价了):

依次求值后面的参数，创建新`frame`对象指向当前`frame`，将参数放进新`frame`的参数列表中

设置其`cont`为当前的`frame`，然后运行函数(这是错开一位的区别)

运行结束后，函数的`cont`(也就是上一层的`frame`)接收到一个值，于是读取其保存的位置，把值返回过去

思路就有了，当前的这个`frame`是不是可以当参数传进去

这大概就是`CPS`？

- [知乎 - 怎样理解 Continuation-passing style?](https://www.zhihu.com/question/20259086)

让函数的实现是CPS的形式的，当运行`cont`且后面的表达式是个函数调用时，就设定这个函数的`cont`为它本身，然后运行函数

函数的最后一行表达式自动加上函数本身的`cont`