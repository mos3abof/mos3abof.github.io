+++
title = "Toggl Target"
weight = 10
description = "At work we had to track our working hours on Toggl, so I built this small tool to calculate exactly how many hours I need to work each day to hit my monthly targets."
template = "project.html"
aliases = ["/projects/01-toggl-target/"]

[extra]
year = "2013"
image = "cover.jpg"
source = "https://github.com/mos3abof/toggl_target"
+++

At work we had to track our working hours on [Toggl](https://www.toggl.com), so I built this small tool to calculate how many hours I needed to work each day to hit my monthly targets. It queries the Toggl API to pull actual hours worked so far, then computes how many hours are left to reach the goal across the remaining working days.
