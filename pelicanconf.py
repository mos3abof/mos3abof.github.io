# encoding: utf-8

from __future__ import unicode_literals

AUTHOR = 'Mosab Ahmad'
SITENAME = 'Mosab Ahmad'
SITEURL = '.'

FEED_DOMAIN = SITEURL
FEED_ATOM = 'feeds/all.atom.xml'

DIRECT_TEMPLATES = [
    'index',
    #'tags',
    'categories',
    'archives',
    'about',
    'projects',
    '2014',
]

TIMEZONE = 'Africa/Cairo'
DEFAULT_DATE_FORMAT = '%d %b, %Y'
DATE_FORMATS = {
    'en': '%d %b, %Y',
    'ar': '%Y / %m / %d',
}

# Markdown extensions at http://pythonhosted.org/Markdown/extensions/index.html
MD_EXTENSIONS = 'extra codehilite toc sane_lists'.split()

#PLUGINS = 'minify'.split()

DISQUS_SITENAME = 'mos3abof'

DEFAULT_LANG = 'en'

DEFAULT_PAGINATION = False

THEME = 'theme'

PLUGIN_PATH = 'plugins/'
PLUGINS = ('gist', )

# TODO: Typogrify depends on Django. Cut it and then use it.
# TYPOGRIFY = True

TWITTER_USERNAME = 'mos3abof'

MENUITEMS = [
    ('About', 'about.html'),
    ('Projects', 'projects.html'),
    ('2014', '2014.html'),
#    ('Archives', 'archives.html'),
#    ('Atom Feed', FEED_ATOM),
]
