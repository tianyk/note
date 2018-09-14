// var nunjucks = require('nunjucks');
// var env = new nunjucks.Environment();
// var pathFn = require('path');
// var fs = require('fs');
// var xmlescape = require('xml-escape');
// var S = require('string');

// hexo.extend.generator.register('podcast', function (locals) {
//     var rss2TmplSrc = pathFn.join(__dirname, '../podcast_template.xml');
//     var rss2Tmpl = nunjucks.compile(fs.readFileSync(rss2TmplSrc, 'utf8'), env);

//     var config = this.config;
//     var podcasts = locals.pages.remove({ layout: 'podcast' });

//     return {
//         path: 'podcast.xml',
//         data: '<xml>podcast</xml>'
//     };
// });


// #Podcast
// podcast:
//     title: "YOUR TITLE"
//     description: "YOUR DESCRIPTION"
//     author: AUTHOR
//     timezone: UTC
//     default_thumb: "/images/logo.jpg"
//     type: rss2
//     path: podcast.xml
//     tempalte: ./podcast_template.xml
//     limit: 20
//     hub:
//     url: https://URL/to/static/resources
//     description: 
//     language: zh-CN
//     copyright: "COPYRIGHT"
//     owner: ITUNES-OWNER
//     email: ITUNES-EMAIL
//     category: CATEGORY


// podcast_template.xml
// <?xml version="1.0" encoding="UTF-8"?>
// <rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
//   <channel>
//     <title>{{ config.title | xml_escape }}</title>
//     <link>{{ config.url }}{{ config.baseurl }}/</link>
//     <copyright>{{ config.copyright }}</copyright>
//     <itunes:subtitle></itunes:subtitle>
//     <itunes:author>{{ config.author }}</itunes:author>
//     <itunes:summary>{{ config.description | xml_escape }}</itunes:summary>
//     <itunes:owner>
//       <itunes:name>{{ config.podcast.owner }}</itunes:name>
//       <itunes:email>{{ config.podcast.email }}</itunes:email>
//     </itunes:owner>
//     <itunes:image href="{{ config.url }}{{ config.default_thumb }}" />
//     <itunes:category text="{{ config.podcast.category }}">
//       <itunes:category text="{{ config.podcast.category }}" />
//     </itunes:category>
//     <itunes:explicit>no</itunes:explicit>
//     <language>{{ config.podcast.language }}</language>
//     {% for post in podcast_posts %}
//     <item>
//       <title>{{ post.title | xml_escape}}</title>
//       <description> {{ post.content | strip_html | xml_escape }} </description>
//       <itunes:author> {{ config.author }}</itunes:author>
//       <itunes:subtitle> {{ post.subtitle }}</itunes:subtitle>
//       <itunes:summary> {{ post.excerpt | strip_html | xml_escape }} </itunes:summary>
//       <itunes:image href="{{ config.podcast.url }}{{ post.image }}" />
//       <enclosure url="{{ config.podcast.url }}{{ post.media }}" length="{{ post.length }}" type="{{ post.mediatype }}"/>
//       <guid></guid>
//       <pubDate>{{ post.date | date_to_rfc822 }}</pubDate>
//       <itunes:duration>{{ post.duration }}</itunes:duration>
//       <psc:chapters version="1.2" xmlns:psc="http://podlove.org/simple-chapters">
//         {% for chapter in post.chapters %}
//           <psc:chapter start="{{ chapter[0] }}" title="{{ chapter[1] | xml_escape }}" />
//         {% endfor %}
//       </psc:chapters>
//     </item>
//     {% endfor %}
//   </channel>
// </rss>


// ---
// title: podcast
// date: 2018-06-12 19:27:54
// layout: podcast
// subtitle: SUBTITLE
// date: AUTO_GEN
// tags: 
//   - TAG
// category: podcast # must be exactly `podcast`
// media: /podcast/Lesson1.mp3 # placed under //URL/to/static/resources/path/to/media
// image: /path/to/episode/image # same as above, but somehow itunes doesn't support episode image as it should do
// length: 6989--IN_BYTES
// type: audio/mpeg
// duration: XX:YY:AA
// chapter:
//   [
//     ["00:00:00.000", "Title 1"],
//     ["OTHER STARTTIME", "Another title"]
//   ]
// ---
