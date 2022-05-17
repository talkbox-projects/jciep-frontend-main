# JCIEP Hybrid WebView protocol (Flutter)

### Start
* Flutter plugin: webview_flutter
* App prefix: AppContext
* Web prefix: WebContext
* Bridging method: postMessage(String)
-> this bridging method is fixed by the webview_flutter plugin

* Cookie params:
 - jciep-token (c-token: secure=true & httpOnly=true)
 - jciep-identity (c-identity: httpOnly = false)
 - jciep-client-type (clientType: httpOnly = false)

--------------------------------------------

## AppContext

### AppContext.postMessage(String) : void
（async）call webview_flutter native app method
```javascript
WebContext.loginHandler = function(response) {
    console.log(response)
} 

// json string data
var json = {
   name: "login"
   options: {
       callback: "loginHandler"
       params: {
           username: "Teamwork",
           password : "******"
       }
   }
};

// json to String
AppContext.postMessage(json);
```

After called, WebContext.loginHandler will receive a response as below
```javascript
{   
    name : "login",
    options : {
        callback : "loginHandler",
        params : {
            username: "Teamwork",
            password : "******"
        }
    },
    errorCode : 0,
    result : {
        userId : "123456",
        profilePic : "http://domain.com/avatar.png"
    }
 }
```

--------------------------------------------

## WebContext

### WebContext.postMessage(String) : void
(sync) let Native App execute web's custom method, e.g. callback

--------------------------------------------

## Hybrid App Bridge methods

### pickFile

pick files using Android/iOS native file picker.

### parameters

- callback: String (callbackHandler)
- params: Object
  - maxFileSize: Integer (byte per file)
  - maxFileCount: Integer (maximum number of files to be picked)
  - minFileCount: Integer (minimum number of files to be picked)
  - mimeType: String (available mime type of files to be picked, e.g. image/jpeg, image/\*, */\*)

```javascript
var json = {
    name: "pickFile",
    options: {
        callback: "pickFileHandler"
        params: {
            maxFileSize: 2097452,
            maxFileCount: 3,
            minFileCount: 1,
            mimeType: "image/jpeg"
        }
    }
};

AppContext.postMessage(json);
```

### response format

- name: String
- errorCode: Integer
- options: Object
- result: Object
  - data: Array (list of files)
    - name: String (optional)
    - data: String (base 64 files)
    - size: Integer (in Kilobyte per file)

```javascript
// success
var response = {
   name: "pickFile",
   errorCode: 0,
   options: {},
   result: {
      data: [
        {
          name:"image-1.png",
          data:"data:image/jpeg;base64,xxxxxxxx",
          size: 20000,
        },
        {
          name:"image-2.png",
          data:"data:image/jpeg;base64,xxxxxxxx",
          size: 20000,
        },
      ]
  },
};

// error
var response = {
   name: "pickFile",
   errorCode: 1, // error code handling to de discussed
   options: {},
   result: null,
};
```


## requestAuthentication

request client BioID/Password Authentication

### parameters

- callback: String (callbackHandler)

```javascript
var json = {
    name: "requestAuthentication",
    options: {
        callback: "requestAuthenticationHandler",
    }
};

AppContext.postMessage(json);
```

### response format

- name: String
- errorCode: Integer
- options: Object
- result: Object
  - authenticated: Boolean (return whether user is authenticated, true = success and false = failed)

```javascript
// success
var response = {
   name: "requestAuthentication",
   errorCode: 0,
   options: {},
   result: {
      authenticated: true,
  },
};

// error 
```


## getDeviceInfo

request app device info

### parameters

- callback: String (callbackHandler)

```javascript
var json = {
    name: "getDeviceInfo",
    options: {
        callback: "getDeviceInfoHandler",
    }
};

AppContext.postMessage(json);
```

### response format

- name: String
- errorCode: Integer
- options: Object
- result: Object
  - clientType: Integer (refer to client types)
  - lang: String (format: zh_HK)
  - version: String (device OS)

```javascript
// success
var response = {
   name: "getDeviceInfo",
   errorCode: 0,
   options: {},
   result: {
      clientType: 1,
      lang: "zh_HK",
      version: "iOS14"
  },
};

// error 
```


## openWebView

request app open build-in WebView or external browser

### parameters

- callback: String (callbackHandler)
- params: Object
  - value: String (url)
  - type: String ("internal" or "external")
  - isRedirect: Boolean (true: use the current webview; false: open a new webview)
  - setSSO: Boolean (true: append SSO to cookie, false: not append)

```javascript
var json = {
    name: "openWebView",
    options: {
        callback: "openWebViewHandler",
        params: {
            value: "https://www.google.com",
            type: "internal",
            isRedirect: false,
        }
    }
};

AppContext.postMessage(json);
```

### response format

- name: String
- errorCode: Integer
- options: Object
- result: Object

```javascript
// success
var response = {
   name: "openWebView",
   errorCode: 0,
   options: {},
   result: {},
};

// error 
```


## download

request app to download file

### parameters

- callback: String (callbackHandler)
- params: Object
  - url: String (file url)
  - mimeType: String (mime type of the file, e.g. "image/jpeg")
  - name: String (file name)
  - size: Integer (file size in Kilobyte)

```javascript
var json = {
    name: "download",
    options: {
        callback: "downloadHandler",
        params: {
            url: "https://xxx",
            mimeType: "image/jpeg",
        }
    }
};

AppContext.postMessage(json);
```

### response format

- name: String
- errorCode: Integer
- options: Object
- result: Object

```javascript
// success
var response = {
   name: "download",
   errorCode: 0,
   options: {},
   result: {},
};

// error
```
