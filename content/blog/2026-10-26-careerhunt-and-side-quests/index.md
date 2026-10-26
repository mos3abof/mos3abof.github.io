+++
title = "CareerHunt, and 100 other Side Quests"
date = "2026-10-26"

[taxonomies]
tags = ["careerhunt", "career", "self-hosting", "open-source", "arabesque", "side-quests"]

[extra]
toc = true
+++

{{ <image src="careerhunt-social-card.png" alt="CareerHunt: Your job hunt, captured. Your data, set free." size="full" /> }}

I am in the looking for a job. If you have ever been in that position, you know
the drill; dozens of applications, each one at a different stage, recruiters
whose names you half remember, interview dates scribbled somewhere, job
descriptions that vanish from the company's careers page the moment you need to
re-read them, and a spreadsheet that starts tidy and becomes a crime scene by
the second week.

I wanted a simple way to keep track of all of it: applications, interviews,
contacts, notes, and progress. I also did not want to hand my career history
over to yet another SaaS platform. I looked around, could not quite find what I
wanted, so I did what any reasonable engineer would do: I built a little app
and deployed it on my local Kubernetes cluster.

> Problem solved, right? Well, my brain had other plans. 😅

What followed was a few weeks of hyperfocus, one rabbit hole after the other,
and a multi-layered scope creep that would make any project manager weep. Let
me walk you through it, one side quest at a time.

{{ <separator style="dingbats" gap="sm" /> }}

## Side Quest #1: A Design System

The little app needed a UI, and I did not want it to look like every other
admin dashboard on the internet. Arabesque Labs, my software venture, did not
have a visual identity yet either. Two birds, one stone.

A few weeks later, I had the [Arabesque design system][1]: the tokens, CSS,
components and rules that I build everything at Arabesque Labs with.

{{ <image src="design-system.jpg" alt="The Arabesque design system homepage" text="The Arabesque design system: everything around the star follows from the same rule." size="2xl" /> }}

A few things I cared about from day one:

- **Bidirectional from the start:** English and Arabic, left-to-right and
right-to-left, as first class citizens. Not as an afterthought bolted on when
someone files a bug about a mirrored arrow.
- **Accessible:** WCAG 2.2 AA is the floor, not the ceiling. The contrast of
every colour pair the system relies on is measured at build time.
- **Efficient interaction:** people should get things done in the fewest steps,
with actions that say what they do, and every consequence shown before, during,
and after.
- **Boring technology:** plain CSS custom properties and plain HTML. No
framework, and no runtime dependency. A single token file is the source of
truth, and a small Node script builds everything else from it. There are React
components and a handful of optional JavaScript helpers too, for those who want
them.

And, of course, the geometric patterns. The eight-pointed star tile is the
mark, and the patterns you see on the background of every Arabesque page are
drawn from it.

It is open source, and you can browse it at [design.arabesquelabs.com][2], or
read the source on [GitHub][3]. Fair warning though: it is still experimental,
and things will move around until it reaches 1.0.

## Side Quest #2: A Rebrand

At some point the "little app" stopped being little. It grew into a proper
project, so it deserved a proper name and a proper home: **CareerHunt**.

A name, a domain, a landing page, a logo that uses the Arabesque star... You
know how it goes. 😅

## Side Quest #3: Custom Documentation

A proper project needs proper documentation. I love Docusaurus, and I have used
it many times before. But now that I have a design system, I could not just use
Docusaurus as is, right?!

