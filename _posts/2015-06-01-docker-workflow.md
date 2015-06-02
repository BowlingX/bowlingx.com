---
layout: blog-hero
title: A Docker-Workflow
class: hero-page
title-class: docker
draft: true
excerpt: Creating a web-development environment for all stages.
---

## One setup fits them all 

Since I started with docker a few month ago, I wondered how to archive the following: 

Having a simple development setup and deploy the same to a _staging_ environment without loosing the ability to
have my changes reflected immediately and without rebuilding the container(s) all the time during development.

A simple but effective way to do this is using **`ENV`** in combination with **`VOLUME`**.

### Dockerize a simple PHP-Application

The basic idea is: We use a Volume during development and bundle the source later inside the immutable container 
for a staging/production deployment.

{% highlight docker linenos=table%}

FROM bowlingx/docker-nginx-php
MAINTAINER David Heidrich (me@bowlingx.com)

# default environment is dev
ENV DEV_ENV dev

{% endhighlight %}

