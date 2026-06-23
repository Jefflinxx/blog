---
title: "How Does the Internet Work?"
date: 2026-04-05
slug: how-does-the-internet-work
description: "用 LAN、Router、ISP、Routing、CDN 和 WAN 的角度，整理 Internet 如何把不同網路連在一起。"
categories:
  - Software Engineering
tags:
  - Networking
  - Internet
  - LAN
  - WAN
authors:
  - you
draft: false
---

# How Does the Internet Work?

如果要理解 Internet 怎麼運作，可以先從家裡或辦公室的區域網路開始看。

Internet 並不是某一台巨大的機器，而是很多個網路互相連接後形成的系統。家裡的網路、公司的網路、學校的網路、資料中心的網路，最後都透過不同層級的設備與線路串在一起。

<!-- more -->

## LAN：Local Area Network

LAN 是 Local Area Network，也就是區域網路。

想像家裡或辦公室有多台電腦、手機、印表機或 NAS，我們希望它們可以彼此溝通，例如傳檔案、分享資料、連到同一台印表機。這時候可以透過 Switch 這個硬體設備，並用 Ethernet cable，也就是網路線，把裝置連接起來。

Switch 上通常會有很多插槽，這些插槽常被稱為 LAN port。電腦或筆電上如果有可以插網路線的孔，也可以稱為 Ethernet port 或 LAN port。當多台裝置透過 Switch 連在一起，它們就形成了一個 LAN。

區域網路不一定只能靠有線連線。也可以透過 AP，也就是 Access Point，讓裝置用 Wi-Fi 連進同一個網路。差別在於：

- Switch 主要負責有線裝置之間的連接。
- Access Point 主要負責無線裝置透過 Wi-Fi 加入網路。

在家用設備裡，Modem、Router、Switch、Wi-Fi Access Point 常常被整合在同一台機器中，也就是我們日常說的「分享器」或 home router。所以很多時候大家會把這些功能混在一起稱呼。

## 從 LAN 連到 Internet

如果只是同一個 LAN 裡的裝置互相溝通，例如電腦傳檔案到 NAS，封包通常不需要離開區域網路，也不需要經過 Router。Switch 就可以在同一個 LAN 裡把資料送到正確的裝置。

但如果要連到外部網路，例如打開 YouTube、Google 或其他網站，封包就需要離開家裡的 LAN。這時候 Router 會扮演重要角色。

一個簡化過的流程會像這樣：

1. 你的電腦送出封包。
2. 封包先經過家裡 LAN 裡的 Switch 或 Wi-Fi AP。
3. 封包被送到 Router。
4. Router 把封包送往 ISP 提供的外部線路。
5. 封包進入更大的網路，最後抵達目標服務的 Server。

Router 的工作是連接不同網路。家裡的 LAN 是一個網路，ISP 那邊是另一個更大的網路。Router 會把該留在 LAN 裡的流量留在 LAN，該往外送的流量送出去。

另外，家裡的 Router 通常會接上一條由 ISP，也就是 Internet Service Provider，提供的線路，例如光纖、Cable 或其他接入方式。這也是我們每個月要付網路費給電信公司或網路供應商的原因。

## Internet 是什麼？

教科書常說：

> The Internet is a network of networks.

也就是說，Internet 是很多網路彼此連接後形成的網路。

家裡的 LAN、公司的 LAN、學校的 Campus Network、資料中心的網路，本來都可以各自獨立存在。但當這些網路透過 Router、光纖、海底電纜、ISP、Internet Exchange Point 等基礎設施互相連接後，就形成了 Internet。

為什麼不只用一台超大的 Router 把所有網路接起來？

原因很直覺：

- 單一節點壞掉，整個系統就會受影響。
- 全球所有線路不可能都拉到同一個地點。
- 流量會過度集中，設備與線路都容易過載。
- 網路需要能夠擴展，也需要在局部出問題時繞路。

所以 Internet 比較像是一張由很多節點與連線組成的巨大網路，而不是一個單一中心。

## Routing 與 Forwarding

當一個封包離開你的 LAN 之後，它會經過一台又一台 Router。每台 Router 都需要決定：這個封包下一步應該送去哪裡？

這裡有兩個重要名詞：

- Routing：建立或更新路由資訊的過程。
- Forwarding：封包到達 Router 後，根據路由表把封包轉送到下一跳的過程。

Router 會透過 routing protocol 或 routing algorithm 建立 routing table，也就是路由表。當封包到達時，Router 不是每次都重新從零開始計算整張表，而是查詢已經建立好的 routing table，決定下一個 next hop。

這有點像 Google Maps 導航。路線通常不是每走一步都重新發明一次，而是先根據目前掌握的道路資訊規劃路徑；如果路況變了，再重新調整。

Routing 不一定只追求最短路徑，也可能考慮：

- 頻寬
- 延遲
- 路徑成本
- 網路政策
- 連線狀態
- 負載情況

另外，當網路出現壅塞時，TCP 也會透過 congestion control 降低傳送速率，避免傳送端一直把資料丟進已經過載的網路。

## 看 YouTube 時發生了什麼？

假設你打開 YouTube 看影片，流程可以想成：

1. 瀏覽器先送出請求。
2. 請求從你的裝置離開 LAN。
3. Router 把封包送到 ISP。
4. 封包經過多個網路，抵達 YouTube 相關的 Server 或 CDN edge server。
5. Server 持續回傳影片資料給你。

