# Smartport

An example Fitbit app that tells you the best connection from work to home and viceversa (it uses the https://transport.opendata.ch open API, so I guess it's only for people living in Switzerland for now :) )

## Considerations

The platform is quite young still but very exciting given it feeds from the open web and uses JS (the closest to the **real** JS), some sort of SVG for the view and some sort of CSS for styles.

However, there's not so much out there beyond the Fitbit documentation when one wants to dive into the platform so I started doing my own little apps to discover how far one can go with this SDK :)

That being said, there are some limitations the platform imposes that impact the code that you can actually produce/run on the device, in my case a Fitbit Versa.

Nonetheless, I love the fact that these few files already _are_ the whole app versus other mobile apps I've done in Android and iOS where the boilerplate and environment are huge when you compare them to the simplicity of developing for the Versa <3

P.S.: Sorry about the console logs scattered across all files. It's not possible yet to debug per se, and the only hint you have is logging _all the things_ :P
