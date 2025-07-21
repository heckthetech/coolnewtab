const plugins = [
  [
    "Limit Adjuster",
    "A must have plugin to increase bookmark limitaion and layout and enables other plugin to modify it",
    "limadjust.jpg",
    "limadjust.jpg",
    `<h2 style="color:#a0d8cc; font-size:28px; margin-bottom:10px;">Plugin Overview</h2>
<p style="font-size:16px; color:#e0e0e0; line-height:1.5;">
  This plugin enhances and simplifies certain limitations to enable easier customization for other plugins.
</p>

<h3 style="color:#ff8364; font-size:22px; margin-top:20px;">Features</h3>
<ul style="font-size:15px; color:#e0e0e0; line-height:1.4;">
  <li>Allows users and developers to customize key parameters such as maximum bookmarks and layout patterns.</li>
  <li>Provides flexible configuration via <code style="background:#2a3a3a; padding:2px 4px; border-radius:3px; color:#a0d8cc;">localStorage</code> for seamless personalization.</li>
  <li>Easy to reset: simply remove and reinstall if needed.</li>
</ul>

<h3 style="color:#ff8364; font-size:22px; margin-top:20px;">Customization</h3>
<p style="font-size:16px; color:#e0e0e0; line-height:1.5;">
  <strong>Maximum Bookmarks</strong><br>
  Adjust the maximum number of bookmarks by setting:<br>
  <code style="background:#2a3a3a; padding:4px 6px; border-radius:4px; display:inline-block; margin:6px 0; color:#a0d8cc;">localStorage.MAX_BOOKMARKS = 15;</code><br>
  Replace <code style="color:#a0d8cc;">15</code> with your desired value.
</p>

<p style="font-size:16px; color:#e0e0e0; line-height:1.5;">
  <strong>Layout Pattern</strong><br>
  Define how bookmarks are arranged by setting:<br>
  <code style="background:#2a3a3a; padding:4px 6px; border-radius:4px; display:inline-block; margin:6px 0; color:#a0d8cc;">localStorage.layoutPattern = "5,5,5";</code><br>
  Change the numbers to suit your preferred layout.
</p>

<h3 style="color:#ff8364; font-size:22px; margin-top:20px;">Resetting</h3>
<p style="font-size:16px; color:#e0e0e0; line-height:1.5;">
  If you encounter issues or want to revert changes, just remove the plugin and perform a fresh installation.
</p>
`,
    "limitsadjuster.intheck"
  ],
  [
    "Better Tiles",
    "Make BookMark Tiles look better",
    "better.jpg",
    "betterl.png",
    `<h2 style="color:#a0d8cc; font-size:26px; margin-bottom:8px;">Better Tiles</h2>
<p style="font-size:16px; color:#e0e0e0; line-height:1.5;">
  Make your bookmark tiles look cleaner, sharper, and more organized with enhanced layout styling and spacing adjustments.
</p>
<p style="font-size:15px; color:#f0c674; margin-top:10px;">
  Requires <a href="http://heckthetech.github.io/coolnewtab/pluginstore?q=limits%20Adjuster&author=heck" style="color:#80dfff; text-decoration:underline;">Limit Adjuster</a> plugin to work properly.
</p>
`,
    "BetterTiles.intheck"
  ],
   
  
  
  
  
  [
    "Date Display Plugin",
    "Add a Date widget",
    "dat.jpg",
    "datp.jpg",
    `<h2 style="color:#a0d8cc; font-size:26px; margin-bottom:8px;">Date Display Plugin</h2>
<p style="font-size:16px; color:#e0e0e0; line-height:1.5;">
  Add a stylish and customizable date widget to your layout. It displays the current date using your preferred format.
</p>

<p style="font-size:16px; color:#e0e0e0; line-height:1.5;">
  You can customize the date format by setting:<br>
  <code style="background:#2a3a3a; padding:4px 6px; border-radius:4px; color:#a0d8cc;">loadtextfrom(date.format = "dd/mm day")</code><br>
  Replace the format string with any combination of the supported tokens below.
</p>

<p style="font-size:15px; color:#f0c674; margin-top:10px;"><strong>Supported Format Tokens:</strong></p>
<ul style="font-size:15px; color:#e0e0e0; line-height:1.4; margin-left:20px;">
  <li><code>dd</code> = Day number (01–31)</li>
  <li><code>mm</code> = Month number (01–12)</li>
  <li><code>mtext</code> = Full month name (e.g., June)</li>
  <li><code>mtxt</code> = Short month name (e.g., Jun)</li>
  <li><code>yyyy</code> = Full year (e.g., 2025)</li>
  <li><code>yy</code> = Short year (e.g., 25)</li>
  <li><code>dayname</code> = Full weekday name (e.g., Friday)</li>
  <li><code>day</code> = Short weekday name (e.g., Fri)</li>
</ul>
`,
    "DateDisplay.intheck"
  ],



[
    "Force Yahoo Search Engine",
    "force Yahoo to be the default Search engine",
    "yahoo.webp",
    "yahool.jpg",
    `<h2 style="color:#a0d8cc; font-size:26px; margin-bottom:8px;">Force Yahoo Search Engine</h2>
<p style="font-size:16px; color:#e0e0e0; line-height:1.5;">
  Set Yahoo as your default search engine across your browsing experience, overriding any other search engine settings.  
</p>
<p style="font-size:16px; color:#e0e0e0; line-height:1.5;">
  This plugin ensures all search queries use Yahoo, giving you consistent results and a familiar search interface.
</p>
`,
    "forceyahoosearchengine.intheck"
  ],





[
    "Deeper BGM from Minecraft",
    "Play smooth piano part of 'deeper' background music by Lena Raine from minecraft",
    "deeper.jpg",
    "deeperl.jpg",
    `<h2 style="color:#a0d8cc; font-size:26px; margin-bottom:8px;">Deeper BGM from Minecraft</h2>
<p style="font-size:16px; color:#e0e0e0; line-height:1.5;">
  Enjoy the gentle, ambient piano section of <strong>"Deeper"</strong>, one of the iconic background tracks from Minecraft. Originally composed by <strong>C418</strong> (Daniel Rosenfeld), this track is part of the <em>Minecraft – Volume Beta</em> album, known for its relaxing and emotionally rich soundscapes.
</p>

<p style="font-size:16px; color:#e0e0e0; line-height:1.5;">
  "Deeper" gained recognition for its deep, minimalistic vibe, often played during exploration or creative building sessions. This plugin brings that immersive feeling right into your interface or project environment.
</p>

<p style="font-size:16px; color:#f0c674; line-height:1.5;">
  Perfect for focus, relaxation, or background mood enhancement—just load it and let the calm flow.
</p>
`,
    "DeeperBGM.intheck?v=3"
  ],




  [
    "RickRoll Sticker",
    "Add a cool rickroll sticker ",
    "rick.png",
    "rickl.webp",
    `<h2 style="color:#a0d8cc; font-size:26px; margin-bottom:8px;">RickRoll Sticker</h2>
<p style="font-size:16px; color:#e0e0e0; line-height:1.6;">
  Bring a touch of internet legend to your collection with this cool RickRoll sticker. Whether you want to surprise your friends, add some humor to your chats, or just celebrate one of the most iconic memes of all time, this sticker has you covered.
</p>
<p style="font-size:16px; color:#e0e0e0; line-height:1.6;">
  Featuring the classic Rick Astley “Never Gonna Give You Up” theme, this sticker is a fun nod to the legendary prank that’s been making people smile (and occasionally dance) for over a decade. It’s easy to add and even easier to share, making it the perfect lighthearted addition to your digital toolkit.
</p>
<p style="font-size:15px; color:#f0c674; margin-top:10px;">
  Use it wisely—you never know when a well-timed RickRoll might brighten someone’s day or catch them off guard!
</p>
`,
    "rickrollgif.intheck"
  ],



  [
    "Move it down",
    "Move all your stuff a little bit down",
    "move.png",
    "move.png",
    `<h2 style="color:#a0d8cc; font-size:26px; margin-bottom:8px;">Move It Down</h2>
<p style="font-size:16px; color:#e0e0e0; line-height:1.5;">
  Move all your content slightly downward to improve layout or create space where needed.
</p>
<p style="font-size:16px; color:#e0e0e0; line-height:1.5;">
  You can customize the amount by adjusting the CSS margin value, for example:<br>
  <code style="background:#2a3a3a; padding:4px 6px; border-radius:4px; color:#a0d8cc; display:inline-block;">
    #bodyb { margin-bottom: -80px; }
  </code><br>
  Change <code>-80px</code> to any value that fits your design.
</p>
`,
    "MoveDownAll.intheck"
  ],

  [
    "Less Darker Wallpaper",
    "Controll the Wallpaper brightness",
    "lessdark.jpg",
    "lessdark.jpg",
    `<h2 style="color:#a0d8cc; font-size:26px; margin-bottom:8px;">Less Darker Wallpaper</h2>
<p style="font-size:16px; color:#e0e0e0; line-height:1.5;">
  Control the wallpaper brightness to make your background lighter and more visually comfortable.
</p>
<p style="font-size:16px; color:#e0e0e0; line-height:1.5;">
  Customize the darkness level by adjusting the opacity value in the CSS rule below:<br>
  <code style="background:#2a3a3a; padding:4px 6px; border-radius:4px; color:#a0d8cc; display:inline-block;">
    #bodya { background: rgb(0 0 0 / 20%) !important; }
  </code><br>
  Change <code>20%</code> to any percentage you prefer for lighter or darker wallpaper.
</p>
`,
    "lessdarkerwallpaper.intheck"
  ],


];
