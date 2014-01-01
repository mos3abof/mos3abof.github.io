Title: Introducing The “Raspberry Pi Kitchen” Project (PiKitchen)
Date: 2013-12-31 21:59
Author: Mosab Ahmad
Tags: Raspberry Pi, Open Source
Slug: raspberry-pi-kitchen-project-pikitchen


### Introduction

In late January 2013 I joined a cool tech company in Egypt called “[Yubb Software][]”. We are basically the technical arm for another cool American startup called “[zlien][]”. I joined Yubb at the same time they started moving office to a cool co-working space in Cairo, Maadi called “[The District][]”.

A co-working space is a place that people and companies from different industries and backgrounds work together in the same office. A good co-working space is usually operated by a great team that takes care of all the business needs of the co-workers from the internet connection to the printers setup to the desks and chairs and many other details that are essential for any business but are a headache to manage on your own.

Not only that, a co-working space's managing team also takes care of creating a healthy, vibrant, and fun community that shares many great values like cooperation and inspiration.

Working in a  co-working space also means far better opportunities to meet prospect clients, hires or friends that you won't usually find in a normal office. Not to mention that you are in the center of a place where a lot is going on other than work; group lunches, parties, workshops, etc. It is like being in a bee hive, a lot is going on, and in a good way.

Personally speaking, “The District” is one of the cool things that happened to me in the past few years. It is an amazing , educating and joyful experience.


### The Raspberry Pi Workshop

The [Raspberry Pi][] is a credit-card sized computer that plugs into your TV and a keyboard. It is a capable little computer which can be used in electronics projects, and for many of the things that your desktop PC does, like spreadsheets, word-processing and games. It also plays high-definition video.

![Raspberry Pi Picture][]

One of the cool workshops that took place in  “The District” was a  two days practical “Raspberry Pi Workshop” conducted by the great founders of “[Blue Horizon Embedded Systems][]”. They are two amazing brothers and engineers from Cape Town in South Africa, who have worked for years in two different companies in the UK and decided it was time they got back to their home country and founded their own venture.

Frederick Lötter and Ernest Lötter, their names, are way too cool to just buy a ticket and go home. They instead planned a very [long roadtrip through two continents][], Europe and Africa, to share their knowledge and conduct a series of hands on workshops in many countries and cities. I was really lucky that not only they gave a workshop in my city, but at the very same co-working space I work from!

I already had bought a Raspberry Pi and got it shipped to Egypt way before the workshop, but I didn't have the time to start hacking any projects using it. After finishing the two days sessions, the inner geek started pushing me to just do something with it.

As any true geek, you start hacking a project that solves your own problem, so I started looking for one of those. I had many cool ideas, but I thought it is time to give back to the community at the place I work in. Thus this project was born.

### The Problem

“The District” has a cool little kitchen service. Co-workers have access to kitchen supplies, like soda drinks, bakery, chocolates, yogurt, juice, etc, for a price near to the market. This saves the co-workers a lot of time going downstairs to the nearest super market, one wouldn't need to that, just walk to the kitchen and your little snack is there waiting for you.

Co-workers would take whatever they want and write down what they consumed on a paper hanged at the fridge in the kitchen. That paper is actually a little neat system consisting of two papers, one listing the codes for the goods, for example, a soda can or juice would go with the code letter “a”, a chocolate bar would go with the code letter “b” and so on. Then we have this other paper that we put a mark under the column corresponding to the item you took, so if you took a soda can you would mark a pipe (the “|” on keyboard) like shown in the picture below :

![Kitchen Paper][]

Every week “The District” team would take that paper of the fridge, calculate every co-worker's tap, and then co-workers would ask weekly or monthly (the managing team is really cool about it) what there tap is and pay for it when they want.

Every week, “The District” has a group lunch, where all the co-workers decide where to order lunch from, and then we all gather around 3.00 pm to have lunch together. It is a custom that every week we have one co-worker speak about himself, specially if he is a new comer, and we all have get to know each other better.

This lunch is managed by “The District” team. They would collect everybody's order, and call the restaurant, and set the dining room. They also pay for it, and then calculate what each co-worker is supposed to pay, and write that number to the co-worker's tap as well.

It also happens that some musician, handicraftsman, or a graphic designer would put some of his or her products by the reception desk. Co-workers who are interested in buying any of those products can just grab them and put them on their taps with “The District” team.

