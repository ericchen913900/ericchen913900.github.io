import fs from "node:fs";
import path from "node:path";

function getDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

const args = process.argv.slice(2);

if (args.length === 0) {
	console.error("Error: No filename argument provided\nUsage: npm run new-writeup -- <filename>");
	process.exit(1);
}

let fileName = args[0];
const fileExtensionRegex = /\.(md|mdx)$/i;
if (!fileExtensionRegex.test(fileName)) {
	fileName += ".md";
}

const targetDir = "./src/content/posts/";
const fullPath = path.join(targetDir, fileName);

if (fs.existsSync(fullPath)) {
	console.error(`Error: File ${fullPath} already exists`);
	process.exit(1);
}

const dirPath = path.dirname(fullPath);
if (!fs.existsSync(dirPath)) {
	fs.mkdirSync(dirPath, { recursive: true });
}

const fallbackTitle = args[0].replace(/\.(md|mdx)$/i, "");
const template = `---
title: ${fallbackTitle}
published: ${getDate()}
description: ""
image: ""
tags: [CTF, Writeup]
category: writeup
draft: false
lang: zh_TW
---

# Challenge Name

## 題目敘述

## 觀察與分析

## 解題步驟

## 利用程式碼

~~~
# Exploit or solve script
~~~

## Flag
~~~
flag{REPLACE_ME}
~~~
`;

fs.writeFileSync(path.join(targetDir, fileName), template);

console.log(`Writeup template ${fullPath} created`);
