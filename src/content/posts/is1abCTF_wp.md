
---
title: is1ab 新生盃 CTF Writeup
published: 2025-09-24
description: is1ab 新生盃 CTF Writeup
tags: [CTF, Writeup, is1ab, 新生盃]
category: writeup
draft: false
---

![這次成績](src\content\posts\images\borad.png)

# I love CTF

## 題目敘述
題目名稱：**I love CTF**  
給了一張圖片，並提示要找出當時表演的樂團名稱。  

![題目圖片](src\content\posts\images\music_ctf_question.png)

## 解題過程
1. 題目附了一張現場照片：  
   ![現場照片](src\content\posts\images\music_ctf_stage.jpg.png)  
   從照片中可以看到棚內有「**織**」這個字，推測與「織」相關的樂團。  

2. 比對活動的宣傳圖：  
   ![活動宣傳圖1](src\content\posts\images\music_ctf_poster1.png)  

3. 最後在 IG 上找到正確的貼文，確認了表演樂團：  
   ![找到的 IG 貼文](src\content\posts\images\music_ctf_ig.png)  

## Flag
```

is1abCTF{b92cc093c2e25b3a8a1fd4cd1dfc542c}

```

---

# Crypto Party

## 題目敘述
給定密文：
```

\==gVftUYTV0TQFTeuR1c0J2XK9Fc1dGexh0Rt9WfNB3R291Z7Z2Y

```

加密順序：
1. Affine  
2. Vigenère  
3. Caesar  
4. Rail Fence  
5. Base64  
6. Reverse  

解密需反向進行。

## 解題過程
- **Step ⑥ Reverse**  
```

Y2Z7Z192R3BNfW9tR0hxeGd1cF9KX2J0c1RueTFQT0VTYUtfVg==

```

- **Step ⑤ Base64 解碼**  
```

cf{g\_vGpM}omGHqxgup\_J\_btsTny1POESaK\_V

```

- **Step ④ Rail Fence (3 rails)**  
```

co1mfGPH{qOxggEu\_pS\_vJa\_GbKtps\_TMnVy}

```

- **Step ③ Caesar** → 位移量 0，無變化。  

- **Step ② Vigenère (key = "KEY")**  
```

IS1ABWJX{hQvgsxn\_Gb\_Pyt\_...}

```

- **Step ① Affine 解密**  
E(x) = (7x + 14) mod 26  
D(y) = 15 × (y − 14) mod 26  

```

IS1ABCTF{WELCOME\_TO\_THE\_CRYPTO\_PARTY}

```

## Flag
```

CTF{WELCOME\_TO\_THE\_CRYPTO\_PARTY}

```

---

# Information Security

## 題目敘述
題目給了一個使用者名稱 **rokku_888_**，並附上一張大頭貼圖片。  
題目描述指出該帳號在多個平台都有活動紀錄，且名稱中含有底線，推測為 Instagram 帳號。  

## 解題過程
1. 搜尋 Instagram，找到對應帳號。  
2. 在限時動態精選中發現與 **身分證字號** 及 **兩步驟驗證** 有關的提示內容。  
3. 其中一張圖將身分證字號塗黑：  
   ![塗黑圖片](src\content\posts\images\id.png)  
4. 經過圖片調整（對比度、亮度、修圖工具等），仍能看見遮蔽下的文字，成功還原 Flag。  

## Flag
```

is1abCTF{1_R3_So_Brav3}

```





