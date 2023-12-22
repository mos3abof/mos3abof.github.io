+++
title = "Power Close, My First Firefox Addon"
date = "2014-09-28T12:00:00Z"
[taxonomies]
tags = ["firefox", "addon"]
+++

I open a lot of tabs on firefox, and I mean A LOT! I was searching for addons to
help me close tabs as fast as I open them so that I would keep the rate of open
tabs steady. The best I found was something that closed duplicate tabs.

I usually have a lot of tabs from the same domain name open most of the time
when I am researching something, or even when I am surfing facebook. So I
thought it would be cool if I could close tabs belonging to a specific domain
name, and not just duplicate.

I didn't find it, so I created it. Pretty basic, no optimization whatsoever, but
[here it is][] and here is the [code][].

I submitted it yesterday for review by Mozilla, and today I got an email stating
that the addon has undergone full review :)

## How to use it

After installation, this icon will appear as a button in your browser:

![Firefox Power Close Addon Button](https://raw.githubusercontent.com/mos3abof/firefox-power-close/master/data/icon-64.png)

Press on it, and an input field will appear. Write the keyword or domain name in
it and press enter, and voila!

![Screenshot](https://d262ilb51hltx0.cloudfront.net/max/899/1*IRXZxyKWj1vd4DpaT1Fl8g.png)

## What’s next for "Power Close"

There are a couple of ideas for future features :

_Context menu shortcut:_ Adding a context menu entry to close all tabs from
current selected tab’s domain

_Autocomplete:_ I am planning on implementing autocomplete so you don’t have to
type full domain names.

_List current open domains:_ a feature to list currently open domain names
listed by the count of open tabs from every domain in a descending.

_IDN domain names support:_ currently the addon does not support domain names
using non English letters and numbers. I am planning on adding this support at
some point or another.

Other closing options would be thought of as well. Feel free to suggest ideas.

[here it is]: https://addons.mozilla.org/en-US/firefox/addon/firefox-power-close/developers
[code]: https://github.com/mos3abof/firefox-power-close
