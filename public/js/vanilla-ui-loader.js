(function(global)
{
   // Configurable threshold via global or data attribute
   let mobileThreshold = 600;
   let lastIsMobile = null;

   // We inject our code into #app so we can hot-swap UIs without touching the rest of the DOM
   // make sure <div id="app"> exists or create it ourselves
   function getContainer()
   {
      let el = document.getElementById('app');
      if (!el)
      {
         el = document.createElement('div');
         el.id = 'app';
         document.body.appendChild(el);
      }
      return el;
   }

	// delete all dynamics scripts. this is done with each
	// UI hotswap. this prevents copied script pollution
	// and differnt UI scripts conflicting.
	function cleanupDynamicScripts()
	{
		document.querySelectorAll('script[data-dynamic="true"]').forEach(script => 
		{
			// Optionally: call some global cleanup/unmount function here
			script.remove();
		});
	}

	// this dynamically injects html and runs javascript 
	// in a container. there is no page reload. it's
	// basically a SPA loader. It's used by the LoadUI
	// function to hot swap UIs, which basically the purpose
	// of this file.
   function injectHTMLAndRunScripts(container, html)
   {
      // 1. Remove prior dynamic scripts
      cleanupDynamicScripts();

// 2. Replace inner HTML
// This deletes all previous content in the container, including any dynamic CSS or JS.
// Any <link rel="stylesheet"> or <style> tags in the injected HTML will be loaded/applied.
// Modern browsers will load <link rel="stylesheet"> even when injected inside <body> (see MDN: link is "body-ok"),
// though for clarity, <link>s are often placed in <head> in conventional static HTML.
// This dynamic strategy is common in SPAs and supported by all mainstream browsers.
      container.innerHTML = html;
      
      
      // 3. Find and inject new external scripts
      const temp = document.createElement('div');
      temp.innerHTML = html;
      temp.querySelectorAll('script[src]').forEach(script =>
      {
         const newScript = document.createElement('script');
         Array.from(script.attributes).forEach(attr =>
         {
            if (attr.name === 'src')
            {
               // Append a cache-busting query parameter to the script URL.
               // If the URL already contains a '?', append with '&' to preserve existing query params;
               // otherwise, start a new query string with '?'.
               // This ensures the browser fetches a fresh copy on each load, avoiding stale cache issues.
               let bustedSrc = attr.value + (attr.value.includes('?') ? '&' : '?') + 'v=' + Date.now();
               newScript.setAttribute('src', bustedSrc);
            }
            else
            {
               newScript.setAttribute(attr.name, attr.value);
            }
         });
         newScript.setAttribute('data-dynamic', 'true');
         document.body.appendChild(newScript);
      });
   }

   function loadUI()
   {
      const isMobile = window.innerWidth <= mobileThreshold;
      const target = isMobile ? '/mobile.html' : '/desktop.html';
      fetch(target)
         .then(response => response.text())
         .then(html =>
         {
            const app = getContainer();
            injectHTMLAndRunScripts(app, html);
         })
         .catch(err =>
         {
            const app = getContainer();
            app.innerHTML = `<p>Error loading UI: ${err}</p>`;
         });
      lastIsMobile = isMobile;
   }

   function onResize()
   {
      const isMobile = window.innerWidth <= mobileThreshold;
      if (isMobile !== lastIsMobile)
      {
         loadUI();
      }
   }

   // Optional: Allow setting config via global before script runs
   if (global.VanillaUILoaderConfig && global.VanillaUILoaderConfig.mobileThreshold)
   {
      mobileThreshold = global.VanillaUILoaderConfig.mobileThreshold;
   }

   // Or allow setting via <script data-mobile-threshold="700">
   document.currentScript?.dataset?.mobileThreshold && (mobileThreshold = parseInt(document.currentScript.dataset.mobileThreshold));

   // Expose for manual use if needed
   global.VanillaUILoader = {
      loadUI,
      setMobileThreshold: (n) =>
      {
         mobileThreshold = n;
         loadUI();
      }
   };

   document.addEventListener('DOMContentLoaded', loadUI);
   window.addEventListener('resize', onResize);

})(window);