So basically there are two taps for every co-worker, the one hanged in the kitchen, and the other individual items and lunch tap.

It is really a cool system. But as a software engineer, I thought we could do better. So I fired up my laptop and started defining the problems with that system :

1. It involves a lot of tedious manual calculations and paper work from “The District” team to maintain two taps for every co-worker.
Sometimes the prices change. Other times the items list change either by introducing new products or removing old ones. In a paper-based workflow this can become easily a big mess!

2. I noticed that 20% of the items are driving 80% of the taps! Despite this fact, the paper is divided to equal spaced columns. The space reserved for those 20% is the same as the other less frequently marked items. This is already a problem, but if you add joint taps -like the company I work for- to the equation it becomes a disaster! Check the picture below this list.

3. The paper is designed in a way that every co-worker would reserve a row for his name and then mark his or her items in the intersection between his row and the column representing the code letter of the item he bought. Some times the number of rows in smaller than the number of active co-workers that week, so co-workers start extending the table manually and “The District” team would notice and print even more papers to cover the need.

4. Any analysis of the previous data would be hell! If “The District” team wanted to any kind of analysis on that data they will first have to digitize it manually before it made any sense!

5. Paper systems like this one have no sense of timings! They will give you total purchases done on single day, but they will never tell you when was each purchase made, or how are those purchases distributed along the day.

![Kitchen Paper Problem][]

### The Proposed Solution

After defining the problem, I started thinking of digitizing the process, since this is my area of expertise.

The first solution I came up with is to create a web based application that co-workers would log on to and add the items they bought to their taps. I talked with “The District” team members and Eline, one of the team, pointed out that any alternative solution has to be in the kitchen. People would grab some items and on the way they may chat with other co-workers and by the time they get to their desks they may have forgotten that they grabbed something in the first place!

Having taken that Raspberry Pi workshop, I thought I could make use of that. So I came up with the idea of attaching a Pi to a touch screen. Every co-worker would receive a secret number to unlock the screen and log in. They would then see a list of the available products and would just mark what they took. The pi would then save their purchase, with a timestamp.

This setup would serve well for collecting data, but it would be painful to view data just yet. So I thought of creating a web based application that the pi would send the data periodically to through the internet using a custom designed API.

From here it seemed pretty natural to create two other web based applications.

The first web application is for “The District” team to manage the co-workers accounts, manage the products, and view different kinds of reports, from the users taps to general graphs about consumptions rates and items popularity.

The second web application is for the co-workers themselves to be able to monitor their taps and save some time asking every now and then about their amount due.

After talking with “The District” team they liked the idea very much!

### The Plan

I am a full time employee right now, and this means I only get to work on this project in my personal free time. This proposes a big challenge, as I would only have one day per week to work on this project (I have to spend the other weekend day with my beloved wife and my little son).

As a Free and Open Source Software (FOSS) believer, I thought the best model to go with this project is to open source it. This would leverage the great talent pool both in “The District” and online as everybody will be free to contribute to the project.

We just started the project a couple of weeks ago. I will be posting sequels to this post documenting how it evolves, and any lessons learned from it. If you are interested, this project is open to contribution, you can find the source code to the project on its [Github repositories][].

Since it is to an extent a critical project, we plan on testing it first on a few co-workers in a “closed beta” kind of. After it is thoroughly tested and production ready, we plan on releasing it for all co-workers in “The District”.

I am really excited for working on such a project.

That's it for now. See you in future sequels for this post.


[Yubb Software]: http://www.yubb-software.com
[zlien]: http://www.zlien.com
[The District]: http://www.district-egypt.com
[Raspberry Pi]: http://www.raspberrypi.org/faqs
[Raspberry Pi Picture]: http://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/RaspberryPi.jpg/800px-RaspberryPi.jpg
[Blue Horizon Embedded Systems]: http://www.bluehorizonembedded.co.za/
[long roadtrip through two continents]: http://www.raspberrypi.org/archives/3939
[Kitchen Paper]: http://farm6.staticflickr.com/5475/11676439544_2e3e8a037a_c.jpg
[Kitchen Paper Problem]: http://farm3.staticflickr.com/2807/11676439514_6b1271daa0_c.jpg
[Github repositories]: https://github.com/organizations/PiDistrict
