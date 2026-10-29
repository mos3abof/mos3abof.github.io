+++
title = "Resume"
template = "resume.html"

[extra]
tagline = "Software & Systems Engineer · Infra · SRE"

[extra.labels]
experience = "Experience"
previously = "Previously"
earlier = "Earlier roles, in Cairo"
open_source = "Open source"
more_projects = "All my projects"
talks = "Public Talks"
skills = "Skills"
education = "Education"
languages = "Languages"

[[extra.links]]
text = "Download my Resume PDF"
url = "/files/MosabIbrahim.pdf"
icon = "file"
primary = true
download = true

[[extra.links]]
text = "Recommendations"
url = "recommendations/"

[[extra.links]]
text = "LinkedIn"
url = "https://www.linkedin.com/in/mosab"

[[extra.links]]
text = "GitHub"
url = "https://github.com/mos3abof"

[[extra.stats]]
label = "Experience"
value = "20+ years"
note = "From startups to hyperscale"

[[extra.stats]]
label = "Scale at Meta"
value = "3.7B users"
note = "Backup and restore across Facebook, Messenger, Instagram and WhatsApp"

[[extra.stats]]
label = "Fleet at Databricks"
value = "Millions"
note = "of customer databases on Lakebase"

[[extra.stats]]
label = "Automation at Twitter"
value = "100k+ hours"
note = "of toil saved, with provisioning time cut by 98%"

[[extra.roles]]
title = "Senior Production Engineer, Lakebase"
org = "[Databricks](https://databricks.com) / [Neon](https://neon.tech)"
location = "Remote, United Kingdom"
time = "Apr 2025 – Sep 2026"
tone = "accent"
points = [
  "Reliability engineer for Lakebase, Databricks' serverless Postgres (built on Neon), operating and expanding a multi-region, multi-cloud fleet hosting millions of customer databases.",
  "Designed and implemented fleet-wide, pod-level network isolation across AWS, Azure and GCP: a security control required for public availability. Tuning CNI implementations cut CPU by 97% and memory by 99%, and policy-reconcile latency from tens of seconds to tens of milliseconds.",
  "Shaped incident response practice, led investigations and postmortems for multi-region outages, and commanded concurrent SEV0 incidents in a single on-call shift.",
  "Reduced on-call toil with a unified on-call CLI, cloud health-event ingestion with auto-remediation, and Terraform drift detection.",
]

[[extra.roles]]
title = "Family & Personal Care"
org = "Career break"
location = "United Kingdom"
time = "Sep 2024 – Apr 2025"
points = [
  "Stepped away for family and personal reasons, and returned recharged and ready to build.",
]

[[extra.roles]]
title = "Production Engineer"
org = "Meta / Facebook"
location = "London, United Kingdom"
time = "Mar 2022 – Aug 2024"
points = [
  "Built services and tooling on the Backup and Restore team to recover MySQL and ZippyDB data reliably: the defence line against data loss and corruption across Facebook, Messenger, Instagram and WhatsApp (3.7 billion users).",
  "Led projects that unblocked large-scale data restoration in disaster scenarios and reduced recovery time objectives (RTO).",
  "Fixed performance bottlenecks in fleet-wide backup and restore agents, reducing memory and compute across hundreds of thousands of servers.",
  "Led investigations into production incidents, and introduced investigation practices adopted across teams.",
]

[[extra.roles]]
title = "Senior Site Reliability Engineer"
org = "Twitter"
location = "London, United Kingdom"
time = "May 2020 – Mar 2022"
points = [
  "Provided the whole company with database infrastructure on the [Database SRE team](https://www.youtube.com/watch?v=hQQTRE48sw8): mainly MySQL clusters, plus PostgreSQL, Vertica and Druid.",
  "Designed and built a service that automated provisioning toil, cutting time-to-provision by 98% and saving over 100k person-hours.",
  "Led projects to reduce on-call noise, and authored runbooks and documentation that improved incident response.",
]

[[extra.roles]]
title = "Site Reliability Engineer"
org = "GoCardless"
location = "London, United Kingdom"
time = "Mar 2019 – Mar 2020"
points = [
  "Protected, provided for and progressed the software and systems behind the GoCardless product, supporting product teams in deploying high-quality services.",
]

[[extra.roles]]
title = "Software Engineer"
org = "WeQ Global Tech GmbH"
location = "Berlin, Germany"
time = "Nov 2017 – Mar 2019"
points = [
  "Developed, deployed and maintained customer-facing services handling billions of requests per day.",
  "Created and maintained infrastructure as code, and implemented autoscaling and self-healing features in new services.",
]

