Title: Top 10 Man Pages Every Linux Sys Admin Should Read
Date: 2020-02-08 10:00
Author: Mosab Ibrahim
Tags: Linux, Man, Sys Admin

In August 2018, I came across a question on Quora (A great question and answers
website where questions are asked, answered, and edited by Internet users,
either factually or in the form of opinions), that read:

> What are the top 10 man pages that most Linux administrators should read?

I spent some time reading the answers, and there were great answers, but the
question was inspiring, so I gave answering it a shot.

Almost forgot all about it, until someone shared my answer today on Quora, which
made me share it here as well.

The answer goes as follows:

I agree with Jesse Pollard, most linux administrators should read all of them
once. But for the sake of argument, if I had to chose 10 man pages they would
be:

* `man man`: In order to understand how man itself is organized, and what are
  the different man sections and what they mean.
* `man ps`: because it contains a lot of useful information about processes,
  their life cycles, and their states. No linux system administrator should call
themselves as such if they don’t know how processes work in linux. Also, the
information there will be very useful while interpreting the output of other
commands that include any information about processes.
* `man find`: surprisingly, you can learn a lot about the filesytems in linux by
  reading this long man page. Also understanding this page can help with other
commands like `ls`.
* `man vmstat`: (if you don’t have vmstat installed, get it installed) vmstat is
  a very useful command when it comes to troubleshooting, it gives you a pretty
good insight into most of the system. Learn its options, because it can make
your life easier while troubleshooting/debugging an issue.
* `man iptables`: linux’s tool for IPv4 and Ipv6 filtration, as well as NAT.
* `man ss`: a linux utitlity to investigate sockets.
* `man sar`: a utility to collect, report, and/or save system activity. Can be
  useful in various areas of investigation.
* `man iostat`: a utility that prints statistics about CPU as well as devices
  and partitions.
* `man strace`: traces system calls and signals.
* `man lsof`: a tool that lists open file descriptors for all process, or you
  can specify a single process `pid`.

I think if an administrator masters those, anything else can be easy.

To read the rest of the answers, you can check the  [question on
quora](https://www.quora.com/What-are-the-top-10-man-pages-that-most-Linux-administrators-should-read)
