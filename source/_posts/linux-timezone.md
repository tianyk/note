---
title: Linux时区
date: 2016-07-13 19:13:16
updated: 2018-06-15 10:58:45
categories: linux
tags: 
- timezone
- tzselect
---
## Linux修改时区
> date -R 查看当前系统时区
```
cat /etc/timezone
```

`tzselect` 选择时区，选着完成不会生效。需要在`.profile`中加入`TZ='Asia/Shanghai'; export TZ`后生效。
``` shell
$ tzselect
Please identify a location so that time zone rules can be set correctly.
Please select a continent, ocean, "coord", or "TZ".
 1) Africa
 2) Americas
 3) Antarctica
 4) Arctic Ocean
 5) Asia
 6) Atlantic Ocean
 7) Australia
 8) Europe
 9) Indian Ocean
10) Pacific Ocean
11) coord - I want to use geographical coordinates.
12) TZ - I want to specify the time zone using the Posix TZ format.
$ 5
Please select a country whose clocks agree with yours.
 1) Afghanistan       18) Israel            35) Palestine
 2) Armenia           19) Japan             36) Philippines
 3) Azerbaijan        20) Jordan            37) Qatar
 4) Bahrain           21) Kazakhstan        38) Russia
 5) Bangladesh        22) Korea (North)     39) Saudi Arabia
 6) Bhutan            23) Korea (South)     40) Singapore
 7) Brunei            24) Kuwait            41) Sri Lanka
 8) Cambodia          25) Kyrgyzstan        42) Syria
 9) China             26) Laos              43) Taiwan
10) Cyprus            27) Lebanon           44) Tajikistan
11) East Timor        28) Macau             45) Thailand
12) Georgia           29) Malaysia          46) Turkmenistan
13) Hong Kong         30) Mongolia          47) United Arab Emirates
14) India             31) Myanmar (Burma)   48) Uzbekistan
15) Indonesia         32) Nepal             49) Vietnam
16) Iran              33) Oman              50) Yemen
17) Iraq              34) Pakistan
$ 9
Please select one of the following time zone regions.
1) Beijing Time
2) Xinjiang Time
$ 1
The following information has been given:
    China
    Beijing Time
Therefore TZ='Asia/Shanghai' will be used.
Local time is now:  Wed Jul 13 18:42:06 CST 2016.
Universal Time is now:  Wed Jul 13 10:42:06 UTC 2016.
Is the above information OK?
1) Yes
2) No
$ 1
You can make this change permanent for yourself by appending the line
    TZ='Asia/Shanghai'; export TZ
to the file '.profile' in your home directory; then log out and log in again.
Here is that TZ value again, this time on standard output so that you
can use the /usr/bin/tzselect command in shell scripts:
Asia/Shanghai
```

``` sh
echo "TZ='Asia/Shanghai'; export TZ" >> ~/.profile
source ~/.profile
```

### 参考
- [我使用过的Linux命令之tzselect - 选择时区](http://codingstandards.iteye.com/blog/834280) 
- [linux修改系统时间和linux查看时区、修改时区的方法](http://www.jb51.net/LINUXjishu/158824.html)
