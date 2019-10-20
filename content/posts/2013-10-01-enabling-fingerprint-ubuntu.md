Title: Enabling Fingerprint Reader On Ubuntu 13.04
Date: 2013-10-01 12:00
Author: Mosab Ibrahim
Tags: Security Ubuntu Fingerprint

The company I work for (a cool company called [Yubb
Software](http://www.yubb-software.com)) has provided me with a [Lenovo Thinkpad
E430](http://shop.lenovo.com/us/en/laptops/thinkpad/edge-series/e430/index.html)
laptop to work on. The laptop has a fingerprint reader, which I was always
looking to try for fun but never had one on my personal laptop.

I have Ubuntu 13.04 installed on it, so after a very simple google search, I
fired up my terminal by hitting `ctrl+alt+t` and followed these steps:

1. Add the fingerprint reader repository to the apt-get packages repositories:


```bash
$ sudo add-apt-repository ppa:fingerprint/fingerprint-gui
```

2. Resynchronize the package index files from their sources:

```
bash $ sudo apt-get update
```

3. Install the FingerGUI package & some dependencies:

```bash
$ sudo apt-get install libbsapi policykit-1-fingerprint-gui
fingerprint-gui
```

4. Logout of your session, and login again.

5. Launch the Fingerprint GUI and follow the steps.

Further information can be found on [this
page](https://launchpad.net/~fingerprint/+archive/fingerprint-gui) created by
the Official Fingerprint Reader Integration Team.
