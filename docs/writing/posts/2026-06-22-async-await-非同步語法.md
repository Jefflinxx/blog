---
title: "async/await 非同步語法?"
date: 2026-06-22
slug: async-await-非同步語法
description: "整理 async/await 為什麼被稱為非同步語法，以及它如何用同步寫法控制 JavaScript 的非同步流程。"
categories:
  - Software Engineering
tags:
  - JavaScript
  - async-await
  - frontend
authors:
  - you
draft: false
---

# async/await 非同步語法?

在程式設計中，`async/await` 常被稱為**非同步語法**。

但這裡有個容易誤解的地方：不是因為用了 `async/await`，程式就突然變成非同步。相反地，它其實是讓非同步流程看起來更像同步流程。

<!-- more -->

那為什麼它還是被稱為非同步語法呢？

## 先理解同步是什麼

在工作上，我們常常會說「同步一下」。這通常是指把彼此對某件事情的理解對齊，消除時間差或資訊差。

但在前端開發中，當我們講到「同步」和「非同步」時，討論的通常是程式的執行流程。

JavaScript 本身是單線程的。也就是說，在正常情況下，JS 程式碼會一行一行往下執行。如果中間有一段程式卡住，它就會等待，不會同時開另一條 JS thread 去執行下一段程式。

可是前端經常需要處理 API 請求。如果每次發 API 都讓 JS 停在那裡等結果回來，整個頁面體驗會很差。

所以 JavaScript 透過 event loop、callback queue、Promise 等機制，讓這些耗時操作可以先交出去處理，等結果回來後再把對應的 callback 或 Promise continuation 排回來執行。

因此，在這個語境下：

- 同步比較像是依序執行，一件事做完才做下一件事。
- 非同步比較像是先發起某個任務，接著繼續處理其他工作，等結果回來後再處理後續流程。

更精準一點說，這比較接近**並發**，而不是真正的平行處理。

## async/await 到底做了什麼

回到問題：為什麼 `async/await` 被稱為非同步語法？

因為它是用來處理非同步流程的語法。

`async` 會讓一個 function 回傳 Promise，而 `await` 則可以在 async function 裡等待一個 Promise 完成。這讓我們可以用比較像同步程式的方式，描述非同步流程。

例如：

```js
async function fetchUser() {
  const response = await fetch("/api/user");
  const user = await response.json();
  return user;
}
```

這段程式看起來像是：

1. 等 API 回來
2. 等 JSON 解析完成
3. 回傳 user

但它不是把整個 JavaScript thread 卡死在那裡。`await` 等待的是 Promise 的結果。等待期間，控制權會先交回 event loop，讓其他任務有機會繼續執行。

所以 `async/await` 的價值不是「把非同步變同步」，而是讓你能用同步的寫法，控制非同步流程。

## 結論

`async/await` 是非同步語法。

它的重點不是讓程式變成非同步，而是讓你能**用同步的寫法控制非同步流程**。

更細一點說，`await` 也不是把非同步真的變成同步。它只是讓 async function 在語法上暫停，等 Promise settled 之後再接著執行後面的流程。

## 補充：並發不是平行

在計算機科學中，真正的平行處理，也就是 parallelism，指的是在同一時間真的同時做好幾件事。這通常需要多核心或多執行緒支援。

JavaScript 主執行緒本身一次只能做一件事。

所以我們在前端常說的非同步，更接近 concurrency，也就是並發。它的意思是：

> 我可以先發起一個 API 請求，接著去處理其他任務，等 API 結果回來後，再執行對應的處理。

這是一種時間分配的方式，而不是真正的多線程平行。
