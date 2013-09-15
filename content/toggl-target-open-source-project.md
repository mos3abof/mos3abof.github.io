Title: Toggl Target Open Source Project
Date: 2013-06-17 04:00
Author: Mosab Ahmad
Tags: Python, Toggl, API
Slug: toggl-target-open-source-project

![My little open source script Toggl Target in action.][]

</p>

At our company, [Yubb Software][], we track our working hours using the
greate time tracker created by the folks at [Toggl][], and we have
monthly goals that we need to achieve. I have always had a problem with
time management, and this time I decided I should start working on them.

</p>

So I created this small project to calculate how many hours I should
work to achieve my monthly goals.

This information has provided me with a whole new level of awarenes of
how productive I am! It is scary, but at the same time it give you a
greate indicator of how good -or bad- you are sticking to your goals and
if you need to have some crunch time or just relax the next weekend.

</p>

I then published the script under GPL license V2 on [Github][].

I got great deal of help from one of my role model software engineers in
Egypt, [Mohammed Tayseer][], in making the code more Pythonic. He also
added installation instructions for Windows users, as I don't use
windows anymore, and he is now a contributor to the repository on
Github.

</p>

Today, Monday June 17th, Toggl added a link to my script on their new
documentation in the [Code Examples][] section.

</p>

My little open source script that uses is the first -and so far the
only- mentioned in their new API Documentation. Checkt it on their [API
Documenation][] on Github, or check the following screenshot :

</p>

![My little open source script that uses is the first -and so far the
only- mentioned in Toggl's API new Documentation.][]

</p>

This really made my day. Thank you Toggl :)

</p>

### ***Update 1 : Friday June 21st, 3:50 PM***

</p>

I received an email today from someone with the following content :

</p>
<p>
> </p>
>
> Hi Mosab,
>
> </p>
>
> I’m currently making a small Python app that interacts with the toggl
> API, and your toggl target script has been helpful in getting me
> started. I’m using a modified version of your api.py file, and I’d
> like to credit you in my project when I put it on GitHub, but I’m not
> sure how (I’m rather new to all of this). Is it sufficient to mention
> that in the readme or should I leave the line "\#@author Mosab Ahmad
> [mosab.ahmad@gmail.com][]" at the beginning of the file?
>
> </p>
>
> If you’re interested, it’s an implementation of [this][] (percentile
> feedback)
>
> </p>
>
> Best
>
> </p>
> <p>

</p>

I am really glad my code helped someone :)

</p>

### ***Update 2 : Wednesday Jul 10th, 11:43 PM***

</p>

Seems that my little Toggl Target script is picking up some momentum.

</p>

I got this email 45 minutes ago :

</p>
<p>
> </p>
>
> hi,
>
> </p>
>
> you probably have already seen it, but i forked your toggl\_target
> repo.
>
> </p>
>
> i just wanted to see how fast i could add reports api support and what
> data comes out of there... while doing that i replaced the way the
> config is loaded to something similar like django works and loading a
> config file directly from a user's home dir... and added a setup.py to
> install everything.
>
> </p>
>
> so now there is a separate script to get some reports and an api
> wrapper for reports subclassing yours. i also did a little refactoring
> in your code.
>
> </p>
>
> since you seem to plan on writing a separate pytoggle lib i thought
> some of that is useful for you... so i wanted to give you an overview
> of what i changed and let you know, i probably won't do anything more
> with that.
>
> </p>
>
> here is the sauce:
>
> </p>
>
> <https://github.com/fdemmer/toggl_target>
>
> </p>
>
> regards,
>
> </p>
>
> Florian
>
> </p>
> <p>

</p>

I am really surprised and humbled by all your contributions, thank you.

</p>

  [My little open source script Toggl Target in action.]: http://farm4.staticflickr.com/3832/9067864209_17b3b8d1c8_o.png
  [Yubb Software]: http://www.yubb-software.com
  [Toggl]: http://www.toggl.com
  [Github]: https://github.com/mos3abof/toggl_target
  [Mohammed Tayseer]: http://www.mtayseer.net/
  [Code Examples]: https://github.com/toggl/toggl_api_docs
  [API Documenation]: https://github.com/toggl/toggl_api_docs#code-examples
  [My little open source script that uses is the first -and so far the
  only- mentioned in Toggl's API new Documentation.]: http://farm8.staticflickr.com/7432/9069807810_0084073717_b.jpg
  [mosab.ahmad@gmail.com]: http://www.mos3abof.com/feeds/mailto:mosab.ahmad@gmail.com
  [this]: http://blog.sethroberts.net/2011/05/01/percentile-feedback-and-productivity/
