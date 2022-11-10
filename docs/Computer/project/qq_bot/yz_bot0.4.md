---
sidebar_position: 2
title: 柚子bot0.4
---

import Cover from '@site/src/components/cover/main';

第三次重构，经历了从 ws 通信改成 http 通信又改成 ws 通信最后又改回 http 通信的过程

关于安装过程就省略了，在 github 的 README 有写，这里谈怎么使用

## 文件结构

使用这个 bot 会非常容易涉及到文件上的操作，毕竟可以通过 bot 远程影响它自身的运行方式

文件目录大概是这个结构

```
> _code         # bot自身的源代码，可编辑
> chatlog       # bot保存的聊天记录
> data          # bot存储的自身和用户的数据，可编辑
config.json     # bot的基础设定，不保存什么东西，与data的功能重合了，我考虑要不要删掉这个
run.py          # 启动bot的py脚本
```

`config.json`文件存储的是管理员(op)和 bot 自身的昵称(nickname)，都是列表

以`run.py`启动 bot 可以让 bot 有重启功能(手动使用.reboot)，很显然也可以直接使用`_code/main.py`启动 bot ，但是这样的话 bot 就没有重启功能了

> 重启功能是 bot 的重要功能，因为这样可以远程更改它的源代码并快速应用））

data下的文件结构如下，除了`pyload.py`之外，删掉不影响启动
```
v data
    v storage           # s3.storage 模块管理的区域
        > users         # bot.user_storage 模块管理的区域，是玩家的个人存储
        links.json      # .link 命令管理的links

    cache_msgs          # bot.cache 的消息存储，每个聊天范围只存储最近的256条
    pyload.py           # .py 命令初始化时会运行的文件
    tmp.txt             # 用!运行bash命令时的临时存储文件
    (reboot_greet.py)   # .reboot 命令运行时的临时存储，可能不存在
    (shutdown_greet.py) # .shutdown命令运行时的临时存储，可能不存在
```

然后是`_code`部分，这里是 bot 的源代码，但是也有用于编辑的部分

一般来讲需要添加功能都可以通过`.py`和`.link`来实现，，不过通过直接添加命令有时候可能更直观一些

```
v _code
    v bot               # bot相关的模块
        > cmds          # 定义bot的命令，以.开头，优先级比.link创建的高
        ...
    > s3                # 独立于bot也能有用的模块
    main.py             # bot真正的运行脚本，控制bot核心运行
```

### 添加命令的方法(可跳过)

`_code/bot/cmds`下的非`_`开头的 .py 文件都会被识别成命令，可以使用`.`作为开头进行调用

例如使用`.py`便可以调用`_code/bot/cmds/py.py`定义的命令

以下展示`.echo`命令是如何创建的

---

示例

```
user:
    .echo awa
bot:
    awa
```

新建`echo.py`，注意名字不是`.echo.py`而是`echo.py`，在里面写下这些

```python title="_code/bot/cmds/echo.py"
def run(body:str):
    return body.strip()
```

---

没了，就是这么简单

`.`开头的命令毫无疑问是文本消息，run 函数接收一个字符串作为参数，如果返回字符串，那么 bot 就会将字符串也作为文本消息返回到这个聊天的区域

这里的 body 是从命令名后面开始算起的字符串，例如直接使用

```
.echo a
```

那么 body 就是` a`，会包含中间的空格

所以 run 的第一步就是使用`strip()`或者`lstrip()`

...

有时候只有本条消息的文本字符串是远远不够的

不过没关系，你可以 import 啊

```python
from main import ...
```

> 外面的 run.py 并不是 bot 真正运行的地方，它只是为了支持`.reboot`命令，bot 直接运行的地方是`_code/main.py`，所以 import 是以它为基准的

cmds 里的命令都是在 bot 马上要运行阶段才被加载的，所以可以毫无顾忌地 import `main`里面的东东

而`main`把`bot`和`s3`模块里的东西几乎 import 了个遍，也不为啥，就为了方便引用

所以四舍五入下就是你可以在任何位置 import 几乎任何东西

