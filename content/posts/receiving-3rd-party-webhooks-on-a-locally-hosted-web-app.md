---
title: "Receiving 3rd party webhooks on a locally hosted web app"
date: 2017-07-18
slug: "/2017/07/18/receiving-3rd-party-webhooks-locally-hosted-web-app/"
category: Code
tags:
  - Webhooks
---

I spent today integrating [Paddle](https://www.paddle.com/) into Readership. Readership isn’t hosted anywhere publicly available yet, so I needed a way to feed Paddle’s webhooks to a URL on localhost.

Enter [UltraHook](http://www.ultrahook.com/). Having used it for a few hours, I really can’t fault it. It’s lightweight, it’s stable and it just works.

Getting up and running is a 3 step process if you already have Ruby installed:

1​. Install it:

```
$ gem install ultrahook
```

2​. Configure it (you get an API key when you sign up):

```
$ echo "api_key: YOUR_API_KEY" > ~/.ultrahook
```

3​. Run it:

```
$ ultrahook paddle-alerts 8888/api/v1/paddle/alerts/new
```

The command in step 3 tells UltraHook to listen for webhooks `POST`ed to `http://paddle-alerts.USERNAME.ultrahook.com` and forward them to `localhost:8888/api/v1/paddle/alerts/new` on your machine. All that’s left to do is to tell the service you’re receiving webhooks from to send them to the generated `ultrahook.com` URL.

