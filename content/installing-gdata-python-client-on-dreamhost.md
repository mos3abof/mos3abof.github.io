Title: Installing Gdata Python Client on Dreamhost
Date: 2012-11-29 20:05
Author: Mosab Ahmad
Tags: Python, Dreamhost, GData
Slug: installing-gdata-python-client-on-dreamhost

Our company's website is hosted on [Dreamhost][]. Today I needed to
write a python script that utilizes some of Youtube's APIs to send us a
daily digest of videos we are interested in, so I ran into the problem
of needing to install a python library on our hosting account which I
don't have root or admin access to.

</p>

Here is what I did.

</p>

First of all, I am assuming that you have enabled SSH access to your
domain name you are doing this for. If this is not the case, then this
article may be of great help : [DreamHost SSH][]

</p>

​1. I downloaded the [gdata-python-client][] from code.google.com (at
the moment I am writing this post the latest stable version is 2.0.17)
using the following command :

</p>

<div class="codehilite">
    $ cd ~$ wget http://gdata-python-client.googlecode.com/files/gdata-2.0.17.tar.gz

</div>
</p>

​2. Untar the tarball:

</p>

<div class="codehilite">
    $ tar -xzvf gdata-2.0.17.tar.gz

</div>
</p>

​3. Change your directory to the uncompressed folder:

</p>

<div class="codehilite">
    $ cd gdata-2.0.17

</div>
</p>

​4. Here is the trick, since we don't have administrative access, we
can't install the library system-wide, but we can however install it for
our account by running this command :

</p>

<div class="codehilite">
    $ python setup.py install --home=~/

</div>
</p>

To test if everything is right run the following command :

</p>

<div class="codehilite">
    $ ./tests/run_all_tests.py

</div>
</p>

​5. Although the library is now installed on your account, you can't yet
import it directly, you need to add the path of libraries to the
system.path in your python script in order to be able to import it, so
at the beginning of your script add the following two lines:

</p>

<div class="codehilite">
    import os, syssys.path.append(os.environ['HOME'] + '/lib/python')

</div>
</p>

What these two lines do is constructing a dynamic path to your new lib
folder that contains gdata-python-client by getting the home path from
the system registered in the variable os.environ['HOME'] and
concatinating '/lib/python' to it, then it appends this dynamically
generated path to the system path so that the python interpreter will
look into this folder when importing gdata

</p>

​6. Now you can do stuff with gdata like :

</p>

<div class="codehilite">
    >>> import gdata.youtubeimport>>> gdata.youtube.service

</div>
</p>

Here is my final script that I wrote, and I set up a cron job to run it
every morning :

</p>

<div class="gist">
</p>

<p>
<noscript>
</p>
<p>
    #!/usr/bin/python# -*- coding: utf-8 -*-# Important importsimport os, sys# Append the python libs installed on dreamhost to the sys.pathsys.path.append(os.environ['HOME'] +'/lib/python')# Import email stuffimport smtplibfrom email.MIMEMultipart import MIMEMultipartfrom email.MIMEBase import MIMEBasefrom email.MIMEText import MIMETextfrom email import Encoders# Import the Gdata libraryimport gdata.youtubeimport gdata.youtube.servicedef PrintEntryDetails(entry):  '''  Takes an entry from a youtube standard feed and returns some of  its data as a human readable string  '''  entry_details = 'Video title: %s' % entry.media.title.text + '\n'    entry_details += 'Video published on: %s ' % entry.published.text + '\n' entry_details += 'Video watch page: %s' % entry.media.player.url + '\n'  entry_details += 'Video duration: %s' % entry.media.duration.seconds + '\n'  entry_details += "==========================================" + '\n'  return entry_detailsdef PrintVideoFeed(feed):  '''  Takes a youtube standard feed, formats it and returns a list of all included videos  in a human readable string   '''  output = ''  for entry in feed.entry:     try:         output += PrintEntryDetails(entry)       except:          pass return outputdef mail(to, subject, text, gmail_user, gmail_pwd):    '''  Sends mail using gmail   '''  msg = MIMEMultipart() # Setting up message data    msg['From']     = 'FROM-EMAIL'   msg['To']       = to msg['Subject']  = subject msg.attach(MIMEText(text))    # Opening the connection with Gmail SMTP server  mailServer = smtplib.SMTP("smtp.gmail.com", 587) mailServer.ehlo()    mailServer.starttls()    mailServer.ehlo()    mailServer.login(gmail_user, gmail_pwd)   # Actual sending of the email    mailServer.sendmail(gmail_user, to, msg.as_string())  # Closing the connection # Should be mailServer.quit(), but that crashes  mailServer.close()# Defining the main functionif __name__ == '__main__':    # Setting up mail credentials    gmail_user  = "REPLACE-THIS-WITH-YOUR-GMAIL-USERNAME"    gmail_pwd   = "REPLACE-THIS-WITH-YOUR-GMAIL-PASSWORD" # List of people to receive this daily digest        # Modify this to match your recipients list  recepient_list = [       'recepient1@example.com',        'recepient2@example.com',    ] # Instantiate a YouYubeService object    yt_service = gdata.youtube.service.YouTubeService()   # Set the developer key and client id for monitoris this app yt_service.developer_key = 'REPLACE-THIS-WITH-YOUR-YOUTUBE-DEVELOPER-KEY'    yt_service.client_id = 'REPLACE-THIS-WITH-YOUR-YOUTUBE-CLIENT-ID'  # The standard feed URI for most shared videos in region Egypt   uri = 'http://gdata.youtube.com/feeds/api/standardfeeds/EG/most_shared?v=2'   # Preparing the email body to be sent    # By assigning the videos in the feed in a human readable string format  email_body = PrintVideoFeed(yt_service.GetYouTubeVideoFeed(uri))  # Looping over recepients and emailing them the digest   for recepient in recepient_list:     mail(recepient, "أكثر مقاطع الفيديو مشاركة على يوتيوب اليوم",  email_body, gmail_user, gmail_pwd)

</p>
<p>
</noscript>
</p>
<p>
</div>
</p>

Happy Gdata programming on Dreamhost :)

</p>

  [Dreamhost]: http://www.mos3abof.com/feeds/all.atom.xml
    "http://www.dreamhost.com", "DreamHost"
  [DreamHost SSH]: http://www.mos3abof.com/feeds/all.atom.xml
    "http://ahappycustomer.dreamhosters.com/dreamhost-ssh.html", "DreamHost SSH"
  [gdata-python-client]: http://www.mos3abof.com/feeds/all.atom.xml
    "http://code.google.com/p/gdata-python-client/downloads/list"