<details>

<summary>常用</summary>

最常用的就是 `from main import cache` ，指`bot.cache`

通过`cache.get_last()`，可以获得最后一条被记录的消息字典，而在无异步的 bot 这里，就等价于是触发命令的这条消息字典

`cache.msgs`存储了bot存储的所有的消息字典，每个聊天区域的消息数不超过256条(默认)，这是它记录消息的核心

通过`cache.getlog(msg)`可以通过一条 msg 获取这个聊天区域的最近消息列表

:::tip

注意，消息列表的存储是最近的放在前面，如果消息列表是lst，那么最近的消息要使用`lst[0]`来获取

:::

`cache.ops`存储了 op 列表，`cache.nicknames`存储了 bot 的昵称列表

不过直接修改的话需要再使用`xx_save`函数来保存到`config.json`

`cache.qq``cache.name`分别存储了 bot 的 qq 号和 QQ名称(不是昵称)

`cache.names`存储的是 bot 的 QQ名称 加上昵称列表，所构成的名称列表

`get_one(msg,f,i)`用于在当前聊天区域的最近列表内查找满足条件的最近一条消息，反正别想当历史消息查找用就行了，`f`是一个函数，接收消息字典返回布尔值

其它的自己看源代码去

</details>

如果想要让 bot 能分条接收命令参数，使用`yield`

其它的已经自动处理好了）只要`run`函数返回的是个生成器，那么就会被处理

以下展示分条接收参数的命令如何创建

---

示例

```
user:
    .note
bot:
    输入note
user:
    哇
bot:
    记录成功
```

```python title="_code/bot/cmds/note.py"
...
def run(body:str):
    reply = yield '输入note'
    if not is_msg(reply):
        return '不是文本消息，命令终止'
    text = reply['message']
    _save_note(text)
    return '记录成功'
```

---

:::caution

需要注意的是，yield 后，同一个人在同一个地方发送的任何消息，包括`.`开头的命令，都会被阻塞接收作为 reply

同时`yield`也没办法接收另一个人，或者同一个人在另一个地方发送的消息

除非发送`^C`，以`^`开头的消息是唯一比阻塞优先级更高的，这将终止在这个位置的全部阻塞，而命令也不会再继续执行下去

:::

## 基本命令

### .test

基础命令，可以用来测试 bot 还在不在

### .echo

基础命令，用于复读用户发送的消息

### .reboot(需要权限)

用于远程重启 bot，重启后会应用对源代码的更改

bot 在运行期间不会读取源代码，也就是甚至可以在运行期间把`_code`文件夹删掉

但是如果重启时没有找到`_code`文件夹，或者更改后的源代码有错误，bot 会重启失败(废话)

重启后会发出问好

> 在 bot 运行时运行 python 代码`exit(233)`也可以达成重启的效果，只是会没有问好
>
> 用`.py`命令做不到上述效果，因为`.py`是多线程，`exit`只会关掉自己的线程

### .shutdown(需要权限)

同上，bot会在下次启动时发出问好

### .op(需要权限)

```
.op [del] (<qq号:int> | <at某人:cq[at]>)+
```

中间可换行

用于便捷管理权限的命令，同 mc 的`/op`,管理员可以赋予和解除管理员，同时具有所有命令(包括高度危险的命令)的使用权限，因此赋予需谨慎

`.op`命令不能解除 master 的权限，但是防君子不防小人

### file(需要权限)

用于操作文件的命令，可以被`.py`命令取代，不过还是姑且留着

注意，以下不是 bnf 语法，`||`表示分条消息

```
.file
 : read <文件路径> [<起始行> <结束行>]
 | write <文件路径> [<起始行> <结束行>]\n<内容>
 | get <文件路径>
 | set <文件路径> || <文件>
<文件> || .file to <文件路径>
```

read 用于读取文本文件，可以指定行号范围，并且它会显示行号

write 可以写回去，写的时候如果附带了行号会自动去掉

> read 可以读取文件夹，将会列出文件夹内的内容

get 和 send 和 to 用来发送和接收文件，不过似乎不怎么能用


