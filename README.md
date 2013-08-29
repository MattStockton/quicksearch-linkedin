# Quick Search for LinkedIn™: A Chrome extension for contextual searches

**Quick Search for LinkedIn™** is a Chrome Extension that allows you to quickly search your LinkedIn™ network using the follow mechanisms:

* Select a first name and last name on any website, right-click, and choose 'Search LinkedIn for...' from the context menu  
* In the search bar, type _LI followed by Tab, which activates the Chrome OmniBox. Search for a first and last name, and press enter  

A window will pop up showing people on LinkedIn™ matching your search criteria, who are reachable in your network. 
You'll need to authorize this application to search your LinkedIn™ network (hence the 'Sign into LinkedIn™' button)

## Under The Hood

This application uses the following components / technologies

* LinkedIn™ [Javacript API](http://developer.linkedin.com/javascript)
* Chrome Extension [API](http://developer.chrome.com/extensions/getstarted.html)
* Amazon S3 for file hosting
* A short Python build script for templating the application, and for deploying some files to S3 via the [AWS boto](http://boto.readthedocs.org/en/latest/) library
* jQuery and Underscore

## Things I Learned

Building this turned out to be a great way to learn a few new technologies and tools. Here are my overall thoughts:

* Chrome Extensions are *really* powerful. You can do an amazing amount of things, and the ecosystem appears to be getting better all the time. I recommend looking over the full documentation -- I had many interesting ideas pop into my head as I was looking through the docs. Also, Chrome Extensions are fairly easy to build. If you know javascript and html, then you know how to build a Chrome Extension

* The LinkedIn™ API is also very powerful, and the javascript API is very easy to use as well. The methods are well designed, and it felt good to use it. I was trying to avoid spinning up an intermediate server to handle API calls, and the javascript API allowed me to successfully do this -- everything I wanted to use was available. One neat thing I found: for methods not directly available in the javascript API, LinkedIn™ provides a 'raw' [method](http://developer.linkedin.com/documents/inapiraw) which appears to let you call anything available in their REST API. Overall, it seems like they're enabling a powerful App ecosystem. The TOS were relatively easy to read, and not too scary (I *don't think* I'm violating them)

* I initially had no plans to host a website on S3. With a Chrome Extension, you can deploy html files in the extension itself and display them. The issue was that LinkedIn™ makes you specify the domains from which your API token would be used (which makes sense). Because of this, I couldn't find a way to get it to work with html deployed in a Chrome Extension. My work-around is to host a static site on S3. S3 seems pretty awesome. It's very inexpensive, and the [AWS python library](http://boto.readthedocs.org/en/latest/) (boto) was fun to work with. It took me only about 20 LOC to connect to S3, create a bucket, deploy my files, and make them accessible via a static site! The boto library appears to have interfaces to all the major Amazon services, so I'm excited to see what else can be done with it.

Overall, the Extension I built was fairly simple...but getting more exposure to the various tools and APIs further reinforced for me how much power, as developers, is at our fingertips to build new things. Pretty liberating!

## How you can run it

Here is how you can run it yourself:

Setup

1. Set up an [AWS S3 Account](https://console.aws.amazon.com/console/home). This is pretty painless, and it's very [inexpensive](http://aws.amazon.com/s3/pricing/)
2. Decide on an AWS S3 Bucket name. The name doesn't matter so much, but make sure it doesn't have underscores. It must be globally unique or else you'll have errors later on. 
3. Create a [LinkedIn Application](https://www.linkedin.com/secure/developer)
- Copy down the API Key, because you'll need it later on.
- Make the default scope include: r\_basicprofile and r\_network
- In the JavaScript API domains section, add a link like this: http://AWS\_BUCKET\_NAME\_FROM\_STEP\_2\.s3-website-us-east-1.amazonaws.com/
4. In the AWS Console, click your name, and go to Security Credentials. Click Access Keys. Create a new Access Key, and copy down the key and secret. You'll need it later on.
5. Copy the configuration.json.example to configuration.json (same directory).
6. Edit the new configuration.json file. Add appropriate values for linkedin\_api\_key, aws\_key, aws\_secret, aws\_bucket\_name. You can just make the ga\_tracking\_code value be an empty string

Now, you're almost ready to deploy. You'll need python 
and pip installed to accompish this

1. Using pip, install the dependencies from requirements.txt (you can do this in a virtualenv if you please).  Type: 'pip install -r requirements.txt'
2. Run 'python build.py'
3. You should see some log statements being printed out. If there are errors, then either I have a bug or you have a configuration problem. Let me know if it's the former.
4. You should verify in the AWS console that a bucket was created and files were copied to it
5. The Chrome extension itself was copied to the ./build/chrome\_extension directory. In Chrome, go to the [Settings](chrome://settings/), click 'Extensions' and check the 'Developer Mode' checkbox. 
6. Then, click 'Load unpacked extension...' and choose the chrome\_extension directory inside of the ./build directory (Make sure to select the one in ./build and not the root, since that is the one on which the template configuration has been applied)

Hopefully, you're good to try it now. Otherwise, you can just download my version from the Chrome store (see below). If you have any problems send me an email: mattstockton@gmail.com

## See Quick Search for LinkedIn™ in action

Coming soon...

## The Future

I would like to continue to build this out. If you have any ideas which you would like to see implemented in this extension, let me know! If you have questions about the code, or anything in this Readme, feel free to send me an email, I'm willing to help.