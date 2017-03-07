# grunt-ms-translate

> A build task to translate JSON files to other languages using Microsoft's Translation API. Pairs very well with angular-translate.


It was created to automatically translate JSON translation files by leveraging
[Microsoft's Translator API](https://www.microsoft.com/en-us/translator/getstarted.aspx)
which has the benefit of having a free tier.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ms-translate --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ms-translate');
```

## The "ms_translate" task

### Overview of Options

#### options.msApiKey
Type: `String`
Default value: `',  '`

The API key used to access [Microsoft's Translation API](https://www.microsoft.com/en-us/translator/getstarted.aspx).

#### options.serializeRequests
Type: `Boolean`
Default value: `false`

Will translate each chunk of the file only after the previous chunk has
finished. Slows the task down but can mitigate API errors relating to rate
limit, especially on the free tier.

### Usage Examples

#### Simple Example
In this example, I passed in a JSON file with english text. It will then create two files in the ```i18n/``` folder called ru.json and zh-CN.json for Russian and Chinese respectively.

Note: This plugin will try and deduce the suffix (file type), so you don't need to explicity specify it. If you need it to have a different suffix, then specify the ```suffix``` as shown in the next example.

```js
grunt.initConfig({
    ms_translate: {
        default_options: {
            options: {
                msApiKey: YOUR_API_KEY_HERE
            },
            files: [{
                src: '<%= yeoman.client %>/i18n/en.json',
                sourceLanguage: 'en',
                targetLanguages: ['ru', 'zh-CN'],
                dest: '<%= yeoman.client %>/i18n/'
            }]
        }
    }
});
```

#### Full Example
In this example, two files are being translated, one called
```locale-en.json``` and another called ```locale-fr.json``` and the
`serializeRequests` flag is enabled. They are in different folders, and will create
translated files in the same ```i18n/``` folder.

Notice how the prefix and suffix is specified, it means the translated files
will be named like ```locale-de.json``` instead of ```de.json```.

```js
grunt.initConfig({
    ms_translate: {
        default_options: {
            options: {
                msApiKey: YOUR_API_KEY_HERE,
                serializeRequests: true // Serializes each request to the API; slower, but can avoid rate limit errors on free tier
            },
            files: [{
                src: '<%= yeoman.client %>/i18n/locale-en.json',
                sourceLanguage: 'en',
                targetLanguages: ['ru', 'zh-CN'],
                dest: '<%= yeoman.client %>/i18n/',
                prefix: 'locale-',
                suffix: '.json'
            }, {
                src: '<%= yeoman.client %>/specialFolder/locale-fr.json',
                sourceLanguage: 'fr',
                targetLanguages: ['de', 'zh-CN'],
                dest: '<%= yeoman.client %>/i18n/',
                prefix: 'locale-',
                suffix: '.json'
            },]
        }
    }
});
```

## Contributors
Many thanks to [dolanmiu](https://github.com/dolanmiu) for the
[grunt-google-translate](https://github.com/dolanmiu/grunt-google-translate)
that this is heavily based off of.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* 1.1.0 - Add new `serializeRequests` parameter
* 1.0.2 - Add the dependencies needed by the package
* 1.0.1 - Add newline to end of translated files
* 1.0.0 - Initial Release
