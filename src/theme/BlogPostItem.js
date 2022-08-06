import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';
import BrowserOnly from '@docusaurus/BrowserOnly';


function faaaaaaa(){
            
    const script = document.createElement("script")
    script.src = "https://unpkg.com/@waline/client@v2/dist/waline.js"
    document.head.appendChild(script)
            
    const style = document.createElement("link")
    style.rel = "stylesheet"
    style.href = "https://unpkg.com/@waline/client@v2/dist/waline.css"
    document.head.appendChild(style)
            
    const script2 = document.createElement("script")
    script2.src = "http://www.sch246.com/wl.js"
    document.body.appendChild(script2)

    
}

export default function BlogPostItemWrapper(props) {
  return (
    <>
      <BlogPostItem {...props} />
      
      <BrowserOnly>
        {
          () =><div>{faaaaaaa()}
        <div id="waline"></div>
        </div>
        }
      </BrowserOnly>
    </>
  );
}