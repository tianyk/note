---
title: acme
author: tyk
date: 2018-09-11 16:49:24
tags:
---


https://acme.sh 

curl  https://get.acme.sh | sh

acme.sh --issue --dns dns_ali \
-d kekek.cc \
-d www.kekek.cc \
-d s.kekek.cc \
-d css.kekek.cc \
-d s3.kekek.cc \
-d dl.kekek.cc \
-d english.kekek.cc \
-d pwa.kekek.cc \ 
--yes-I-know-dns-manual-mode-enough-go-ahead-please

修改DNS TXT记录

export Ali_Key="sdfsdfsdfljlbjkljlkjsdfoiwje"
export Ali_Secret="jlsdflanljkljlfdsaklkjflsa"
https://github.com/Neilpang/acme.sh/blob/master/dnsapi/README.md#11-use-aliyun-domain-api-to-automatically-issue-cert

acme.sh --renew \
-d kekek.cc --dns \
-d www.kekek.cc --dns \
-d s.kekek.cc --dns \
-d css.kekek.cc --dns \
-d s3.kekek.cc --dns \
-d dl.kekek.cc --dns \
-d english.kekek.cc --dns \
-d pwa.kekek.cc --dns \ 
--yes-I-know-dns-manual-mode-enough-go-ahead-please


openssl dhparam -out /etc/ssl/kekek.cc/dhparam.pem 2048