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

### getRegistrationInfo

register jciep account via App

#### parameters

- callback: String (callbackHandler)

```javascript
var json = {
    name: "getRegistrationInfo",
    options: {
        callback: "getRegistrationInfoHandler"
    }
};

AppContext.postMessage(json);
```


#### response format

- name: String
- errorCode: Integer
- options: Object
- result: Object
  - type: "apple" | "facebook" | "google" | "phone" | "email"
  - token: string (apple/facebook/google token, mandatory when type = apple/facebook/google)
  - email: string (registered email address, mandatory when type = email)
  - phone: string (registered phone number, mandatory when type = phone)
  - otp: string (mandatory when type = phone or email)

```javascript
// success
var response = {
   name: "getRegistrationInfo",
   errorCode: 0,
   options: {},
   result: {
	   type: "email",
	   email: "admin@platformforinclusion.com",
	   otp: "435678"
  },
};

// error
var response = {
   name: "getRegistrationInfo",
   errorCode: 1, // error code handling to de discussed
   options: {},
   result: null,
};
```


### sendLoginSuccessResponse

send login success response to app

#### parameters

- callback: String (callbackHandler)
- token: String (jciep-token)
- identityId: String (jciep-identityId)


```javascript
var json = {
    name: "sendLoginSuccessResponse",
    options: {
        callback: "sendLoginSuccessResponseHandler"
		token: "jciep-token",
		identityId: "xxxxxxxx"
	}
};

AppContext.postMessage(json);
```

### pickFile

pick files using Android/iOS native file picker.

#### parameters

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

#### response format

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


### openWebView

request app open build-in WebView or external browser

#### parameters

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

#### response format

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


### download

request app to download file

#### parameters

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

#### response format

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

### closeWebView (with redirection)
custom function from web to app

for hyperlink handling, iOS/Android app will close the current window.

#### parameters
- url: string (optional; url; redirect main view to this url if needed) 

```javascript
var json = {
	name: "closeWebView",
	options: {
		callback: "closeWebViewHandler",
		params: {
			url: "https://example.com"
		},
	}
};

AppContext.postMessage(json);
```


## backToRoot (with redirection)
custom function from web to app

iOS/Android app will close all the stacked web view(s) and execute hybrid function in root webview.

### parameters
- name: string (optional; url; call the hybrid function {name} after being back to root window) 
- meta: object (optional; a custom object being passed to the function {name}) 

```javascript
var json = {
	name: "backToRoot",
	options: {
		callback: "backToRootHandler",
		params: {
			name: "navigateTo"
			meta: { //custom object.
				type: 2,
				meta: {
					path: "/events"
				}
			}
		}
	}
};

AppContext.postMessage(json);
```


### triggerPhoneCall

pass phone number and trigger phone app

#### parameters
- phone: string (mandatory)

```javascript
var json = {
	name: "triggerPhoneCall",
	options: {
		callback: "triggerPhoneCallHandler",
		params: {
			phone: "91234567"
		},
	}
};

AppContext.postMessage(json);
```
