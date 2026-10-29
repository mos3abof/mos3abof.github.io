+++
title = "سيرتي الذاتية"
template = "resume.html"

[extra]
tagline = "مهندس برمجيات ونظم · بنية تحتية · هندسة الاعتمادية"

[extra.labels]
experience = "الخبرة العملية"
previously = "قبل ذلك"
earlier = "وظائف سابقة في القاهرة"
open_source = "مشاريع مفتوحة المصدر"
more_projects = "كل مشاريعي"
talks = "لقاءات عامة"
skills = "المهارات"
education = "التعليم"
languages = "اللغات"

[[extra.links]]
text = "نزّل سيرتي الكاملة (PDF بالإنجليزية)"
url = "/files/MosabIbrahim.pdf"
icon = "file"
primary = true
download = true

[[extra.links]]
text = "توصيات زملائي (بالإنجليزية)"
url = "recommendations/"

[[extra.links]]
text = "LinkedIn"
url = "https://www.linkedin.com/in/mosab"

[[extra.links]]
text = "GitHub"
url = "https://github.com/mos3abof"

[[extra.stats]]
label = "الخبرة"
value = "أكثر من 20 عامًا"
note = "من الشركات الناشئة إلى أضخم الأنظمة"

[[extra.stats]]
label = "النطاق في Meta"
value = "3.7 مليار مستخدم"
note = "النسخ الاحتياطي والاستعادة لفيسبوك وماسنجر وإنستغرام وواتساب"

[[extra.stats]]
label = "الأسطول في Databricks"
value = "الملايين"
note = "من قواعد بيانات العملاء على Lakebase"

[[extra.stats]]
label = "الأتمتة في Twitter"
value = "أكثر من 100 ألف"
note = "ساعة عمل متكرر وُفّرت، مع خفض زمن التجهيز بنسبة 98%"

[[extra.roles]]
title = "Senior Production Engineer, Lakebase"
org = "[Databricks](https://databricks.com) / [Neon](https://neon.tech)"
location = "عن بُعد، المملكة المتحدة"
time = "أبريل 2025 – سبتمبر 2026"
tone = "accent"
points = [
  "عملت مهندس اعتمادية لمنصة Lakebase، خدمة Postgres بلا خوادم من Databricks والمبنية على Neon، فشغّلت ووسّعت أسطولًا متعدد المناطق والسحابات يستضيف ملايين قواعد بيانات العملاء.",
  "صمّمت ونفّذت عزل الشبكة على مستوى الـ pod عبر الأسطول كله في AWS وAzure وGCP، وهو ضابط أمني كان شرطًا لإتاحة المنصة للجمهور. وخفض ضبط تطبيقات CNI استهلاك المعالج بنسبة 97% والذاكرة بنسبة 99%، وزمن مزامنة السياسات من عشرات الثواني إلى عشرات المللي ثانية.",
  "أسهمت في صياغة ممارسات الاستجابة للحوادث، وقدت التحقيقات وكتبت تقارير ما بعد الحوادث للانقطاعات متعددة المناطق، وتوليت قيادة حوادث متزامنة من الدرجة SEV0 في مناوبة واحدة.",
  "قلّلت العمل المتكرر في المناوبات بأداة سطر أوامر موحدة، واستقبال أحداث صحة السحابة مع المعالجة التلقائية، وكشف انحراف Terraform.",
]

[[extra.roles]]
title = "رعاية الأسرة وشؤون شخصية"
org = "استراحة مهنية"
location = "المملكة المتحدة"
time = "سبتمبر 2024 – أبريل 2025"
points = [
  "ابتعدت عن العمل لأسباب عائلية وشخصية، وعدت بطاقة متجددة ومستعدًا للبناء.",
]

[[extra.roles]]
title = "Production Engineer"
org = "Meta / Facebook"
location = "لندن، المملكة المتحدة"
time = "مارس 2022 – أغسطس 2024"
points = [
  "بنيت في فريق النسخ الاحتياطي والاستعادة خدمات وأدوات لاستعادة بيانات MySQL وZippyDB باعتمادية، وهي خط الدفاع ضد فقدان البيانات وتلفها في فيسبوك وماسنجر وإنستغرام وواتساب (3.7 مليار مستخدم).",
  "قدت مشاريع أتاحت استعادة البيانات على نطاق واسع في سيناريوهات الكوارث، وخفّضت زمن الاستعادة المستهدف (RTO).",
  "عالجت اختناقات الأداء في وكلاء النسخ الاحتياطي والاستعادة، فخفّضت استهلاك الذاكرة والمعالجة عبر مئات آلاف الخوادم.",
  "قدت التحقيق في حوادث الإنتاج، وأرسيت ممارسات للتحقيق اعتمدتها فرق عدة.",
]

[[extra.roles]]
title = "Senior Site Reliability Engineer"
org = "Twitter"
location = "لندن، المملكة المتحدة"
time = "مايو 2020 – مارس 2022"
points = [
  "وفّرت للشركة كلها، ضمن [فريق اعتمادية قواعد البيانات](https://www.youtube.com/watch?v=hQQTRE48sw8)، البنية التحتية لقواعد البيانات: عناقيد MySQL أساسًا، إضافة إلى PostgreSQL وVertica وDruid.",
  "صمّمت وبنيت خدمة أتمتت أعمال التجهيز المتكررة، فخفّضت زمنها بنسبة 98% ووفّرت أكثر من 100 ألف ساعة عمل.",
  "قدت مشاريع لتقليل ضجيج تنبيهات المناوبة، وكتبت أدلة تشغيل ووثائق حسّنت الاستجابة للحوادث.",
]