[[extra.roles]]
title = "Senior Software & Platform Engineer, Tech Lead"
org = "Levelset (formerly zlabs, acquired by Procore)"
location = "Cairo, Egypt"
time = "Jan 2017 – Sep 2017"
earlier_title = "Senior Software Engineer, DevOps"
earlier_time = "Mar 2013 – Jan 2017"
points = [
  "Led the migration of levelset.com to microservices, and designed and built the enterprise-onboarding API and the PDF generation engine at the platform's core.",
  "Moved the platform from single-point-of-failure virtual private servers to AWS, cutting release time from 2 days to 3–5 minutes and reaching 99.99% uptime.",
]

[[extra.earlier]]
title = "Senior Software Engineer"
org = "Handmade Studios"
time = "2012 – 2013"

[[extra.earlier]]
title = "Senior Software Engineer"
org = "Inmobly"
time = "2011 – 2012"

[[extra.earlier]]
title = "Technical Consultant"
org = "Bluw i LTD"
time = "2011"

[[extra.earlier]]
title = "Software Engineer, Tech Lead"
org = "Wuzzuf.net"
time = "2010 – 2011"
note = "Designed the architecture and led delivering the platform from scratch."

[[extra.earlier]]
title = "Senior Software Engineer"
org = "Arabia Inform"
time = "2009 – 2010"

[[extra.earlier]]
title = "Software Engineer"
org = "Citex Software"
time = "2008 – 2009"

[[extra.earlier]]
title = "PHP Developer"
org = "Media International"
time = "2007 – 2009"

[[extra.earlier]]
title = "PHP Developer"
org = "20at.com"
time = "2004 – 2006"

[[extra.projects]]
name = "hunt"
year = "2026"
url = "https://careerhunt.app"
text = "An open source, Rust-based dashboard for job seekers to manage their applications."

[[extra.projects]]
name = "Arabesque Design System"
year = "2026"
url = "https://design.arabesquelabs.com/"
text = "A design system that treats accessibility and RTL as first-class citizens."

[[extra.projects]]
name = "Zola Arabesque Theme"
year = "2026"
url = "https://arabesquelabs.github.io/zola-theme-arabesque/"
text = "A calm, accessible, bidirectional theme for Zola, featured in its official theme gallery."

[[extra.projects]]
name = "Power Close"
year = "2014"
url = "https://power-close.scenarios"
text = "A browser extension for tab addicts. Type a domain name, hit enter, and every tab open on that domain is closed instantly."

[[extra.projects]]
name = "Toggl Target"
year = "2013"
url = "https://github.com/mos3abof/toggl_target"
text = "A CLI tool for planning weekly working hours, featured in Toggl's docs as a reference Python API client."

[[extra.talks]]
title = "About SRE"
venue = "null++ podcast (in Arabic)"
year = "2020"
url = "https://nullplus.plus/episodes/episode41-sre-with-mosab-ibrahim"

[[extra.talks]]
title = "A chat about my career in tech"
venue = "Tech and Coffee podcast (in Arabic)"
year = "2020"
url = "https://www.youtube.com/watch?v=1ehCq1HQ0P0"

[[extra.skills]]
name = "Focus"
items = ["Distributed systems", "Database infra", "Reliability", "Incident response"]

[[extra.skills]]
name = "Programming"
items = ["Go", "Python", "Rust", "PHP"]

[[extra.skills]]
name = "Databases"
items = ["PostgreSQL", "MySQL", "ZippyDB", "Vertica", "Druid"]

[[extra.skills]]
name = "Infrastructure"
items = ["Kubernetes", "Terraform", "AWS", "Azure", "GCP", "Linux", "Docker"]

[[extra.skills]]
name = "Observability"
items = ["Prometheus", "Grafana", "Thanos"]

[extra.education]
title = "Bachelor's in Computer Engineering (dropped out)"
org = "University of Cairo"
time = "2003 – 2007"
note = "Explored architecture, civil and computer engineering, and commerce, before an unexpected major life event and family commitments forced me to drop out. I take pride in being an eager lifelong learner."

[[extra.languages]]
name = "Arabic"
level = "Native"

[[extra.languages]]
name = "English"
level = "Professional"
+++

With two decades of experience as a Software & Systems Engineer, I've built a
career on designing, deploying, and maintaining high-performance systems at
scale. My journey has taken me through diverse industries and some of the
world's most demanding environments, including Meta (Facebook) and Twitter.

My passion lies in solving intricate problems related to large-scale systems,
Linux, databases, systems programming, distributed systems, and automation. I'm
a strong advocate for free and open-source software, believing in the power of
collaborative innovation.

I'm driven by a desire to continuously learn and push the boundaries of what's
possible. I'm always seeking new challenges and opportunities to leverage my
expertise and make a meaningful impact.
