#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'Mosab Ibrahim'
SITENAME = 'Mosab Ibrahim'
SITESUBTITLE = """Site Reliability Engineer
                @
                <a href="https://gocardless.com">GoCardless</a>"""
SITEURL = 'https://mosab.co.uk'
THEME = 'theme/mosab'

PATH = 'content'

TIMEZONE = 'Europe/London'

DEFAULT_LANG = 'en'

PLUGINS = [
    # ...
    'pelican_gist',
    # ...
]

DATE_FORMATS = {
    'en': ('en_US', '%d %b %Y'),
    }
# Uncomment following line if you want document-relative URLs when developing
RELATIVE_URLS = True
