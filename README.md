# Personal Website

This website[^1] uses [zola][1], your one-stop static site engine that is
implemented in [rust][2], and is hosted on [Github Pages][4].

Website is built using [Github Actions][5] that builds and publishes any
updates with new commits.

The domain name is registered via [Godaddy][6] with its DNS records configured
to use [Github Pages Custom Domain][7].

This website is [secured with HTTPS][8], that uses [Let's Encrypt][9] under the
hood.

The theme is [zola-theme-arabesque][10], copied into `themes/arabesque/` rather
than added as a submodule (jj has no submodules). `themes/arabesque/VERSION`
says which commit it is; `make vendor-theme THEME_REF=<branch, tag or commit>`
replaces it. Don't edit the copy: the site's `templates/` and `static/`
override its files of the same name, and `styles/input.css` restyles it
(`make compile-css` builds `static/css/style.css`).

[1]: https://mosab.co.uk
[2]: https://getzola.com
[3]: https://www.rust-lang.org/
[4]: https://pages.github.com/
[5]: https://features.github.com/actions
[6]: https://www.godaddy.com/
[7]: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
[8]: https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
[9]: https://letsencrypt.org/
[10]: https://github.com/ArabesqueLabs/zola-theme-arabesque

[^1]: [mosab.co.uk](https://mosab.co.uk) 
