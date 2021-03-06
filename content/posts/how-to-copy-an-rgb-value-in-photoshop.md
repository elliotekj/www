---
title: "How to copy an RGB value in Photoshop"
date: 2015-03-13
slug: "/2015/03/13/how-to-copy-an-rgb-value-in-photoshop"
category: Design
tags:
  - Photoshop
---

The following is a result of me scratching my own itch, hopefully you’ll find it useful too. Before we go any further, it’s worth noting that this is a Mac-only solution. If you’re running Windows and want to re-write what I’ve done in VBScript or Javascript (or are just curious) then carry on. If you just came for the how-to then this isn’t for you, sorry.

Unlike web designers who work primarily with hex values when it comes to colours, interface designers work mostly with RGB(A). Unluckily for us, whilst Photoshop provides an easy way to copy a shape’s hex value to the clipboard it doesn’t offer an RGB(A) equivalent. If you are unfamiliar with this feature of Photoshop, here’s the quickest way to use it:

- Go to `Edit ➜ Keyboard Shortcuts`
- Under `Shortcuts for` select `Panel Menus`
- Toggle `Color`
- Scroll to `Copy Color’s Hex Code` and assign it a keyboard shortcut

I’m constantly grabbing colour values from PSDs, but after a while opening the content options of each of the layers whose values I need, then typing out said values manually into an `RGB([red], [green], [blue])` string gets pretty tedious, pretty quickly.

A few weeks ago I wrote a script that does a fairly good job replicating Photoshop’s native “Copy Color’s Hex Code” except of course, it’s “Copy’s Color’s RGB Code”. It’s been a good time-saving addition to my workflow, despite it’s limitations due to one of Photoshop’s AppleScript restrictions: as far as I can tell from Adobe’s documentation, there’s no way to get any form of colour value from the currently selected layer in Photoshop (although I’m more than happy to be proven wrong if you know of a way). As it doesn’t use the selected layer for the colour, it wouldn’t make sense for it to use the alpha channel value of the currently selected layer either, so if your layer has one you’ll need to add that manually. Hence the use of “RGB” instead of “RGB(A)” above.

What that means is that once setup, the only difference between the native functionality and our scripted one is that you’ll have to use the colour picker to select the colour you want to copy instead of selecting the layer. Whilst not ideal, as I said, it’s still saved me a lot of time.

Ok, now let’s take a look at the script:

```
-- Convert the current foreground colour in
-- Photoshop to RGB then copy to clipboard
-- by Elliot Jackson | http://casualnotebook.com
tell application "Adobe Photoshop CC 2014"
  set fgc to convert color foreground color to RGB
  set redInt to red of fgc as integer
  set greenInt to green of fgc as integer
  set blueInt to blue of fgc as integer
  set the clipboard to "RGB(" & (redInt) & ", " & (greenInt) & ", " & (blueInt) & ")" as text
end tell
```

And here’s a step-by-step of what it’s actually doing:

1. Convert the current foreground colour in Photoshop to red, green and blue values.
2. Independently set the values of the red, green and blue channels to the nearest integer.
3. Add each value to it’s appropriate slot in the “RGB($red, $green, $blue)” string.
4. Copy the whole lot to the clipboard.

Note: The values are put into an RGB() string because of how we have things setup here at Realmac. If you’re interested, here are the macros that we use:

```
#define RGBA(r, g, b, a) [NSColor colorWithDeviceRed:(r / 255.0) green:(g / 255.0) blue:(b / 255.0) alpha:a]
#define RGB(r, g, b) RGBA(r, g, b, 1.0)
```

If you are using a version of Photoshop other than CC 2014, you’ll want to change `tell application "Adobe Photoshop CC 2014"` to whichever release you have.

Let’s get this setup so you can actually use it. There are two parts to this, adding the script as a Service and then giving it a keyboard shortcut in Photoshop.

Setting the script as a Service:

1. Launch “Automator.app” from your Applications folder.
2. Select `New Document ➜ Service`.
3. In the search box (top left), type “Run AppleScript”
4. You should have 1 result come up, if you don’t then make sure “Library” is selected on the left.
5. Drag it over to the main area, delete any code that’s already in the input then paste in the script above.
6. `File ➜ Save` and give it a relevant name, this will be used later.

Triggering it with a Keyboard Shortcut

1. Launch System Preferences then go to `Keyboard`.
2. Go to `Shortcuts ➜ Services`.
3. Scroll down until you see it. It will be named the same as what saved it as in Automator.
4. Select it then click `Add Shortcut`. Make sure this doesn’t conflict with any of your existing Photoshop ones.

Restart Photoshop and there we go, you should now be able to use it. If you want to run it manually, go to `Photoshop ➜ Services ➜ [whatever you named it]` in the menu bar. Granted it takes a few minutes to setup but in the long run, it’s worth it.

Hopefully you’ll find this as useful as I have.

_Note: This is a re-post from my old (and retired) blog._

