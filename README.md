# Gist Proxy Server

## Usage

```
$> GIST_PROXY_SERVER_USERNAME=arcanis
$> GIST_PROXY_SERVER_PASSWORD=githubauthtoken
$> gist-proxy-server
```

## Why?

This utility let you open some of your gists to the internet. Via your proxy, anyone will be able to see them and modify them, according to the rules you will have set.

I use it as a light database system for small webapps shared with few collaborators.

## Security

In order to make a gist shareable through Gist Proxy Server, you first have to add a special file named `_gist-proxy-server.yml` in your gist. This file should contain a `files` property, which is a dictionnary where each key is a file name and each value is a permission (`all` / `readonly` / `writeonly`).

Thanks to this permission model:

  - Your gists won't be shared unless you explicitely say so
  - The files from your gist won't be editable unless you explicitely say so

## License

**The MIT License (MIT)**

Copyright © 2015 Maël Nison

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
