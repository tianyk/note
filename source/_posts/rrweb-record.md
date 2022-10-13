---
title: rrweb-record
author: tyk
date: 2022-06-21 10:42:13
tags:
---

## 使用rrweb录制网页

rrweb通过捕获网页变化来实现网页的录制和回放。

### 网页录制事件

rrweb捕获的事件有以下几类

```ts
enum EventType { 
  DomContentLoaded,
  Load,
  FullSnapshot,
  IncrementalSnapshot,
  Meta,
  Custom,
  Plugin,
}
```

-  [DomContentLoaded](https://github.com/rrweb-io/rrweb/blob/058c4579b430977af0fdea0e0123cb126726876c/packages/rrweb/src/record/index.ts#L324)

    `DomContentLoaded` 事件时触发，此时HTML已经加载完成

- [Load](https://github.com/rrweb-io/rrweb/blob/058c4579b430977af0fdea0e0123cb126726876c/packages/rrweb/src/record/index.ts#L476)

    `load`事件后触发。如果开始录制时页面还为准备好`interactive`、`complete`，需要等待`load`事件触发后才进行[初始化操作](https://github.com/rrweb-io/rrweb/blob/058c4579b430977af0fdea0e0123cb126726876c/packages/rrweb/src/record/index.ts#L466)

- [Meta](https://github.com/rrweb-io/rrweb/blob/058c4579b430977af0fdea0e0123cb126726876c/packages/rrweb/src/record/index.ts#L250)

    页面全量快照时触发，会记录当前页面的url、宽、高等信息。
    
- [FullSnapshot](https://github.com/rrweb-io/rrweb/blob/058c4579b430977af0fdea0e0123cb126726876c/packages/rrweb/src/record/index.ts#L249)

    在初始化时会进行一次全量快照，此时会生成一个[虚拟DOM树](https://github.com/rrweb-io/rrweb/blob/058c4579b430977af0fdea0e0123cb126726876c/packages/rrweb-snapshot/src/snapshot.ts#L868)，给每个节点分配一个唯一的ID，后续增量快照时记录DOM变化会用此ID。

- [IncrementalSnapshot](https://github.com/rrweb-io/rrweb/blob/058c4579b430977af0fdea0e0123cb126726876c/packages/rrweb/src/record/index.ts#L334)

    页面局部变更是会开始[增量快照](https://github.com/rrweb-io/rrweb/blob/058c4579b430977af0fdea0e0123cb126726876c/packages/rrweb/src/record/observer.ts#L814)，增量快照的事件类型分为以下几种：

    ```ts
    enum IncrementalSource { 
        Mutation,
        MouseMove,
        MouseInteraction,
        Scroll,
        ViewportResize,
        Input,
        TouchMove,
        MediaInteraction,
        StyleSheetRule,
        CanvasMutation,
        Font,
        Log,
        Drag,
        StyleDeclaration,
    }
    ```

    - [Mutation](https://github.com/rrweb-io/rrweb/blob/058c4579b430977af0fdea0e0123cb126726876c/packages/rrweb/src/record/observer.ts#L78)

        ![Mutation](https://assets.coursebox.xdf.cn/4gI0b5sKeGM4XFDW0OtF8.png)

        页面初始化后通过[MutationObserver](https://zh.javascript.info/mutation-observer)来监视`document`所有元素的变化，包括节点的新增、删除、属性的变化等等。

        ```js
          observer.observe(rootEl, {
            attributes: true, // 观察属性变动
            attributeOldValue: true, // 属性的旧值
            characterData: true, // 观察 node.data（文本内容）
            characterDataOldValue: true, // 如果为 true，则将特性的旧值和新值都传递给回调（参见下文），否则只传新值（需要 attributes 选项），
            childList: true, // 观察目标子节点的变化，是否有添加或者删除
            subtree: true, // 观察后代节点
        });
        ```
    
    - [MouseMove](https://github.com/rrweb-io/rrweb/blob/058c4579b430977af0fdea0e0123cb126726876c/packages/rrweb/src/record/observer.ts#L125)

        通过监听`mousemove`、`touchmove`、`drag`事件来捕获鼠标移动。

        ```ts
        const handlers = [
            on('mousemove', updatePosition, doc),
            on('touchmove', updatePosition, doc),
            on('drag', updatePosition, doc),
        ];
        ```

        



    

