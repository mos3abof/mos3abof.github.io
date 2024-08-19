+++
title = "Top 10 Man Pages Every Linux Sys Admin Should Read"
date = "2020-02-08T10:00:00Z"
+++

Came across an interesting question on Quora (A great question and answers website where questions
are asked, answered, and edited by Quora's community, either factually or in the form of opinions). 

The question was:

> What are the top 10 man pages that most Linux administrators should read?

Intrigued by the question, I spent some time reading the answers, and there were great answers, but 
the question was inspiring. However, this was an opportunity for me to reflect on what man pages I 
found useful, and thought it might benefit others as well, so here is the answer I provided:

Almost forgot all about it, until someone shared my answer today on Quora, which made me share it 
here as well.

The answer goes as follows:

sake of argument, if I had to choose 10 man pages they would be:
I agree with Jesse Pollard[^1], most linux administrators should read all of them once. However for the 

- `man man`: understand how `man` itself is organized, what the different man sections are and what they mean.
- `man ps`: contains a lot of useful information about processes, their life cycles, and their states. Every linux system administrator should know how processes work in linux. The information here is handy in interpreting the output of other commands that include any information about processes running on the linux box you are maintaining/debugging.
- `man find`: surprisingly, you can learn a lot about linux filesystems just by reading this (long) man page. Understanding this page helps you gain deeper levels of understanding. You will appreciate the output of commands like `ls` much more when you do.
- `man vmstat`: (if you don’t have `vmstat` installed, get it installed, now!) `vmstat` is extremely handy for gaining interesting insights into how different linux subsystems and the processes running on it are behaving. Study `vmstat`’s different options; it will make your life easier.
- `man iptables`: linux’s tool for IPv4 and Ipv6 filtration, as well as NAT.
- `man ss`: a linux utitlity to investigate socket related stuff.
- `man sar`: a utility to collect, report, and/or save system activity. Can prove useful in various areas of investigation.
- `man iostat`: a utility that provides statistics about CPU, io devices and partitions.
- `man strace`: traces system calls and signals that a process performs.
- `man lsof`: a tool that lists open file descriptors for all processes. You can also zoom in on a single process using its `pid`.

I think if an administrator masters those, anything else becomes that much easier.

To read the rest of the answers, you can check the [question on
quora](https://www.quora.com/What-are-the-top-10-man-pages-that-most-Linux-administrators-should-read)



----

[^1] [Jesse Pollard's answer](https://www.quora.com/What-are-the-top-10-man-pages-that-most-Linux-administrators-should-read/answer/Jesse-Pollard-1) to the question.
