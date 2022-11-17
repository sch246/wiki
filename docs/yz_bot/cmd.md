---
sidebar_position: 2
title: 添加命令的方法(可跳过)
---

import Cover from '@site/src/components/cover/main';

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

没了，就是这样

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

最常用的就是 `from main import cache` ，指`bot.cache`

与`bot.storage`不同，`bot.cache`内的东西会随着bot关闭而丢失

其中的`get`和`set`函数可以用于存取其中的东西

通过`cache.get_last()`，可以获得最后一条被记录的消息字典，而在无异步的 bot 这里，就等价于是触发命令的这条消息字典

`cache.msgs`存储了bot存储的所有的消息字典，每个聊天区域的消息数不超过256条(默认)，这是它记录消息的核心

通过`cache.getlog(msg)`可以通过一条 msg 获取这个聊天区域的最近消息列表

:::tip

注意，消息列表的存储是最近的放在前面，如果消息列表是lst，那么最近的消息要使用`lst[0]`来获取

:::

`get_one(msg,f,i)`用于在当前聊天区域的最近列表内查找满足条件的最近一条消息，反正别想当历史消息查找用就行了，`f`是一个函数，接收消息字典返回布尔值

其它的自己看源代码去

如果想要让 bot 能分条接收命令参数，使用`yield`

> 由于不想让每个函数加上async这种玩意，我采用手动yield来在单线程内实现异步

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