---
sidebar_position: 1
title: 缩进
---

既然语言就叫 indent lang，那么最首要的就是如何缩进了

我的期望是，可以同时混合缩进和括号来构成代码文本

并且这个结构也确实构造出来了

以下是同一段程序可能看起来的不同的样子

```
a b c

|   << a
    << b
    << c

a b
    << c

a
    << b
    << c

a
    << b c
```
```
(a b) c d

|   |   << a
        << b
    << c
    << d

(a b)
    << c
    << d

|   |   << a b
    << c
    << d

|   a
        << b
    << c
    << d

|       << a
        << b
    << c
    << d

a
        << b
    << c
    << d
```

嗯，确实离谱

第一块是`(a b c)`，第二块是`((a b) c d)`

每块的第一个是完全缩写形式，第二个是完全展开形式

要明确的是最外层也可以当成在一个缩进中的

对于每一个表达式，除了第一行之外，缩进的深度决定了它括号的深度

而第一行需要用来标记它从树的什么地方开始分叉，所以不能匹配

第一行之外，自动加一层括号，这意味着如果想要仅插入元素而不作为表达式解析的话，需要去掉一层括号

`<<`就是为此而设置的，它是一种解包，后面跟的一溜元素会被展开到上一层

虽然看着吓人，不过我想应该不会有人特地用一行只放一个元素吧，实际上`<<`的出场应该并不会那么多

若是第一行，默认是不加括号的，但是若它实际开始位置的缩进等于甚至小于下一行，就会加上括号了

解析的程序大概是这样:

```python
def get_tab(line: str, i: int):
    line = line.rstrip()
    abs_tab = 0
    while line.startswith('    '):
        abs_tab += 1
        line = line[4:]
    real_tab = abs_tab
    while line.startswith('|   ') or line.startswith('    '):
        real_tab += 1
        line = line[4:]
    if line.startswith(' '):
        print('%s:' % (i), line)
        print('缩进不正确')
        exit()
    return abs_tab, real_tab, line


def read(raw_code: str):
    tar = ''
    raw_lines = raw_code.splitlines()
    if not raw_lines:
        raw_lines = ['']

    tabs, rtabs, lines = zip(
        *filter(lambda e:e[2]!='',
            (get_tab(raw_lines[i], i) for i in range(len(raw_lines)))))

    diff_tabs = [后-前 for 前, 后 in zip(rtabs, tabs[1:]+(0,))]
    i = 0
    for diff, line in zip(diff_tabs, lines):
        i += 1
        if diff > 0:
            tar += '('*diff + line
        else:
            if line:
                line = '('+line+')'
            if diff < 0:
                tar += line + ')'*(-diff)
            else:
                tar += line
    return tar
```