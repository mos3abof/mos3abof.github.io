+++
title = "Enabling Fingerprint Reader On Ubuntu 13.04"
date = "2013-10-01T12:00:00Z"
draft = true
+++

The company I work for (a cool company called [Yubb
Software](http://www.yubb-software.com)) has provided me with a [Lenovo Thinkpad
E430](http://shop.lenovo.com/us/en/laptops/thinkpad/edge-series/e430/index.html)
laptop to work on. The laptop has a fingerprint reader, which I was always
looking to try for fun but never had one on my personal laptop.

I have Ubuntu 13.04 installed on it, so after a very simple google search, I
fired up my terminal by hitting `ctrl+alt+t` and followed these steps:

- Add the fingerprint reader repository to the apt-get packages repositories:

```bash
$ sudo add-apt-repository ppa:fingerprint/fingerprint-gui
```

- Resynchronize the package index files from their sources:

```bash
$ sudo apt-get update
```

- Install the FingerGUI package & some dependencies:

```bash
$ sudo apt-get install libbsapi policykit-1-fingerprint-gui fingerprint-gui
```

- Logout of your session, and login again.

- Launch the Fingerprint GUI and follow the steps.

Further information can be found on [this
page](https://launchpad.net/~fingerprint/+archive/fingerprint-gui) created by
the Official Fingerprint Reader Integration Team.
