Title: Poor Man's Guide for Monitoring a Website in Python
Date: 2013-02-11 15:34
Author: Mosab Ahmad
Tags: Python, urllib, monitoring, Fabric
Slug: poor-mans-guide-for-monitoring-a-website-in-python

In one of the projects I am working on there was a problem with Apache
server. It went down almost on a daily basis, and we were reading the
logs to get the bottom of the root cause. But untill we got our solution
we needed to monitor the server's accssibility through the web, and get
alerted if it went down, and ultimately restart it when this happened.

</p>

So I fired up my console and text editor and started hacking a little
script to do the above mentioned side goals.

</p>

1.  Monitoring the Apache server's accessiblity from a different server.
2.  SSH-ing the linux box running the server and restarting Apache.
3.  Alerting the DevOps team about the issue.
4.  Putting it all together
5.  Setting up a cron job to run the script

</p>

I am assuming you are running an ubunut machine.

</p>

### 1. Monitoring the Apache Server {#146-monitoring-the-apache-server}

</p>

I was confused between two `Python 2.x` libraries (note that they are
dramatically changed in `Python 3.x` and choosing between them is
subject to different ciretera).

The first library was `python-httplib` and the second was `urllib`.
After a quick reading through both library's manual and a quick reading
on StackOverflow I have decided to go for urllib.

</p>

Basically what I had in mind was to send a GET request to the website
served by Apache and check the HTTP response code I got.

If it is *200* -which is the SUCCESS response code according to HTTP
standards- then everything is fine.

</p>

You can try this in a python interactive shell :

</p>

<div class="codehilite">
    >>> import urllib>>> response_code = urllib.urlopen("http://www.example.com").getcode()>>> print response_code200

</div>
</p>

If the printed value is 200 then the website is up and running, if it
has a different value or raises an Exception then the site is likely
down (Assuming you have internet connectivity, no firewalls blocking
your way, etc).

</p>

Time to put it together in a script :

</p>

<div class="codehilite">
    import urllibtry:    resposne_code = urllib.urlopen("http://www.example.com").getcode()    if response_code != 200:        raise ValueErrorexcept:    pass    # Here write code to do whatever you want to do when the website is down.

</div>
</p>

### 2. Restart the Apache server remotely {#246-restart-the-apache-server-remotely}

</p>

There is a wonderful Python library and a command-line tool called
*[Fabric][]* that helps you streamlining the use of SSH for application
deployment or systems administration tasks. It is ideally used to
automate tedious error prone tasks in an easy way.

</p>

You can read about more about it in their documentation.

</p>

Install it by running the following command:

</p>

<div class="codehilite">
    $ sudo apt-get install fabric

</div>
</p>

We now need to create a new python file that I will name `fabfile.py`,
you can name it anything, but let's just follow the common name you will
see in Fabric's documenation.

</p>

<div class="codehilite">
    from fabric.api import env, sudoenv.hosts       = ['user@server']env.passwords   = {'user@server' : 'password' }def restart_apache():    sudo("apache2ctl restart")

</div>
</p>

We start by importing what we need from Fabric. Then we tell it some
information about the server we want to restart Apache on by setting the
`env.hosts` and `env.passwords` variables.

</p>

Then we define a `restart_apache` function that we will call later to do
the actual restart.

</p>

There are three main functions that are used the most, `local()` that
runs local commands, `run()` that runs commands on the remote server and
`sudo()` that runs commands on the remote server using `sudo`. Since
Apache restart requires a root user or sudo priveleges we used the
`sudo()` function.

</p>

To run a Fabric script open up your terminal and run the following
command:

</p>

<div class="codehilite">
    $ fabric fabfile.py restart_apache

</div>
</p>

If you want to run it from a different directory than the `fabfile.py`
then you need to use the `-f` option like this :

</p>

<div class="codehilite">
    $ fabric -f /path/to/your/fabfile.py function_name

</div>
</p>

### 3. Alerting the DevOps team about the issue. {#346-alerting-the-devops-team-about-the-issue}

</p>

We can re-use the email function from the previous post on this blog
[Installing Gdata Python Client on Dreamhost][]:

</p>

<div class="codehilite">
    import smtplibfrom email.MIMEMultipart import MIMEMultipartfrom email.MIMEBase import MIMEBasefrom email.MIMEText import MIMETextfrom email import Encoderssubject     = 'Your website is down'email_body  = 'Your website is down'gmail_user  = 'YOUR-GMAIL-ADDRESS'gmail_pwd   = 'YOUR-GMAIL-PASSWORD'recepient   = 'DEVOPS-EMAIL'def mail(to, subject, text, gmail_user, gmail_pwd):    '''    Sends mail using gmail    '''    msg = MIMEMultipart()    # Setting up message data    msg['From']     = 'DEVOPS-EMAIL'    msg['To']       = to    msg['Subject']  = subject    msg.attach(MIMEText(text))    # Opening the connection with Gmail SMTP server    mailServer = smtplib.SMTP("smtp.gmail.com", 587)    mailServer.ehlo()    mailServer.starttls()    mailServer.ehlo()    mailServer.login(gmail_user, gmail_pwd)    # Actual sending of the email    mailServer.sendmail(gmail_user, to, msg.as_string())    # Closing the connection    # Should be mailServer.quit(), but that crashes    mailServer.close()

