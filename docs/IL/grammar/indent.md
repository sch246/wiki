---
sidebar_position: 1
title: 缩进
---

既然语言就叫 indent lang，那么最首要的就是如何缩进了

我的期望是，可以同时混合缩进和括号来构成代码文本

并且这个结构也确实构造出来了

以下是同一段程序可能看起来的不同的样子

```
(a b c)

|   a
    b
    c

|   a b c

a b
    c

a
    b
    c

a
    b c
```
```
((a b) c d)

|   |   a
        b
    c
    d

|   (a b) c d

(a b)
    c
    d

|   |   a b
    c
    d

|   a
        b
    c
    d

|       a
        b
    c
    d

a
        b
    c
    d
```

嗯，确实离谱

第一块是`(a b c)`，第二块是`((a b) c d)`

每块的第一个是完全缩写形式，第二个是完全展开形式，第三个是写在一行内的推荐写法

要明确的是最外层也可以当成在一个缩进中的

对于每一个表达式，除了第一行之外，缩进的深度决定了它括号的深度

而第一行需要用来标记它从树的什么地方开始分叉，所以不能匹配

解析的程序大概是这样:

```python
def get_tab(line: str, i: int):
    line = line.rstrip()
    count = 0
    while line.startswith('    '):
        count += 1
        line = line[4:]
    if line.startswith(' '):
        print('%s:' % (i), line)
        print('缩进不正确')
        exit()
    return count, line


def read(raw_code: str):
    tar = ''
    raw_lines = raw_code.splitlines()
    if not raw_lines:
        raw_lines = ['']

    tabs = []
    lines = []
    i = 0
    for line in raw_lines:
        i += 1
        abs_tab, line = get_tab(line, i)
        tabs.append(abs_tab)
        lines.append(line)

    diff_tabs = [后-前 for 前, 后 in zip(tabs, tabs[1:]+[0])]
    i = 0
    for diff, line in zip(diff_tabs, lines):
        i += 1
        while line.startswith('|   ') or line.startswith('    '):
            tar += '('
            line = line[4:]
            diff -= 1
        if line.startswith(' '):
            print('%s:' % (i), line)
            print('缩进不正确')
            exit()
        if diff > 0:
            tar += '('*diff + line
        elif diff < 0:
            tar += line + ')'*(-diff)
        else:
            tar += line
    return tar
```