Server 本質上也是電腦，只是它專門處理其他裝置送來的請求。

像 YouTube 這種大型服務，不會只放在某一台 Server 上。Google 會在全球多個地點部署資料中心、快取節點與 CDN edge servers。不同使用者即使都在看同一個影片，背後實際連到的 Server 也可能不同，但使用者看到的內容會是一樣的。

影片資料不是一次全部下載完才播放，而是分段持續傳送。這就是我們常說的 streaming，也就是串流。

## Google 真的會「直接連到 local ISP」嗎？

你原本最後一段提到 Google 可能會直接和 local ISP 相連，這個方向是對的，但需要更精準一點。

大型網路服務商，例如 Google、Netflix、Cloudflare、Meta，通常會用幾種方式讓使用者更快拿到內容：

- 在不同地區部署資料中心。
- 在靠近使用者的地方部署 CDN 或 cache server。
- 和 ISP 做 peering，讓兩個網路直接交換流量。
- 在 Internet Exchange Point，簡稱 IXP，和其他網路互連。

所以更準確的說法是：當你連到 YouTube 時，流量可能不需要繞很遠到某個遙遠國家的資料中心，而是可能在比較靠近你的位置，就由 Google 的 edge server 或 cache server 回應。

但這不代表「不用經過 local ISP」。只要你是在家裡上網，封包通常還是會先經過你的 ISP。差別在於，ISP 可能和 Google 有比較直接的互連關係，所以路徑更短、延遲更低、速度更穩定。

另外，請求和回應也不一定走完全相同的路線。Internet routing 可以是非對稱的，也就是 request 和 response 可能走不同路徑。

## WAN：Wide Area Network

WAN 是 Wide Area Network，也就是廣域網路。

LAN 通常是同一個家裡、辦公室或建築物內的網路；WAN 則是跨越比較大地理範圍的網路。

例如一家公司有台灣辦公室和美國辦公室，希望兩邊的內部系統可以互通，就可以建立 WAN。

常見作法有幾種：

- Site-to-site VPN：透過 Internet 建立加密通道，讓兩地的 LAN 可以安全交換資料。
- Private leased line：向電信業者租用專線，把兩個地點連起來。
- MPLS 或其他企業網路服務：由電信業者提供較可控的企業廣域網路。

VPN 的重點通常不是「匿名性」，而是加密與建立虛擬通道。它可以讓兩個原本分散的 LAN，透過 Internet 安全交換資料。

Private WAN 則是使用專線或電信業者提供的私有網路服務。它通常比直接走 public Internet 更可控，也比較容易保證穩定性與安全性，但成本也更高。

簡單記：

- LAN 主要是在小範圍內連接裝置。
- WAN 主要是在大範圍內連接不同地點的網路。
- LAN 常靠 Switch 擴展同一個網路。
- WAN 通常靠 Router 連接不同網路。

## CAN：Campus Area Network

CAN 是 Campus Area Network，也就是校園網路或園區網路。

它通常是同一個校園、公司園區或大型機構內，多棟建築物的 LAN 互相連接後形成的網路。

CAN 可以理解成介於 LAN 和 WAN 之間的概念。它比一般家用或單一辦公室 LAN 大，但通常還是在同一個校園或園區範圍內，不像 WAN 那樣跨城市、跨國家。

## ISP 在 Internet 裡扮演什麼角色？

ISP 是 Internet Service Provider，也就是網路服務供應商。

我們家裡的 Router 連出去後，通常會先進入 ISP 的 access network，也就是接入網路。ISP 會在不同地點建置 POP，也就是 Point of Presence。POP 可以理解成 ISP 在某個地區讓使用者或其他網路接入的節點。

再往上，ISP 可能會和其他 ISP、骨幹網路、雲端服務商、CDN 業者互連。這些互連關係可能發生在：

- ISP 自己的骨幹網路。
- Transit provider，也就是幫其他網路轉送流量的上游業者。
- IXP，也就是讓多個網路交換流量的互連地點。
- Peering connection，也就是兩個網路直接互相交換流量。

以前常會用 local ISP、regional ISP、global ISP 這種階層來理解 Internet。這對入門很有幫助，但真實世界不一定是很乾淨的樹狀結構。

現代 Internet 更像是一張複雜的互連網路。不同 ISP、雲端公司、CDN、內容平台之間，會依照成本、效能、商業關係與地理位置建立不同的連線。

所以當你打開一個網站時，你的 request 可能從家裡出發，經過 ISP，再透過 peering、IXP 或 transit network 到達對方的 Server。而 response 回來時，也可能走另一條路。

## 總結

Internet 可以從小到大這樣理解：

1. 家裡或辦公室裡的裝置，透過 Switch 或 Wi-Fi AP 形成 LAN。
2. Router 負責把 LAN 連到外部網路。
3. ISP 提供接入 Internet 的線路與網路服務。
4. 多個 ISP、資料中心、CDN、海底電纜、IXP 和 Router 彼此互連，形成 Internet。
5. Routing 決定封包可以往哪裡走，Forwarding 則是在每台 Router 上把封包送往下一跳。

所以 Internet 最核心的概念就是：

> Internet is a network of networks.

它不是一台機器，也不是單一公司擁有的系統，而是由無數個網路、設備、協定與商業互連關係共同組成的巨大網路。
