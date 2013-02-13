---
layout: post
title: "Poor man's guide for Monitoring a website using Python"
date: 2013-02-11 17:34
comments: true
categories:  Python, urllib, monitoring, Fabric
---
In one of the projects I am working on there was a problem with Apache server. It went down almost on a daily basis, and we were reading the logs to get the bottom of the root cause. But untill we got our solution we needed to monitor the server's accssibility through the web, and get alerted if it went down, and ultimately restart it when this happened.

So I fired up my console and text editor and started hacking a little script to do the above mentioned side goals.

1. Monitoring the Apache server's accessiblity from a different server.
2. SSH-ing the linux box running the server and restarting Apache.
3. Alerting the DevOps team about the issue.
4. Putting it all together
5. Setting up a cron job to run the script

I am assuming you are running an ubunut machine.

###1\. Monitoring the Apache Server

I was confused between two `Python 2.x` libraries (note that they are dramatically changed in `Python 3.x` and choosing between them is subject to different ciretera).
The first library was `python-httplib` and the second was `urllib`. After a quick reading through both library's manual and a quick reading on StackOverflow I have decided to go for urllib.

Basically what I had in mind was to send a GET request to the website served by Apache and check the HTTP response code I got. 
If it is *200* -which is the SUCCESS response code according to HTTP standards- then everything is fine.

You can try this in a python interactive shell :

``` python
>>> import urllib
>>> response_code = urllib.urlopen("http://www.example.com").getcode()
>>> print response_code
200
```

If the printed value is 200 then the website is up and running, if it has a different value or raises an Exception then the site is likely down (Assuming you have internet connectivity, no firewalls blocking your way, etc).

Time to put it together in a script :

```python
import urllib

try:
    resposne_code = urllib.urlopen("http://www.example.com").getcode()
    if response_code != 200:
        raise ValueError
except:
    pass
    # Here write code to do whatever you want to do when the website is down.

```

###2\. Restart the Apache server remotely


There is a wonderful Python library and a command-line tool called *[Fabric](http://docs.fabfile.org/en/1.5/)* that helps you streamlining the use of SSH for application deployment or systems administration tasks. It is ideally used to automate tedious error prone tasks in an easy way.

You can read about more about it in their documentation. 

Install it by running the following command:

```
$ sudo apt-get install fabric
```

We now need to create a new python file that I will name `fabfile.py`, you can name it anything, but let's just follow the common name you will see in Fabric's documenation.

```python
from fabric.api import env, sudo

env.hosts       = ['user@server']
env.passwords   = {'user@server' : 'password' }

def restart_apache():
    sudo("apache2ctl restart")
```

We start by importing what we need from Fabric. Then we tell it some information about the server we want to restart Apache on by setting the `env.hosts` and `env.passwords` variables.

Then we define a `restart_apache` function that we will call later to do the actual restart.

There are three main functions that are used the most, `local()` that runs local commands, `run()` that runs commands on the remote server and `sudo()` that runs commands on the remote server using `sudo`. Since Apache restart requires a root user or sudo priveleges we used the `sudo()` function.

To run a Fabric script open up your terminal and run the following command:

```
$ fabric fabfile.py restart_apache
```

If you want to run it from a different directory than the `fabfile.py` then you need to use the `-f` option like this :

```
$ fabric -f /path/to/your/fabfile.py function_name
```

###3\. Alerting the DevOps team about the issue.

We can re-use the email function from the previous post on this blog [Installing Gdata Python Client on Dreamhost](http://www.mos3abof.com/blog/2012/11/29/installing-gdata-python-client-on-dreamhost/):

```python 
import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEBase import MIMEBase
from email.MIMEText import MIMEText
from email import Encoders


subject		= 'Your website is down'
email_body	= 'Your website is down'
gmail_user	= 'YOUR-GMAIL-ADDRESS'
gmail_pwd	= 'YOUR-GMAIL-PASSWORD'
recepient 	= 'DEVOPS-EMAIL'

def mail(to, subject, text, gmail_user, gmail_pwd):
	'''
	Sends mail using gmail
	'''
	msg = MIMEMultipart()
 
	# Setting up message data
	msg['From'] 	= 'DEVOPS-EMAIL'
	msg['To'] 		= to
	msg['Subject']	= subject
 
	msg.attach(MIMEText(text))
 
	# Opening the connection with Gmail SMTP server
	mailServer = smtplib.SMTP("smtp.gmail.com", 587)
	mailServer.ehlo()
	mailServer.starttls()
	mailServer.ehlo()
	mailServer.login(gmail_user, gmail_pwd)
 
	# Actual sending of the email
	mailServer.sendmail(gmail_user, to, msg.as_string())
	
	# Closing the connection
	# Should be mailServer.quit(), but that crashes
	mailServer.close()
```

###4\. Putting it all together

I have combined all the snippets mentioned above, modified them and added some logging functionality to it.

I have it installed on `/opt/fabfile.py` and I have created a `/opt/fab_logs` folder to hold the log files.

Below is how a complete script may look like. 

{% gist 4771874 %}


###5\. Setting up a cron job to run the script

Now we have a great script, and we know how to run it manually. But it would be invonvenient to run it manually all the time. We need to setup a cron job to do it periodically for us.

Run the following command in the terminal to edit your crontab file:

```
crontab -e
```

Then add the following line to the file to run the script every hour:

```
0 * * * * /usr/bin/fab -f /path/to/your/fabfile.py restart_apache
```

Happy website monitoring.