# Liukko-POC

### Main goals of this POC
<ul>
    <li>Separate back- and frontend development
        <ul>
            <li>Basically backend side will be installed to some *nix machine</li>
            <li>Frontend side of this POC is just for example</li>
            <li>Implementation to _your_ own frontend application should be fairly easy</li>
        </ul>
    </li>
    <li>
        Simple file(s) watcher to send socket messages about file updates
        <ul>
            <li>Watched files can be configured to backend side</li>
            <li>Updates of files are send to clients via WebSockets</li>
            <li>User can define which files to "listen"</li>
            <li>Simple file content update, to demonstrate actual changes of files</li>
        </ul>
    </li>
    <li>
        Frontend - backend communication is authenticated by JWT
        <ul>
            <li>CORS support</li>
            <li>All data access routes are secured via sails policies</li>
            <li>Actual user authentication is done in the backend</li>
        </ul>
    </li>
</ul>

### Why?
Just for fun and to learn how to make this kind of stuff work with node.js. 

### Directory structure
<pre>
backend  = Sails.js server, just API nothing else
frontend = Slush-angular, just frontend side
</pre>

#### Backend
For backend side this POC uses Sails.js (imho awesome). See more info at https://github.com/balderdashy/sails. 

#### Frontend
Boilerplate uses slush-angular for frontend (AngularJS using Google Angular App Structure Recommendations).
See more info at https://github.com/slushjs/slush-angular This library is awesome to distribute frontend.

### Used libraries, guides, etc.
* Sails.js, http://sailsjs.org/
* slush-angular, https://github.com/slushjs/slush-angular
* AngularJS, https://angularjs.org/
* Bootstrap, http://getbootstrap.com/
* Techniques for authentication in AngularJS applications, https://medium.com/opinionated-angularjs/7bbf0346acec
* Json Web Tokens, http://angular-tips.com/blog/2014/05/json-web-tokens-examples/

### Installation
First of all you have to install <code>npm</code> and <code>node.js</code> to your box. Installation instructions can
be found there http://sailsjs.org/#/getStarted?q=what-os-do-i-need

After that you need to install <code>bower, slush and sails</code> main packages to make all things to happen. These
can be installed with following commands on your *nix box.
<pre>
sudo npm install bower -g
sudo npm install slush -g
sudo npm install sails -g
</pre>

After you need to download codes of this project to your computer, please follow instructions below.

#### Back- and frontend installation
Navigate yourself to directory where you downloaded or cloned this repo and run following command on shell:
<pre>
npm install
</pre>

That will install all needed packages for back- and frontend. You can also install those separately just by run that
same command on <code>backend</code> or <code>frontend</code> directory.

#### Configuration
You can configure your <code>backend</code> and <code>frontend</code> applications to use your environment specified 
settings. Basically by default you don't need to make any configurations at all. With default configuration backend will 
be run on http://localhost:1337 and frontend on http://localhost:3001 (development) http://localhost:3000 (production).

##### Backend
There is an example of backend configuration file on following path.

<pre>
backend/config/local_example.js
</pre>

Just copy this to <code>backend/config/local.js</code> and make necessary changes to it. Note that this 
<code>local.js</code> file is in .gitignore so it won't go to VCS at any point.

##### Frontend
There is an example of front configuration file on following path.

<pre>
frontend/config/config_example.json
</pre>

Just copy this to <code>backend/config/config.json</code> and make necessary changes to it. Note that this 
<code>config.json</code> file is in .gitignore so it won't go to VCS at any point.

### Running of this POC
You need to start both <code>backend</code> and <code>frontend</code> servers to run this POC. 

#### Backend
<pre>
cd backend
sails lift
</pre>

This will start sails.js server on defined port. By default this is accessible from http://localhost:1337 url. If you 
try that with your browser you should only see page that contains <code>Not Found</code> message on it. This means that
everything is ok.

#### Frontend

##### Development #####
<pre>
cd frontend
gulp serve
</pre>

This will start simple web server that you can use within developing frontend side. By default this is accessible from 
http://localhost:3001 url. You should be see login page if you try that url with your browser.

##### Deployment #####
As in production
<pre>
cd frontend
gulp dist
</pre>

This will create a deployment code to ```frontend/dist``` folder. After that you can serve those static HTML, CSS, 
Javascript and asset files by any web server you like (Apache, nginx, IIS, etc.). For testing this production ready code
you can also use ```gulp production``` command which will serve those dist files. By default this is accessible from
http://localhost:3000 url.

#### Testing POC
<ol>
    <li>Start back- and frontend servers as described above</li>
    <li>Open http://localhost:3001 with your favorite browser</li>
    <li>Login with with following credentials:
        <ul>
            <li>username: liukko</li>
            <li>password: poc</li>
        </ul>
    </li>
    <li>Open terminal and modify <code>backend/data/poc.txt</code>
        <ul>
            <li>You should see changes of that file on the browser</li>
        </ul>
    </li>
</ol>

### Possible failures
Below is small list of possible failures that can occur while trying this POC.

<ol>
    <li>Sails won't lift and you get error message like: <code>Fatal error: watch ENOSPC</code>
        <ul>
            <li>http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc</li>
            <li>tl;dr just run <code>npm dedupe</code> 
        </ul>
    </li>
    <li>Frontend side is missing some 3rd party libraries. eg. browser console is full of some errors.
        <ul>
            <li>Try to install bower packages manually by command <code>bower install</code> in <code>frontend</code> directory.
        </ul>        
    </li>
</ol>

## Author
Protacon Solutions

## Contributors
Tarmo Leppänen

## License
The MIT License (MIT)

Copyright (c) 2014 Protacon Solutions

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
