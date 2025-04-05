---
date: '{{ .Date }}' # date in which the content is created - defaults to "today"
title: '{{ replace .File.ContentBaseName `-` ` ` | title }}'
draft: false # set to "true" if you want to hide the content 

link: "https://www.adrianmoreno.info" # optional URL to link the logo to

params:
    logo:
        src: "" # example: "images/clients/asgardia.png"
        scale: 0.5

## The content is not used (yet). If you have ideas on how to use it, 
## you can suggest it at https://github.com/zetxek/adritian-free-hugo-theme/discussions 
---
