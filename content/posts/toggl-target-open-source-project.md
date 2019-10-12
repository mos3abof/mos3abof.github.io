Title: Toggl Target : An Open Source Project Of My Own
Date: 2013-06-17 04:00
Author: Mosab Ibrahim
Tags: Python, Toggl, API

At our company, [Yubb Software][], we track our working hours using the great
time tracker created by the folks at [Toggl][], and we have monthly goals that
we need to achieve. I have always had a problem with time management, and this
time I decided I should start working on them.

So I created this small project to calculate how many more hours I should work
to achieve my monthly goals.

This is how the output of this script looks like :

``` Hi Checking Internet connectivity...  Internet seems fine!

Trying to connect to Toggl, hang on!

So far you have tracked 120.00 hours

Business days left till deadline : 7 Total days left till deadline : 10

Required working hours for this month : 170

To achieve the minimum : you should log 4.00 hours every business day or log
3.00 hours every day

To achieve the required : you should log 7.00 hours every business day or log
5.0 hours every day

So far you have achieved:

70.59% [=================================================--------------|------]
```

This information has provided me with a whole new level of awareness of how
productive I am! It is scary, but at the same time it gives you a great
indicator of how good -or bad- you are sticking to your goals and if you need to
have some crunch time or just relax the next weekend.

I then published the script under GPL license V2 on [Github][].

I got great deal of help from one of my role model software engineers in Egypt,
  [Mohammed Tayseer][], making the code more Pythonic. He also added
  installation instructions for Windows users, as I don't use windows anymore,
  and he is now a contributor to the repository on Github.

Today, Monday June 17th, Toggl added a link to my script on their new
documentation in the [Code Examples][] section.

My little open source script that uses is the first -and so far the only-
mentioned project in their new API Documentation. Check it on their [API
Documentation][] on Github, or check the following screenshot :

![My little open source script is the first -and so far the only- mentioned
project in Toggl's API new Documentation.][]

This really made my day. Thank you Toggl :)

### ***Update 1 : Friday June 21st, 3:50 PM***

I received an email today from someone with the following content :

> Hi Mosab,
>
> I’m currently making a small Python app that interacts with the toggl API, and
> your toggl target script has been helpful in getting me started. I’m using a
> modified version of your api.py file, and I’d like to credit you in my project
> when I put it on GitHub, but I’m not sure how (I’m rather new to all of this).
> Is it sufficient to mention that in the readme or should I leave the line
> "\#@author Mosab Ahmad [mosab.ahmad@gmail.com][]" at the beginning of the
> file?
>
> If you’re interested, it’s an implementation of [this][] (percentile feedback)
>
> Best

I am really glad my code helped someone :)

### ***Update 2 : Wednesday Jul 10th, 11:43 PM***

Seems that my little Toggl Target script is picking up some momentum.

I got this email 45 minutes ago :

> hi,
>
> you probably have already seen it, but i forked your toggl\_target repo.
>
> i just wanted to see how fast i could add reports api support and what data
> comes out of there... while doing that i replaced the way the config is loaded
> to something similar like django works and loading a config file directly from
> a user's home dir... and added a setup.py to install everything.
>
> so now there is a separate script to get some reports and an api wrapper for
> reports subclassing yours. i also did a little refactoring in your code.
>
> since you seem to plan on writing a separate pytoggle lib i thought some of
> that is useful for you... so i wanted to give you an overview of what i
> changed and let you know, i probably won't do anything more with that.
>
> here is the sauce:
>
> <https://github.com/fdemmer/toggl_target>
>
> regards,
>
> Florian

I am really surprised and humbled by all your contributions, thank you.

[My little open source script Toggl Target in action.]: http://farm4.staticflickr.com/3832/9067864209_17b3b8d1c8_o.png
[Yubb Software]: http://www.yubb-software.com
[Toggl]: http://www.toggl.com [Github]: https://github.com/mos3abof/toggl_target
[Mohammed Tayseer]: http://www.mtayseer.net/
[Code Examples]: https://github.com/toggl/toggl_api_docs
[API Documenation]: https://github.com/toggl/toggl_api_docs#code-examples
[My little open source script that uses is the first -and so far the only- mentioned in Toggl's API new
Documentation.]: http://farm8.staticflickr.com/7432/9069807810_0084073717_b.jpg
[this]: http://blog.sethroberts.net/2011/05/01/percentile-feedback-and-productivity/
