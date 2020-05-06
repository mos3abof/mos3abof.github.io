#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'Mosab Ibrahim'
SITENAME = 'Mosab Ibrahim'
SITESUBTITLE = """Site Reliability Engineer
                @
                <a href="https://twitter">Twitter</a>"""
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

DEFAULT_DATE_FORMAT = '%d %b %Y'
# Uncomment following line if you want document-relative URLs when developing
RELATIVE_URLS = True
