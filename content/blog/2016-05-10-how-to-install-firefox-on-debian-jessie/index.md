+++
title = "How To Install Firefox On Debian Jessie"
date = "2016-05-10T00:00:00Z"
+++

![logo](firefox-iceweasel-debian.png)

_Iceweasel_ is great, but I prefer _Firefox_.

A while back I decided to go back to my favorite linux distribution, _Debian_.
The current stable release of _Debian_ is code named _Jessie_, and this is what
I have installed on my laptop at the time of writing this post.

_Mozilla_ has three famous desktop applications. Those applications are Firefox,
Thunderbird, and _Seamonkey_. But Debian has been shipping those products
re-branded as _Iceweasel_, _Icdeodove_, and _Iceape_, respectively. _Debian_
does this as a workaround for some incompatibilities between the Debian Free
Software Guidelines and Mozilla’s trademark usage policy, and I think something
related to the Mozilla logos licensing as well. I am not aware of the details of
the conflicts, and I would like to read about it some other time.

For now, I wanted to install _Firefox_ instead of, or alongside, _Iceweasel_ on my
laptop. _Iceweasel_ is great, but I was having a few problems. One example would
be the different User Agent information, which causes some problems while using
services on the internet, like Medium. Medium does not recognize my browser to be
supported, and thus disables the option of writing stories if I am browsing it
using _Iceweasel_.

I did a quick _Google_ search on how to install _Firefox_ on _Debian Jessie_,
and a majority of the results suggested adding repositories from _Ubuntu_
packages hosted on _Sourceforge_. I had two major problems with that:

**Problem 1:** I don’t like Sourceforge. At all. For various reasons, but that’s
a story for another time.

**Problem 2:** I don’t like the idea of adding the repositories of another
distro to my current setup. Does not seem like a neat solution.

So I kept searching until I found this [“Debian Mozilla team”](http://mozilla.debian.net/) page. I
knew I found my desired solution.

Below are the steps I followed from that page to get _Firefox_ installed on
_Debian Jessie_.

## Step 1: Add Mozilla Archive to APT Repositories

Open a terminal as root, and add a new file to `/etc/apt/sources.list.d/`
directory:

```shell
touch /etc/apt/sources.list.d/debian-mozilla.list
```

Open the file using your favorite text editor, mine happens to be vim, and add
the following line to it:

```plaintext
deb http://mozilla.debian.net/ jessie-backports firefox-release
```

## Step 2: Add the Mozilla Archive Key

This line adds `mozilla.debian.net` archive to your list of archives. Since the
packages at `mozilla.debian.net` are signed, running `apt-get update` now will
spit out a key not found error. To add the key you need to download the
[pkg-mozilla-archive-keyring](http://mozilla.debian.net/pkg-mozilla-archive-keyring_1.1_all.deb)
package, and install it. The package requires that `debian-keying` package be
installed.

```shell
cd ~/
wget mozilla.debian.net/pkg-mozilla-archive-keyring_1.1_all.deb
dpkg -i pkg-mozilla-archive-keyring_1.1_all.deb
```

## Step 3: Install Firefox

Now it is time to update the archives and install _Firefox_:

```shell
apt-get update
apt-get install -t jessie-backports firefox
```

And now you have _Firefox_ installed.

Note that _Iceweasel_ is also still installed, and they both will use the same
settings and configurations. When I started Firefox, it had all the add-ons and
settings and even the tabs that were opened in _Iceweasel_, all preserved.

Check the [mozilla.debian.net](http://mozilla.debian.net/) page for various
combinations of _Debian_ release, _Mozilla_ desktop application you want to
install, and the version of the _Mozilla_ desktop application you want
installed.
