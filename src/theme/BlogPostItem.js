import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';
import BrowserOnly from '@docusaurus/BrowserOnly';


function faaaaaaa(){
    // const script = document.createElement("script")
    // script.src = "https://unpkg.com/@waline/client@v2/dist/waline.js"
    // script.async = true
    // document.head.appendChild(script)
            
    const style = document.createElement("link")
    style.rel = "stylesheet"
    style.href = "https://unpkg.com/@waline/client@v2/dist/waline.css"
    style.async = true
    document.head.appendChild(style)
            
    const script2 = document.createElement("script")
    script2.src = "/js/wl.js"
    // script2.innerHTML = "Waline.init({el: '#waline',serverURL: 'https://www.sch246.com',});"
    script2.async = true
    document.body.appendChild(script2)


}

export default function BlogPostItemWrapper(props) {
  return (
    <>
      <BlogPostItem {...props} />
      
      <BrowserOnly>
        {
          () =><div>
        <div id="waline"></div>
        {faaaaaaa()}
        </div>
        }
      </BrowserOnly>
    </>
  );
}