---
sidebar_position: 2
title: lisp
---

## 只是个笔记

- [柯里化的前生今世（二）：括号神教](https://zhuanlan.zhihu.com/p/34063576)
- [柯里化的前生今世（三）：语言和同像性](https://zhuanlan.zhihu.com/p/34063805)

写得真好哇

> The limits of your languages are the limits of your world.
>
> 只会一种语言，会限制你的视野，很难有机会去接触那些有趣的想法。
>
> 语言是表达思想的工具，而有想法的人未必用我们熟知的语言去表达。
>
> 所以，我们就不得不多学一些。



> 1. Elisp，是Emacs编辑器支持的脚本语言，可以用elisp扩展Emacs的功能。由于lisp方言强大的表达能力，以及Emacs优雅的架构，让Emacs获得了“神之编辑器”的称号。
>
> 2. Clojure，运行在JVM上的另一种语言，Java是另一种。Clojure对并行和并发的支持，有自己的方式，在并发方面上，它没有提供线程和锁，而是提供了其他4种方式，Vars, Refs, Agents and Atoms。
>
> 3. Common Lisp，是商业级的Lisp方言，规范长达1000多页。有LispWorks，Allegro CL这些强大的IDE。Common Lisp不支持hygienic macro，在编写宏的时候，容易出现意外的捕获。不过，这也增加了灵活性和表现力。除此之外，Common Lisp还支持Reader macro，和Racket的#reader有异曲同工之妙。
>
> 4. Scheme，是一门力求简洁的Lisp方言，它首次提出了闭包的概念，提出了first-class continuation，提出了hygienic macro，然而它最新的R7RS规范包括最后的附录才只有88页。

> DrRacket
>
> Racket，原名PLT Scheme，在Scheme基础上增加了对象、类型、惰性求值等。
>
> 它提供了一个IDE，称为Doctor Racket，简称DrRacket，自带丰富的第三方库，如web服务器、数据库、GUI、图像处理等。

## 目标语言和元语言

> 对象语言与元语言是相对而言的。

![](https://s2.loli.net/2022/07/28/DE8GU9lQjZ4LKRW.png)

## 形式语言

> 所谓形式语言，指的是用精确的数学，或机器可处理的公式，定义的语言。


> 当初，为了研究语言的性质，人们从两个角度出发，
>
> 一个是从语言的识别角度来看，提出了自动机理论。
>
> 另一个是从语言的生成角度来看，有乔姆斯基开创的形式语言理论。
>
> 这两个理论之间，又是互相关联的。

![](https://s2.loli.net/2022/07/28/ag9rw5CqMzFYhtj.png)

## BNF

> 一个语言的所有终结符，非终结符，产生式，开始符号，构成了这个语言的文法。

## 语言的分类

> 乔姆斯基，根据语言文法产生式的特点，把语言分为了4类。
>
> 不同的文法，能描述不同范围的语言集合，虽然它们都是无限集。
>
> - 0型文法，能力最强，可以产生递归可枚举语言。
> - 1型文法，能力稍弱，可以产生上下文有关语言。
> - 2型文法，能力次之，可以产生上下文无关语言。
> - 3型文法，能力最弱，可以产生正则语言。

> 确实，正则表达式，是正则文法的便利写法。
>
> 正则表达式所描述的语言，就是正则语言。

哇，震撼到我了

## S表达式

这是二叉树

```
     *
   /   \
  *     *
 / \   / \
a   b c   d
```

这是点对

```
((a . b) . (c . d))
```

S表达式是点对表示法的形式定义：

```
Atom ::= Num | Symbol
S-exp ::= Atom | "(" S-exp "." S-exp ")"
```

这是S表达式的化简规则，是语法糖

```
(a . (b . c)) => (a b . c)
(a . (b . nil)) => (a b . nil) => (a b)
```

## 同像性

> 同像性，指的是程序和程序所操作的数据采用了统一编码。

> 这种代码层面的转换称为“宏”(macro)。

## 引用

用来区分程序与数据