---
date: '{{ .Date }}' # date in which the content is created - defaults to "today"
title: '{{ replace .File.ContentBaseName `-` ` ` | title }}'
draft: false # set to "true" if you want to hide the content 

name: "" # place/city/country for the experience. Fill-in.
position: "" # from-to, for example "2022-2024". Fill-in.

params:
    logo:
        src: "" # example: "images/clients/asgardia.png"

## For the content, you can use markdown
##
---
