---
title: "Upgrading my Hackintosh from El Capitan to High Sierra"
date: 2017-11-23
slug: "/2017/11/23/upgrading-my-hackintosh-from-el-capitan-to-high-sierra"
category: Misc
tags:
  - Hackintosh
---

I’ve been running [a Hackintosh as my main machine](https://elliotekj.com/2017/01/18/my-hackintosh-6-months-in-specs-thoughts-and-useful-links/) for the last year and a bit, and it’s been steady as a rock.

The time came yesterday to upgrade the OS from El Capitan to High Sierra though. My first OS upgrade since building the machine.

Hackintosh OS upgrades are renowned for being finicky: it’s one of the main criticisms I hear against them. Granted it’s not quite as simple as downloading and running the installer as you would with a regular Mac, but the tools and documentation provided by the Hackintosh community have never been better. I got it done in a couple of hours with most of that time spent either waiting for High Sierra to download or waiting for High Sierra to install.

### Specs

Here’s a quick reminder of the specs I’m running:

- **Motherboard:** Gigabyte Z170MX-Gaming 5
- **CPU:** Intel Core i7 6700K
- **CPU cooler:** Corsair H60 (Water)
- **Graphics card:** EVGA GTX 950 SuperClocked
- **RAM:** Crucial Ballistix Sport LT 64GB (DDR4)
- **Drive:** Samsung 850 EVO 500GB
- **PSU:** Corsair CP 650 Watt
- **Case:** BitFenix Phenom Micro-ATX (Black)
- **Wifi adapter:** TP-Link PCI Express Adapter

### Downloading the High Sierra installer

Right out of the gate I ran into my first problem: the App Store wasn’t letting me download the High Sierra installer.

The error shown read something along the lines of: “This version of macOS 10.12 cannot be installed on this computer”. This was due the System Definition I set in MultiBeast when I installed El Capitan (“Mac Pro 3,1”). Getting past the error was as simple as loading my old config file into MultiBeast, changing the System Definition (Customize › System Definitions) to “iMac 14,2”, running MultiBeast again, and rebooting.

### Installation

The [documentation on tonymacx86](https://www.tonymacx86.com/threads/update-directly-to-macos-high-sierra.232707/) for upgrading to macOS High Sierra worked perfectly for me. The only things worth mentioning here are:

- As I’m running an SSD I followed the APFS section of the guide.
- I updated Clover using the linked Clover package, not MultiBeast.
- In step 2, the only kext I copied over was `FakeSMC.kext`.

### NVIDIA drivers

Getting the NVIDIA Web Driver to initiate on boot was what took up most of the non-waiting-for-the-computer-to-do-its-thing time. If you’re upgrading your Hackintosh from Sierra to High Sierra, this shouldn’t be as time consuming, as you’ll have already dealt with the fact that `nvda_drv=1` doesn’t work anymore. As I skipped Sierra I didn’t know about that change though and had to spend some time Googling around before finding the solution.

Here are the steps needed to get your NVIDIA driver working properly:

1. Open the NVIDIA Driver Manager preference pane, go into the “Updates” tab, click “Check Now” and install the latest version.
2. Open [Clover Configurator](http://mackie100projects.altervista.org/download-clover-configurator/), mount your EFI and load your `config.plist`.
3. Under “Boot”, uncheck the `nvda_drv=1` option.
4. Under “System Parameters”, make sure “Inject Kexts” is set to “Yes” then check the “NVIDIAWeb” option.
5. Restart your system.

### Conclusion

1 day in and so far everything seems to be working perfectly. I’ve had no issues with Wi-Fi, graphics, or anything else for that matter. No unexplained crashes (touch wood — as far as I can recall, the machine has never actually crashed). No software or hardware issues either.

Yes, the Hackintosh OS upgrade process is trickier than that of a regular Mac, but I can live with spending a couple of hours on it once a year.

I remain very pleased with my Hackintosh.

