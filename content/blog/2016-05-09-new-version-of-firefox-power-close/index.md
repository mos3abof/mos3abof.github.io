+++
title ="New Version of Power Close"
date = "2016-05-09T12:00:00Z"
+++

New website, new icon, and improvements for the tab addict Firefox add-on

{{ image(src="firefox-mosaic.jpg", alt="firefox-header", size="full") }}

## A Brief History

I have recently noticed that Power Close, my Firefox add-on, has reached a 1.5 K
downloads milestone, which is way more than what I anticipated when I first
created it. It was a very small hack for a very personal itch I have, and I
never thought this many people had the same problem.

The first version published version, 0.2.1, was officially released on September
28th, 2014, on Mozilla’s add-on portal, and a couple days before that on GitHub.
A few bug fixes and little improvements were released since that date, and then
I got busy with my life and work.

{{ image(src="stats.png", text="download and usage stats", size="2xl") }}

## What’s New

Earlier this month, a new version 0.5.2 of the add-on was released. Here is a
quick overview of the changes that took place.

### 1. New Icon

In older versions of the add-on, the logo used to be one of the icons designed
by [Freepik](http://www.freepik.com/) from [Flat
Icon](http://www.flaticon.com/), that was licensed under [CC-BY
License](http://creativecommons.org/licenses/by/3.0/).

<!-- {{ image(src="old-logo.png", alt="Old version of the icon") }} -->

The new logo (used for the icon, and the toolbar button) is a mash of
two icons from Google’s [Material Design
Icons](https://design.google.com/icons/) that are published as an open source
project under the [CC-By License](https://creativecommons.org/licenses/by/4.0/).

{{ 
  image(
    srcs=["old-logo.png", "new-logo.png"],
    size="2xl",
    text="Old logo to the left, new logo to the right."
  )
}}

### 2. Selection Context Menu Option

In previous versions of the add-on, the user had to click in a non-interactive
part of the page to see the _"close all tabs from this domain"_ context menu
item. This caused usability issues because the option didn’t appear if you
right click on the page while having a portion of the text selected.

Now the same option is added to the “Selection Context Menu”, so now the user
can still find this option in the context menu even if they have previously
selected some text.

### 3. Switched to The New Firefox Add-on SDK

The previous versions of the add-on were developed using the now deprecated
“cfx” sdk provided by Mozilla for Firefox add-on developers.

This new version is updated to make use of the new SDK named “jpm”.

### 4. New website

I have also registered a domain name for the add-on, and moved it from the
sub-domain under my personal website power-close.mos3abof.com, where it used to
live, to [power-close.com](https://power-close.com).

{{
  image(
    src="website-facelift.png",
    size="2xl",
    text="website face lift"
  )
}}

The website was given a face lift to make it more usable, but this is an early
release with new enhancements and features in the backlog. The website is
hosted on [Dreamhost](https://www.dreamhost.com/r.cgi?1017456), and is HTTPs
enabled using a certificate issued from [Let’s
Encrypt](https://letsencrypt.org/).

### 5. Newsletter

I am also starting a newsletter for a better channel of communication with the
users, where I consider it a matter of principal not to spam the subscribers
with unnecessary emails.

You can sign up for the newsletter on the website:
[power-close.com](https://power-close.com).

### 6. Social Media Presence

I have also started a [Facebook page](http://facebook.com/power.close.addon) and
created a [Twitter account](http://twitter.com/powercloseaddon) for the add-on.

### What’s Next

The downloads number has really caught me by surprise, mainly because I have not
put any effort to marketing it. This inspired me to dedicate more effort into
the project to make it more useful for the ones who are already using it.

This also inspired me to launch a side experiment by reading and learning about
growth hacking, while applying what I learn on Power Close, and documenting my
findings along the way.

I am still not 100% sure about the game plan for this experiment. If you have
any tips, hints, or advice I would love to hear/read it.

Or you can click on the button below and add Power Close to your firefox browser
now!

{{
  image(
    src="add-to-firefox.png", 
    alt="Get the power", 
    size="sm",
    link="https://power-close.com") }}

