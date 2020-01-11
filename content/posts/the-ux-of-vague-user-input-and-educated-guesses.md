---
title: "The UX of vague user input and educated guesses"
date: 2017-12-13
slug: "/2017/12/13/the-ux-of-vague-user-input-and-educated-guesses"
category: Design
tags:
  - UX
---

I got an Amazon Echo Dot a couple of months ago — my first voice assistant and the only one I’ve used. I’ve found it to be largely underwhelming on the software front. Maybe I just set my expectations too high because of all the wonderful things the people I follow have been saying about it since its release. The following is neither a rant about nor a full review of the software. It is merely my thoughts on how a specific though frequently used bit of functionality could be improved.

Like many, I keep my Echo in the kitchen. It’s the ideal environment for voice assistants in general and the Echo in particular to shine. Want to play or pause music whilst your hands are covered in flour? Shout at the Echo. Need to add something to the shopping list? Shout at the Echo. Need a timer? Shout at the Echo. Want to be reminded about something? Shout at the Echo.

It’s that last interaction and the ones like it that I feel have huge room for improvement.

_Scene: It’s early afternoon and you’ve just received a text from a friend asking if you’re up for a gym session that evening. You are, so you ask your Echo to remind you about it later._

**You:** “Alexa, remind me to go to the gym at five-thirty.”

A perfect response to this would be something along the lines of “Okay, I’ll remind you”. What we get instead is…

**Alexa:** “Is that five-thirty in the morning or in the afternoon?”

…which is a reasonable enough clarification to ask for. The issue I have with it is that every time the user forgets to specify whether the reminder is intended for the morning or the afternoon, they are blocked at this point and have to wait for Alexa to stop speaking in order to respond.

The UX of this can be vastly improved by making an educated guess based on the context. What do we know? We know that it’s early afternoon. We know from previous reminders that the user tends to schedule activities of this nature for late afternoon / early evening. Depending on whether or not the user specifies the name of the gym, we may even know that said gym doesn’t open until 9am. From that context, an educated guess can be made that the user means 5:30pm.

Alexa may well get the occasional guess wrong though, which is why you’d append “Did you mean 5:30am?” to the confirmation. That way instead of the above we wind up with this.

**You:** “Alexa, remind me to go to the gym at five-thirty.”

**Alexa:** “Okay, I’ll remind you at 5:30 this afternoon. Did you mean 5:30am?”

…and if you did mean “am”…

**You:** “Yes.”

**Alexa:** “Okay, I’ll remind you at 5:30am instead.”

With this new way of specifying morning or afternoon, the user can stop listening at the end of the first part of the confirmation if Alexa guessed correctly. Only if the guess was wrong does the user need to have any more interaction with the device, thus completely avoiding both the lingering necessary before “morning” or “afternoon” can be clarified and the need to clarify at all.

At this level, interaction changes that can save the user multiple seconds every time aren’t a dime a dozen. Pick that low hanging fruit.

