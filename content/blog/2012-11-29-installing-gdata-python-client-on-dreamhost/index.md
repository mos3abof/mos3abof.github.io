+++
title= "Installing Gdata Python Client on Dreamhost"
date= "2012-11-29T20:05:00Z"
+++

Our company's website is hosted on [Dreamhost][dreamhost]. Today I needed to write a
python script that utilizes some of Youtube's APIs to send us a daily digest of
videos we are interested in, so I ran into the problem of needing to install a
python library on our hosting account which I don't have root or admin access
to.

Here is what I did.

First of all, I am assuming that you have enabled SSH access to your domain name
you are doing this for. If this is not the case, then this article may be of
great help : [DreamHost SSH][dreamhost ssh]

1. I downloaded the [gdata-python-client][gdata-python-client] from code.google.com (at the moment
   I am writing this post the latest stable version is 2.0.17) using the
   following command :

```bash
$ cd ~
$ wget http://gdata-python-client.googlecode.com/files/gdata-2.0.17.tar.gz
```

2. Untar the tarball:

```bash
$ tar -xzvf gdata-2.0.17.tar.gz
```

3. Change your directory to the uncompressed folder:

```bash
$ cd gdata-2.0.17
```

4. Here is the trick, since we don't have administrative access, we can't
   install the library system-wide, but we can however install it for our
   account by running this command:

```bash
$ python setup.py install --home=~/
```

To test if everything is right run the following command :

```bash
$ ./tests/run_all_tests.py
```

5. Although the library is now installed on your account, you can't yet import
   it directly, you need to add the path of libraries to the system.path in your
   python script in order to be able to import it, so at the beginning of your
   script add the following two lines:

```python {linenos=table,linenostart=1}
import os
import sys

sys.path.append(os.environ['HOME'] + '/lib/python')
```

What these two lines do is constructing a dynamic path to your new lib folder
that contains gdata-python-client by getting the home path from the system
registered in the variable `os.environ['HOME']` and concatenating `/lib/python`
to it, then it appends this dynamically generated path to the system path so
that the python interpreter will look into this folder when importing gdata

6. Now you can do stuff with gdata like :

```python
>>> import gdata.youtubeimport
>>> gdata.youtube.service
```

Here is my final script that I wrote, and I set up a cron job to run it every
morning:

{{ <gist mos3abof 4164654> }}

Happy Gdata programming on Dreamhost :)

[dreamhost]: http://www.dreamhost.com
[dreamhost ssh]: http://ahappycustomer.dreamhosters.com/dreamhost-ssh.html
[gdata-python-client]: http://code.google.com/p/gdata-python-client/downloads/list
