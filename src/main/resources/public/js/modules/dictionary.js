/**
 * Copyright (c) 2014 Raoul van Rueschen
 * 
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * 
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *  1. The origin of this software must not be misrepresented; you must not
 *     claim that you wrote the original software. If you use this software
 *     in a product, an acknowledgment in the product documentation would be
 *     appreciated but is not required.
 *  2. Altered source versions must be plainly marked as such, and must not be
 *     misrepresented as being the original software.
 *  3. This notice may not be removed or altered from any source distribution.

 * @author Raoul van Rueschen
 * @version 0.0.1, 10.10.2014
 */

var general = general || {};

(function(undefined, window, document)
{
 "use strict";

/**
 * 
 */

general.Stay = function()
{
 var contents = document.getElementById("contents"),
  navigation = document.getElementById("navigation"),
  localEventCache = [], locked = false;

 /**
  * Uses ajax to request pages.
  * Locks the whole system until the response has
  * been received and processed.
  * 
  * @param firingElement A registered element whose click event was triggered.
  */

 function navigate(firingElement)
 {
  var property, postDataString, formData, page;

  // Collect post data if the firing element is a form.
  if(firingElement.action)
  {
   page = firingElement.action;
   formData = new FormData(firingElement);
  }
  else
  {
   page = firingElement.href;
  }

  nextPage = page;
  locked = true;
  //contents.style.opacity = 0.0;

  if(formData)
  {
   general.ajax.open("POST", page + "/json");
   general.ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

   for(property in postData)
   {
    postDataString = postDataString ? postDataString + "&" : "";
    postDataString += property + "=" + postData[property];
   }

   general.ajax.timeout = 10000;
   general.ajax.send(formData);
  }
  else
  {
   general.ajax.open("GET", page + "/json", true);
   general.ajax.timeout = 4000;
   general.ajax.send(null);
  }
 }

 /**
  * This function acts when a requested page has completely been received.
  * The response will be a json object or a 404 page. Anything else will 
  * be treated as a json parse exception.
  */

 function processResponse()
 {
  var response;

  if(this.readyState === 4)
  {
   if(this.status === 404)
   {
    contents.innerHTML = "<h1>Error 404</h1><p>Not found.</p>";
   }
   else if(this.status === 0)
   {
    contents.innerHTML = "<h1>Error</h1><p>The server doesn't respond.</p>";
   }
   else if(this.status !== 200)
   {
    contents.innerHTML = "<h1>Error " + this.status + "</h1><p>The request failed.</p>";
   }
   else
   {
    try
    {
     response = JSON.parse(this.responseText);
     contents.innerHTML = response.html;
     contents.style.visibility = "visible";
     contents.style.opacity = 1.0;
     contents.style.transform = "scale(1.0, 1.0)";

     if(navigation.innerHTML !== response.navigation)
     {
      navigation.innerHTML = response.navigation;
     }

     release();
     bind();
    }
    catch(e)
    {
     contents.innerHTML = "<h1>Error</h1><p>" + e.message + "</p>";
    }
   }

   locked = false;
  }
 };

 /**
  * This function is bound to all links and forms
  * and executes the desired page navigation on left clicks.
  *
  * The context in which this function is called allows access
  * to all attributes of the respective "a" or "submit" element.
  */

 function handlePageSwitch(event)
 {
  var isRightClick = false;

  if(event.which)
  {
   isRightClick = (event.which === 3);
  }
  else if(event.button)
  {
   isRightClick = (event.button === 2);
  }

  if(!isRightClick && !locked)
  {
   event.preventDefault();
   backForward = false;
   navigate(this);
  }
 }

 /**
  * Prevents every default click action for a very short time.
  * Between releasing and re-binding all event listeners on links
  * and forms, there's a small time gap in which the user may
  * accidentally leave the page by furiously hammering the 
  * mouse button. This function covers that gap.
  */

 function transitionHandShake(event)
 {
  event.preventDefault();
 }

 /**
  * Unbinds all event listeners on links and forms.
  */

 function release()
 {
  var i, len, lECi;

  window.addEvent(document, "click", transitionHandShake);

  for(i = 0, len = localEventCache.length; i < len; ++i)
  {
   lECi = localEventCache[i];
   window.removeEvent(lECi[0], lECi[1], lECi[2]);
  }
 }

 /**
  * Binds event listeners to all links and forms.
  * Always release before binding.
  */

 function bind()
 {
  var links = document.getElementsByTagName("a"),
   forms = document.getElementsByTagName("form"),
   i, len, signature;

  for(i = 0, len = links.length; i < len; ++i)
  {
   signature = window.addEvent(links[i], "click", handlePageSwitch);
   localEventCache.push(signature);
  }

  for(i = 0, len = forms.length; i < len; ++i)
  {
   signature = window.addEvent(forms[i], "submit", handlePageSwitch);
   localEventCache.push(signature);
  }

  window.removeEvent(document, "click", transitionHandShake);
 }

 /**
  * Support browser functionality "back" and "forward".
  * Depends on the boolean variable backForward in order to
  * determine whether this navigation should be executed.
  */

 function handleBackForward()
 {
  var state = History.getState();

  if(backForward)
  {
   if(state.hash !== "/")
   {
    navigate({href: state.cleanUrl});
   }
   else
   {
   }
  }
  else
  {
   backForward = true;
  }
 };

 /**
  * Initialization.
  */

 (function init()
 {
  // Make sure that there's a "contents"-container.
  if(!contents)
  {
   contents = document.createElement("div");
   contents.id = "contents";
   document.getElementById("main").appendChild(contents);
  }

  // Listen to ajax ready-state changes.
  window.addEvent(general.ajax, "readystatechange", processResponse);

  // A simple listener that deals with ajax timeouts.
  window.addEvent(general.ajax, "timeout", function()
  {
   contents.innerHTML = "<h1>Error</h1><p>The server didn't respond in time. Please try again later!</p>";
   locked = false;
  });

  // First time binding all links and forms to event listeners.
  bind();
 }());
};

/**
 * Starting point.
 */

window.addEvent(document, "DOMContentLoaded", function()
{
 new general.Stay();
});

/** End of Strict-Mode-Encapsulation **/
}(undefined, window, document));



