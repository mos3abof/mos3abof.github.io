Title: How To Install Firefox On Debian Jessie
Date: 2016-05-10 00:00
Author: Mosab Ibrahim
Summary: *Iceweasel* is great, but I prefer *Firefox*.

![logo]({attach}/images/firefox-iceweasel-debian.png)

*Iceweasel* is great, but I prefer *Firefox*.

A while back I decided to go back to my favorite linux distribution, *Debian*.
The current stable release of *Debian* is code named *Jessie*, and this is what
I have installed on my laptop at the time of writing this post.

*Mozilla* has three famous desktop applications. Those applications are Firefox,
Thunderbird, and *Seamonkey*. But Debian has been shipping those products
re-branded as *Iceweasel*, *Icdeodove*, and *Iceape*, respectively. *Debian*
does this as a workaround for some incompatibilities between the Debian Free
Software Guidelines and Mozilla’s trademark usage policy, and I think something
related to the Mozilla logos licensing as well. I am not aware of the details of
the conflicts, and I would like to read about it some other time.

For now, I wanted to install *Firefox* instead of, or alongside, *Iceweasel* on my
laptop. *Iceweasel* is great, but I was having a few problems. One example would
be the different User Agent information, which causes some problems while using
services on the internet, like Medium. Medium does not recognize my browser to be
supported, and thus disables the option of writing stories if I am browsing it
using *Iceweasel*.

I did a quick *Google* search on how to install *Firefox* on *Debian Jessie*,
and a majority of the results suggested adding repositories from *Ubuntu*
packages hosted on *Sourceforge*. I had two major problems with that:


**Problem 1:** I don’t like Sourceforge. At all. For various reasons, but that’s
a story for another time.

**Problem 2:** I don’t like the idea of adding the repositories of another
distro to my current setup. Doesn’t seem like a neat solution.

So I kept searching until I found this [“Debian Mozilla team”](http://mozilla.debian.net/) page. I knew I found my desired solution.

Below are the steps I followed from that page to get *Firefox* installed on
*Debian Jessie*.

## Step 1: Add Mozilla Archive to APT Repositories

Open a terminal as root, and add a new file to `/etc/apt/sources.list.d/`
directory:

```
$ touch /etc/apt/sources.list.d/debian-mozilla.list
```

Open the file using your favorite text editor, mine happens to be vim, and add
the following line to it:

```
deb http://mozilla.debian.net/ jessie-backports firefox-release
```

## Step 2: Add the Mozilla Archive Key

This line adds `mozilla.debian.net` archive to your list of archives. Since the
packages at `mozilla.debian.net` are signed, running `apt-get update` now will
spit out a key not found error. To add the key you need to download the
[pkg-mozilla-archive-keyring](http://mozilla.debian.net/pkg-mozilla-archive-keyring_1.1_all.deb)
package, and install it. The package requires that `debian-keying` package be
installed.

```
$ cd ~/
$ wget mozilla.debian.net/pkg-mozilla-archive-keyring_1.1_all.deb
$ dpkg -i pkg-mozilla-archive-keyring_1.1_all.deb
```

## Step 3: Install Firefox

Now it is time to update the archives and install *Firefox*:

```
$ apt-get update
$ apt-get install -t jessie-backports firefox
```

And now you have *Firefox* installed.

Note that *Iceweasel* is also still installed, and they both will use the same
settings and configurations. When I started Firefox, it had all the add-ons and
settings and even the tabs that were opened in *Iceweasel*, all preserved.

Check the [mozilla.debian.net](http://mozilla.debian.net/) page for various
combinations of *Debian* release, *Mozilla* desktop application you want to
install, and the version of the *Mozilla* desktop application you want
installed.