</div>
</p>

### 4. Putting it all together {#446-putting-it-all-together}

</p>

I have combined all the snippets mentioned above, modified them and
added some logging functionality to it.

</p>

I have it installed on `/opt/fabfile.py` and I have created a
`/opt/fab_logs` folder to hold the log files.

</p>

Below is how a complete script may look like.

</p>

<div class="gist">
</p>

<p>
<noscript>
</p>
<p>
    #!/usr/bin/python# -*- coding: utf-8 -*- # Import DateTimefrom datetime import datetime, timedelta, date # Import urllibimport urllib # Importing utilities from Fabricfrom fabric.api import env, sudo # Import email stuffimport smtplibfrom email.MIMEMultipart import MIMEMultipartfrom email.MIMEBase import MIMEBasefrom email.MIMEText import MIMETextfrom email import Encoders # For debugging purposesimport traceback # Import Logging libimport logging # Setting up Logging current_date             = date.today()current_log_file_name      = '/opt/fab_logs/' + current_date.isoformat() + '.log'logging.basicConfig( format    = '%(asctime)s [%(levelname)s] %(message)s',             filename    = current_log_file_name,             level   = logging.INFO) # Defining the env.hostsenv.hosts  = ['username@server-address']env.passwords   = {'username@server-address' : 'passoword' }  # The function that actually sends emaildef mail(to, subject, text, gmail_user, gmail_pwd):    '''  Sends mail using gmail   '''  msg = MIMEMultipart()     # Setting up message data    msg['From']     = 'alterts@yoursite.com' msg['To']   = to msg['Subject']  = subject     msg.attach(MIMEText(text))    # Opening the connection with Gmail SMTP server  mailServer = smtplib.SMTP("smtp.gmail.com", 587) mailServer.ehlo()    mailServer.starttls()    mailServer.ehlo()    mailServer.login(gmail_user, gmail_pwd)   # Actual sending of the email    mailServer.sendmail(gmail_user, to, msg.as_string())  # Closing the connection # Should be mailServer.quit(), but that crashes  mailServer.close() # Alerting the DevOps Teamdef alert_dev_team(message = ''):  '''  This functions emails the DevOps Team that there is a downtime   '''  # Constructing the email message subject     = 'YOUR WEBSITE IS DOWN' email_body  = 'YOUR WEBSITE IS DOWN. \nTime now is {} \n{}'.format(date.today().isoformat(), message)    gmail_user  = 'GMAIL-USERNAME'   gmail_pwd   = 'PASSWORD' logging.debug("Constructed Email message")   recepient   = 'alerts@yoursite.com'   # Sending the message    mail(recepient, subject,  email_body, gmail_user, gmail_pwd) logging.debug("Finished sending all messages")  # Let the magic begindef restart_apache():   '''  Checks if Apache2 server on YOUR WEBSITE is accessible through the web.  If not it attemptes to restart it and alert the Dev Team.     It should be added to cron to run every 5 minutes like this :     */5 * * * * /usr/bin/fab -f /opt/fabfile.py restart_apache   '''   try:     logging.info("The script was invoked by the cron")        # Open the site using urllib     result = urllib.urlopen("http://www.yourwebsite.com").getcode()       # if the alue of the respsonse is not 200 then raise an error        if not result == 200:            raise ValueError     # Log the attempt and successful result      logging.info("The result came back {}".format(result))       logging.info("Everything seems fine! Over and out!")  # if we don't get a response at all or the value is not 200 OK then start the mechanism  except:      # Something with the wsbite is not right, attempt to restart the Apache server       logging.error("Houston, we have got a problem! Attempting an Apache restart")        logging.debug(traceback.format_exc())             # setup the message to email to DevOps team      message = 'Restart attempt complete. Everything should be fine now'       try:         # restart apache using sudo          sudo('apache2ctl restart')        except:          # If the restart attempt fails we should know!           logging.error("WE FAILED! The script couldn't restart the Apache. Human intervention needed!")           logging.error(traceback.format_exc())            message = "WE FAILED! The script couldn't restart the Apache. Human intervention needed!"         try:         # Attempt to alert the DevOps team           alert_dev_team(message)          logging.info("Sending an email to alerts@yoursite.com")      except:          logging.error('Tried sending an email and failed!')      logging.info("Restart attempt complete. Everything should be fine now")

</p>
<p>
</noscript>
</p>
<p>
</div>
</p>

### 5. Setting up a cron job to run the script {#546-setting-up-a-cron-job-to-run-the-script}

</p>

Now we have a great script, and we know how to run it manually. But it
would be invonvenient to run it manually all the time. We need to setup
a cron job to do it periodically for us.

</p>

Run the following command in the terminal to edit your crontab file:

</p>

<div class="codehilite">
    crontab -e

</div>
</p>

Then add the following line to the file to run the script every hour:

</p>

<div class="codehilite">
    0 * * * * /usr/bin/fab -f /path/to/your/fabfile.py restart_apache

</div>
</p>

Happy website monitoring.

</p>

  [Fabric]: http://docs.fabfile.org/en/1.5/
  [Installing Gdata Python Client on Dreamhost]: http://www.mos3abof.com/installing-gdata-python-client-on-dreamhost.html