## 核心命令

### .py(需要权限)

```
.py <内容>
```

在多线程运行 python 代码，可以调用 bot 的几乎任何代码，发送和接收消息，管理数据

运行环境在一次运行期间是保存的，你可以先定义函数或者赋值，然后在之后的消息中使用它

最后一行会被作为表达式解析，如果不是`None`，作为文本消息被 bot 发送

异常会被 bot 发送

当最后一行以`#`开头时，视为`None`

特别地，当最后一行以`###`开头时，本次运行的代码文本会被保存进`data/pyload.py`，在 bot 每次启动时加载

### .link(需要权限)

如若 bot 接收到的消息没有触发任何玩意(`^`，阻塞，命令，bash运行)，那么会通过 links 进行处理

links 是 link 构成的列表，每个 link 含有 `name`, `type`, `cond`, `action`, `succ`, `fail` 等键

其中`succ`和`fail`都是 link 的`name`构成的列表

links 的第一个 link 会被作为入口，对传入的消息(不一定是文本消息)进行判断

根据 link 的种类(`type`)，若满足条件(`cond`)则会运行动作(`action`)，然后根据是否满足条件，依次运行`succ`或者`fail`内的其它 links

举个例子，如果想要创建出骰子

```
user:
    .py
    def rd(r,d):
        '''掷骰子'''
        return sum(random.randint(1, d) for _ in range(r))
    ###
bot:
    添加成功
user:
    .link set2 骰子
bot:
    输入cond
user:
    \.r{r:Int}d{d:Int}$
bot:
    输入action
user:
    f'{getname()} 投了 {:r} 个 {:d} 面骰，总数为 {rd({:r}, {:d})}'
bot:
    创建成功
user:
    .r1d6
bot:
    user 投了 1 个 6 面骰，总数为 5
```

在`.py`中可以使用`links`获取 links 列表并进行编辑，不过也可以使用`.link`命令来编辑 links

`.link`和`.py`的运行环境是一致的，这意味着`.link`同样能调用 bot 的几乎全部东西

link 的`type`分为 2 种，分别是`py`和`re`，分别使用`.link set`和`.link set2`设置

完整的语法是

```
.link (set|set2) <name>[ while( <other_name> (succ|fail))+]
 || <cond>
 || <action>
```

while 可以设置它在哪条 link 通过或未通过时执行

当使用`set`时, `cond`和`action`作为 py 代码解析

cond 会以最后一行作为表达式求布尔值作为判断依据，action则是无脑exec

若打算 cond 无条件通过请使用 True 作为最后一行，否则使用 None 或者 以#开头 作为最后一行

action 紧挨着 cond 成功时执行，原则上不允许 conds 使用 send,recv 和 do_action 等干涉自身的函数

当使用`set2`时，`cond`和`action`分别作为特殊的正则表达式和特殊的 py 代码解析

`action` 的最后一行会像`.py`一样返回，只是不会有`###`的记录

此时`cond`的特殊在于，它是用来生成正则表达式的，生成的正则表达式将捕获的一溜字符串传给`action`，生成 py 代码来运行

捕获的基本原理在于命名组，不过换了个写法

使用类似 python 中 f-string 的形式，而表现起来是这样的 `{name:type}`

当传入新的消息需要被`cond`判断时

`type`会在`.py`的运行环境中寻找同样名字的变量，并转化为字符串

若没有找到或者变量名不合法，则将本身作为字符串

若指向的是列表，则变成`(?:xx|xx|...)`类似这样

若`name`和`type`都有，则以`name`创建命名组，`type`的结果作为命名组的匹配规则

若只有`type`，即`{:type}`，则`type`的结果直接作为字符串插入

若只有`name`，即`{name}`，则根据`name`本身进行判断，当`name`以大写字母开头时插入`[\S\s]+`，否则插入`\S+`

正则表达式若匹配通过则会获取`groupdicts`，包含所有的命名组

替换`action`里所有类似`{:name}`的东西，然后再将`action`作为 py 代码解析

最后一行作为表达式返回