[[extra.roles]]
title = "Site Reliability Engineer"
org = "GoCardless"
location = "لندن، المملكة المتحدة"
time = "مارس 2019 – مارس 2020"
points = [
  "حميت البرمجيات والأنظمة التي يقوم عليها منتج GoCardless وطوّرتها، ودعمت فرق المنتج في نشر خدمات عالية الجودة.",
]

[[extra.roles]]
title = "Software Engineer"
org = "WeQ Global Tech GmbH"
location = "برلين، ألمانيا"
time = "نوفمبر 2017 – مارس 2019"
points = [
  "طوّرت ونشرت وصنت خدمات للعملاء تعالج مليارات الطلبات يوميًا.",
  "أنشأت وصنت البنية التحتية في صورة كود، وأضفت إلى الخدمات الجديدة التوسع التلقائي والإصلاح الذاتي.",
]

[[extra.roles]]
title = "Senior Software & Platform Engineer, Tech Lead"
org = "Levelset (zlabs سابقًا، استحوذت عليها Procore)"
location = "القاهرة، مصر"
time = "يناير 2017 – سبتمبر 2017"
earlier_title = "Senior Software Engineer, DevOps"
earlier_time = "مارس 2013 – يناير 2017"
points = [
  "قدت نقل levelset.com إلى بنية الخدمات المصغرة، وصمّمت وبنيت واجهة API لانضمام عملاء الشركات، ومحرك توليد ملفات PDF الذي يمثل جوهر المنصة.",
  "نقلت المنصة من خوادم افتراضية تمثل نقطة فشل واحدة إلى AWS، فتقلص زمن الإطلاق من يومين إلى 3–5 دقائق، وارتفع وقت التشغيل إلى 99.99%.",
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
note = "صمّمت بنية المنصة وقدت إطلاقها من الصفر."

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
text = "لوحة مفتوحة المصدر مكتوبة بلغة Rust، تساعد الباحث عن عمل على إدارة طلبات التوظيف."

[[extra.projects]]
name = "Arabesque Design System"
year = "2026"
url = "https://design.arabesquelabs.com/"
text = "نظام تصميم يضع إمكانية الوصول والكتابة من اليمين إلى اليسار في صدارة أولوياته."

[[extra.projects]]
name = "Zola Arabesque Theme"
year = "2026"
url = "https://arabesquelabs.github.io/zola-theme-arabesque/"
text = "قالب هادئ وسهل الوصول وثنائي الاتجاه لمولّد المواقع Zola، مدرج في معرض قوالبه الرسمي."

[[extra.projects]]
name = "Toggl Target"
year = "2013"
url = "https://github.com/mos3abof/toggl_target"
text = "أداة سطر أوامر لتخطيط ساعات العمل الأسبوعية، ذكرتها وثائق Toggl مثالًا مرجعيًا بلغة Python."

[[extra.talks]]
title = "عن هندسة الاعتمادية"
venue = "بودكاست null++"
year = "2020"
url = "https://nullplus.plus/episodes/episode41-sre-with-mosab-ibrahim"

[[extra.talks]]
title = "حديث عن مسيرتي في التقنية"
venue = "بودكاست Tech and Coffee"
year = "2020"
url = "https://www.youtube.com/watch?v=1ehCq1HQ0P0"

[[extra.skills]]
name = "مجالات التركيز"
items = ["الأنظمة الموزعة", "البنية التحتية لقواعد البيانات", "الاعتمادية", "الاستجابة للحوادث"]

[[extra.skills]]
name = "البرمجة"
items = ["Go", "Python", "Rust", "PHP"]

[[extra.skills]]
name = "قواعد البيانات"
items = ["PostgreSQL", "MySQL", "ZippyDB", "Vertica", "Druid"]

[[extra.skills]]
name = "البنية التحتية"
items = ["Kubernetes", "Terraform", "AWS", "Azure", "GCP", "Linux", "Docker"]

[[extra.skills]]
name = "المراقبة"
items = ["Prometheus", "Grafana", "Thanos"]

[extra.education]
title = "بكالوريوس هندسة الحاسبات (لم أكمله)"
org = "جامعة القاهرة"
time = "2003 – 2007"
note = "درست العمارة والهندسة المدنية وهندسة الحاسبات والتجارة، قبل أن يضطرني حدث كبير غير متوقع والتزامات عائلية إلى ترك الدراسة. وأعتز بأنني متعلم شغوف مدى الحياة."

[[extra.languages]]
name = "العربية"
level = "اللغة الأم"

[[extra.languages]]
name = "الإنجليزية"
level = "كفاءة مهنية"
+++

على مدى عقدين من العمل مهندسًا للبرمجيات والنظم، بنيت مسيرتي المهنية حول تصميم
أنظمة عالية الأداء ونشرها وصيانتها على نطاق واسع. وقد تنقّلت بين قطاعات متنوعة
وبعض أكثر بيئات العمل تطلبًا في العالم، ومنها ميتا (فيسبوك) وتويتر.

شغفي هو حل المشكلات المعقدة في الأنظمة واسعة النطاق، ولينكس، وقواعد البيانات،
وبرمجة النظم، والأنظمة الموزعة، والأتمتة. وأنا من أشد المناصرين للبرمجيات الحرة
ومفتوحة المصدر، لإيماني بقوة الابتكار الجماعي.

يدفعني حرص دائم على التعلم وعلى تجاوز حدود الممكن، وأبحث باستمرار عن تحديات وفرص
جديدة أوظّف فيها خبرتي وأترك أثرًا حقيقيًا.
