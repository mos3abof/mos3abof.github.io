# encoding: utf-8

from __future__ import unicode_literals

AUTHOR = 'Mosab Ahmad'
SITENAME = 'Mosab Ahmad'
SITEURL = '.'

FEED_DOMAIN = SITEURL
FEED_ATOM = 'feeds/all.atom.xml'

DIRECT_TEMPLATES = [
    'index',
#    'tags',
    'categories',
    'archives',
   'about',
   'projects',
]

TIMEZONE = 'Africa/Cairo'
DEFAULT_DATE_FORMAT = '%d %b, %Y'
DATE_FORMATS = {
    'en': '%d %b, %Y',
}

# Markdown extensions at http://pythonhosted.org/Markdown/extensions/index.html
MD_EXTENSIONS = 'extra codehilite toc sane_lists'.split()

#PLUGINS = 'minify'.split()

DISQUS_SITENAME = 'mos3abof.com'

DEFAULT_LANG = 'en'

DEFAULT_PAGINATION = False

THEME = 'theme'

# TODO: Typogrify depends on Django. Cut it and then use it.
# TYPOGRIFY = True

TWITTER_USERNAME = 'mos3abof'

MENUITEMS = [
    ('About', 'about.html'),
    ('Projects', 'projects.html'),
    ('Archives', 'archives.html'),
    ('Atom Feed', FEED_ATOM),
]

# Blogroll
LINKS = [
    ('Pelican', 'http://docs.notmyidea.org/alexis/pelican/'),
    ('Python.org', 'http://python.org'),
    ('Jinja2', 'http://jinja.pocoo.org'),
]

# Social widget
SOCIAL = [
    ('You can add links in your config file', '#'),
    ('Another social link', '#'),
]

