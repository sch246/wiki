import React from 'react';
import clsx from 'clsx';
import {HtmlClassNameProvider, ThemeClassNames} from '@docusaurus/theme-common';
import {
  docVersionSearchTag,
  DocsSidebarProvider,
  DocsVersionProvider,
  useDocRouteMetadata,
} from '@docusaurus/theme-common/internal';
import DocPageLayout from '@theme/DocPage/Layout';
import NotFound from '@theme/NotFound';
import SearchMetadata from '@theme/SearchMetadata';

// add start
import 'gitalk/dist/gitalk.css'
import GitalkComponent from "gitalk/dist/gitalk-component";
import BrowserOnly from '@docusaurus/BrowserOnly';
// add end
export default function DocPage(props) {
  const {versionMetadata} = props;
  const currentDocRouteMetadata = useDocRouteMetadata(props);
  if (!currentDocRouteMetadata) {
    return <NotFound />;
  }
  const {title, docElement, sidebarName, sidebarItems} = currentDocRouteMetadata;
  return (
    <>
      <SearchMetadata
        version={versionMetadata.version}
        tag={docVersionSearchTag(
          versionMetadata.pluginId,
          versionMetadata.version,
        )}
      />
      <HtmlClassNameProvider
        className={clsx(
          // TODO: it should be removed from here
          ThemeClassNames.wrapper.docsPages,
          ThemeClassNames.page.docsDocPage,
          props.versionMetadata.className,
        )}>
        <DocsVersionProvider version={versionMetadata}>
          <DocsSidebarProvider name={sidebarName} items={sidebarItems}>
            <DocPageLayout>{docElement}
      {/* add start */}
      <BrowserOnly>
        {
          () => <div>
            <GitalkComponent options={{
            clientID: "cacbc533c48221e2be7d", clientSecret: "3e6535666d918b5c1d64bbea9cda906885caaa19"
            , repo: "wiki", owner: "sch246", admin:["sch246"], id: `docs/${title}`, title:`docs/${title}`
          }} />
          </div>
        }
      </BrowserOnly>
      {/* add end */}</DocPageLayout>
          </DocsSidebarProvider>
        </DocsVersionProvider>
      </HtmlClassNameProvider>
    </>
  );
}