So I built [Arabesque for Docusaurus][4], a Docusaurus 3 theme on top of
Arabesque. It restyles the classic theme with the design system's tokens,
typography and components, maps Infima (Docusaurus' CSS framework) onto them,
and even brings its own colours for code highlighting. The result: a
documentation site that looks and reads like the rest of Arabesque, in light and
dark, and in left-to-right and right-to-left alike.

And because no rabbit hole is complete without going one level deeper, I even
remixed the Docusaurus dinosaur using geometric patterns. Meet the
Arabesquosaurus! (Okay, I just made that name up, but I think it might stick.)

{{ <image srcs={["docusaurus-theme.png", "docusaurus-dinosaur.svg"]} alt="The Arabesque for Docusaurus homepage, and the Docusaurus dinosaur redrawn with Arabesque geometric patterns" text="Arabesque for Docusaurus, and Docusaurus' dinosaur, redrawn with Arabesque geometric patterns." size="xl" crop={false} /> }}

The theme is published on [npm][5], and comes with [its own documentation
site][6], built with, you guessed it, the theme itself. Both CareerHunt's
documentation and the design system's documentation use it.

## Side Quest #4: Power Close Gets a Facelift

Once you have a design system, everything you have ever built starts looking a
bit outdated.

[Power Close][7] is a browser extension I first built back in 2014, for the tab
addicts among us (yes, I am one of them). You type a domain name or a keyword,
hit <kbd>Enter</kbd>, and every tab with it in the address is closed, across
all your windows. Many Facebook tabs open, scattered across windows? Type
`facebook.com`, press <kbd>Enter</kbd>, and they are gone.

Twelve years later, it got the Arabesque treatment: a new logo, a redesigned
popup, and a [brand new website][8].

{{ <image src="power-close.jpg" alt="The Power Close website, showing the extension's popup" text="Power Close: close every tab that matches, at once." size="2xl" /> }}

And since I was already in there, it also picked up a few features I had been
meaning to add for, well, years:

- The popup counts the matching tabs as you type, so you see what will close
before anything does.
- Suggestions from the domains of your open tabs, as you type.
- A keyboard shortcut: <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>.
- A right-click menu option: **Close all tabs from this domain**.
- Settings, synced with your browser.
- Support for Firefox for Android.

You can get it from the [Chrome Web Store][9] or [Firefox Add-ons][10].

## Side Quest #5: A New Zola Theme!

And finally, the one that hits close to home, literally. This very website got
a new theme: [Arabesque for Zola][11]. If things look different around here,
that is why!

{{ <image src="zola-theme-light.png" alt="The Arabesque for Zola demo site in the light theme" text="Arabesque for Zola, in light." size="2xl" /> }}

This one was particularly important for me. My blog has been bilingual for a
while now, with the old Arabic posts imported back from Blogger. Getting a
theme that handles both English and Arabic properly has always been a
struggle, and usually involved me overriding half the theme's CSS. This time
round, right-to-left is built in: each language gets its own address, the
header links each page to its translation, and right-to-left pages mirror,
while numbers, code, and the pattern do not.

{{ <image srcs={["zola-theme-dark.jpg", "zola-theme-arabic.jpg"]} alt="The Arabesque for Zola demo site in the dark theme, and in Arabic" text="Dark, and right-to-left in Arabic." size="full" /> }}

On top of that:

- **Light and dark:** it follows your system, with a button to switch between
system, light, and dark. It remembers your choice, with no flash.
- **Templates for everything:** a home page, paginated sections, tags, an
archive by year, search, and a 404 page.
- **Nineteen shortcodes for Markdown:** the design system's components that
Markdown cannot write, plus galleries, separators, Mermaid diagrams, and
YouTube, PDF, Gist, and Instagram embeds.
- **Nothing from elsewhere:** the fonts, CSS, and scripts are all in the theme.
No tracking, and no framework.

It is open source as well, and the [GitHub repository][12] doubles as the demo
site.

{{ <separator style="dingbats" gap="sm" /> }}

## But I Digress!

So, back to the main quest!

Somewhere along the way, CareerHunt stopped being just a tool for my own
homelab, and became something I wanted to share, in the hope that it might make
someone's life a little bit better.

## So, What Is CareerHunt?

CareerHunt helps you manage your job search in one place: from applications and
interview stages, to the notes and details you would otherwise scatter across
spreadsheets, documents, and browser tabs.

The idea is simple: **your job search, on your own infrastructure, with your
data under your control.**

{{ <image src="careerhunt.jpg" alt="The CareerHunt landing page, showing the tracking board" text="Your job hunting, captured!" size="2xl" /> }}

### Notable Features

Below is a list of notable features, and you can seel the [full list here][17]. 

- **Application pipeline:** Track applications as they move through stages such
as Applied, Interviewing, Offer, and Rejected.
- **Application details:** Keep job descriptions, notes, contact information,
salary details, and everything else about an application in one place.
- **Self-hosted and privacy-first:** Your job search data lives on
infrastructure you control, not on a third-party hosted service.
- **A custom UI:** A clean interface built with the open-source Arabesque
design system.
- **Flexible deployment:** Run it with Docker Compose, or deploy it to
Kubernetes.

And a lot of little things that I hope you will like.

### Self-hosting

CareerHunt is designed with self-hosting in mind. Both Docker Compose and
Kubernetes deployment options are documented in the [quick start guide][13]. I
would especially love feedback from people who run their own services: what is
missing, what could be simpler, and what would make this something you would
actually use?

## Links

- **Website:** [careerhunt.app][14]
- **Source code:** [github.com/ArabesqueLabs/hunt][15]
- **Quick start guide:** [careerhunt.app/docs/quick-start][13]
- **Design system:** [design.arabesquelabs.com][2]

## Early Days

This is an early release, and there is still plenty I would like to improve.
But I figured it was better to get it out there, learn from real users, and
improve it in the open, than to keep polishing it forever. (Also, if I kept
polishing it, I would probably end up building a custom font next. Do not tempt
me.)

If you are job hunting, maintaining a homelab, or just enjoy trying out
open-source projects, give CareerHunt a spin. Bug reports, feature requests,
contributions, constructive criticism, jokes, memes, rants, or any type of
feedback really, are all welcome. ❤️ The comments section below works too!

Hopefully, it makes someone's job hunt a little less chaotic.

And if you happen to be hiring, well, you know where to find [my resume][16]. 😉

[1]: @/projects/arabesque-design-system/index.md
[2]: https://design.arabesquelabs.com
[3]: https://github.com/ArabesqueLabs/design-system
[4]: @/projects/themes/arabesque-docusaurus/index.md
[5]: https://www.npmjs.com/package/@arabesquelabs/docusaurus-theme-arabesque
[6]: https://docusaurus.arabesquelabs.com/
[7]: @/projects/power-close/index.md
[8]: https://power-close.com
[9]: https://chrome.google.com/webstore/detail/power-close/jjpmcpmmajigbkjchbkoclipomlmpaaj
[10]: https://addons.mozilla.org/firefox/addon/firefox-power-close/
[11]: @/projects/themes/arabesque-zola/index.md
[12]: https://github.com/ArabesqueLabs/zola-theme-arabesque
[13]: https://careerhunt.app/docs/quick-start/
[14]: https://careerhunt.app/
[15]: https://github.com/ArabesqueLabs/hunt
[16]: @/resume.md
[17]: https://careerhunt.app/features/
