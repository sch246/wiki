---
sidebar_position: 2
title: 列表
---

## 创建

```
a = '(1 2 3)
b = `(1 2 3)
c = [1 2 3]
d = (list 1 2 3)
print a b c d
```

输出都是(1 2 3)

不同在于 c 和 d 会对其中全部元素进行求值

b 相当于格式化字符串，会对`:`，`_`，`\`作出特殊反应，不论嵌套深度

a 什么都不做

## 取值

```
a = [1 2 3]
print (a 0)   # 1
print (a 1 2)   # 2
print (a nil 2)  # 1 2
```
如果只有 1 个参数，且为整数，为取索引
如果有 2 个参数，且为整数或`nil`，和 python 切片行为一致

## 增加值

```
a = []
++ a 1
a += [2]
a 'append 3
print a   # 1 2 3
```

## 插入值

```
a = [1 2 3]
(a 2 2) = 'a 'b
(a 'insert 1 'c 'd)
print a   # 1 'c 'd 2 'a 'b 3
```

## 删除值

```
a = [1 2 3 4 5]
(a 4 5) = []
(a 'del 3)
(del (a 2))
(a 'pop)
print a  # 1
```

## 修改值

```
a = [1 2 3]
(a 0) = "cao"
print a   # "cao" 2 3
```