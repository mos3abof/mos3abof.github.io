Title: Household Paper Management and Filing System
Date: 2019-06-26 00:00
Author: Mosab Ibrahim

![Photo by Samuel Zeller on Unsplash]({attach}/images/filing-system.jpg)

> **Disclaimer: This is a Work In Progress. More updates will come in the future
> to this piece.**

## Problem Statement

A typical household receives a lot of mail in the UK, as well as send a few. In
addition to that, our household has more than a year’s worth of mail/paperwork
from the time were residents in Germany. It is very important to not drop the
ball on any action required by any of the incoming mail. It is also equally
important to store the letters in a durable, secure (both digitally and from
kids) and retrieval friendly manner, because they contain important, and
occasionally confidential information.

## General Requirements

The system should incorporate disaster recovery strategies and practices to
avoid loss of important documents, or at least make it easier reproducing any of
those documents in case of physical damage or loss.

The system should be easy to understand, and should handle documents that
address either the whole household or specific person(s) in the household.

The system should incorporate explicitly defined ways of communication between
household members even if they were in different locations for short periods of
time.

The system should support secure disposal of papers/documents with sensitive
information (e.g. visa application forms, confidential personal documents,
credit cards, etc.).

The system should be considerate to documents that are not sensitive, and can be
recycled.

The paper workflow should be simple, yet extensible. Rules should be defined for
dealing with unexpected input/output paperwork.

It would be nice if we could retroactively fit the mail we got in Germany to the
pile, and have some translation capabilities, but this is not a hard
requirement.

## Components of the System

![Filing system sketch]({attach}/images/filing-system-sketch.png)

### Staging Area

This needs to have a designated area, that is either near the door, or in the
kitchen. It needs to be stocked with some essential supplies, and should be
equipped with a mail opener. The staging area should be accessible easily for
the adults having to deal with it, yet not too easily to keep our toddler from
messing with it. A recycling bin, and -if possible- the shredder should be close
by in order to efficiently dispose of unwanted mail ASAP and prevent it from
piling up.

For the time being, we are using a simple paper tray, and we keep a pen and a
letter opener right next to it, until we have a better understanding of whether
we need to upgrade it.

### Physical Long Term Storage

This is where almost all documents should be stored physically. For this, I went
with the "[Really Useful Box](https://www.amazon.co.uk/Really-Useful-Box-24C-10SFCB/dp/B0146PSKZQ/ref=sr_1_9?crid=20JPA1DXEL8FE&keywords=filing+cabinet&qid=1554633129&s=gateway&sprefix=filing+ca%2Caps%2C143&sr=8-9)"
product, with 10 extra suspension files as well as some labels to attach to the
suspension files. This should cover the categories listed below, and should we
need more, we can add more suspension files, or if necessary, get another box.
Another product that I considered is the [MYUSSN 24 Packet Expanding File Folder](https://www.amazon.co.uk/MYEUSSN-Expanding-Business-Document-Accordion/dp/B078MLY1FG/ref=sr_1_10?crid=20JPA1DXEL8FE&keywords=filing+cabinet&qid=1554633129&s=gateway&sprefix=filing+ca%2Caps%2C143&sr=8-10),
but I ended up choosing the “Really Useful Box”.


The good thing about “Really Useful Box” is that if later on we decided to
replace it with another system, we can repurpose the box to another useful
thing!

### Printing System

This s a printer. It could be a good idea to find a cloud compatible printer. I
ended up getting an [HP Envy 5030](https://www.amazon.co.uk/gp/product/B074PMB9C9/) printer, with an instant
ink subscription that is free for the first 12 months.

### Digitisation System

This consists mainly of a scanner, and later an OCR with a full text search
index. The scanner is part of the HP Envy 5030, but the rest will be a future
project. So when a mail comes, if it is an important document, it is scanned,
and filed in the right folder in the Long Term Storage system.

### Digital Long Term Storage System

This should contain scans of all the documents stored, in a structure that maps
the physical structure as much as possible. It would be great if we could add
metadata to the documents on top of the chosen system to make retrieval easier.

The competition was mainly between Google Drive and Dropbox. Dropbox won since
it already contains most of the papers, and it has better syncing capabilities
with different laptops and mobile devices.

### Recycling and Disposal System

If the rate of incoming mail per month is going to be close to this first month,
useless paper will pile up quickly, and that will not only waste storage space,
but will also make the system less efficient, and household members will be more
likely to procrastinate, or misfile documents, undermining the whole point of
having this system in the first place.

The first step starts in the Staging Area when the mail/documents first arrive.
Unwanted or useless documents should be triaged, and classified as either “to
shred” or “to recycle”. The first will go through the rest of the house garbage
system, while the latter needs to be shredded first, then joins the recycling
route.

For the shredder, we ended up getting the [AmazonBasics 8 Sheet Strip Cut Shredder with CD Shred](https://www.amazon.co.uk/AmazonBasics-Sheet-Strip-Shredder-Shred/dp/B01E3R7GWA/ref=sr_1_3?keywords=shredder&qid=1555953188&s=gateway&sr=8-3).

### [WIP] Background/Maintenance System

If this system is to remain useful for years to come, we should have a recurring
retrospective action to evaluate what needs to be improved, fixed, added, or
deprecated from the system. This could be setup as reminders in a shared
calendar for example.

Another important aspect of this component is to keep an eye on the other
components, especially the easily monitored systems like digitization, since it
might provide APIs to automate such checks. Alerts should be sent if things go
wrong and require attention.

Any disaster recovery policy should be part of this component as well.

### [WIP] Central Communication System

Still evaluating some products that we may or may not end up using. Those
products are:

* Google Calendar
* DAKBoard
* A pet project raspberry pi with screen project

### [WIP] Digital Gateway

The digital gateway is meant to serve as an entry point for e-documents that
need be entered in the system, like e-bills, or payslips for example. This is
still an early stage work in progress.

### [WIP] Short Term Storage (Buffer)

I am still thinking whether this should be merged with the Staging Area.
Depending on that thought exercise, will end up either cancelling it, or
elaborating more on it here.

### Inspiring References

A lot -in fact most- of the ideas in this design are inspired are inspired by
the following references, so thank you:

* [https://earlybirdmom.com/how-to-organize-paperwork/](https://earlybirdmom.com/how-to-organize-paperwork/)
* [https://www.thespruce.com/organizing-a-home-filing-system-2648257](https://www.thespruce.com/organizing-a-home-filing-system-2648257)
* [http://organizedhome.com/time-money/paper-chase-abc-household-paper-management](http://organizedhome.com/time-money/paper-chase-abc-household-paper-management)
* [https://thehomesihavemade.com/2018/08/how-to-organize-paperwork-part-8-managing-household-paper-flow/](https://thehomesihavemade.com/2018/08/how-to-organize-paperwork-part-8-managing-household-paper-flow/)
* [https://www.containerstore.com/organization-projects/office/project/organize-bills-mail](https://www.containerstore.com/organization-projects/office/project/organize-bills-mail)
* [https://makespace.com/blog/posts/organize-store-get-rid-of-paper-clutter/](https://makespace.com/blog/posts/organize-store-get-rid-of-paper-clutter/)
* [https://www.refinedroomsllc.com/organize-with-binders/](https://www.refinedroomsllc.com/organize-with-binders/)
* [https://www.archives.gov/preservation/family-archives](https://www.archives.gov/preservation/family-archives)
