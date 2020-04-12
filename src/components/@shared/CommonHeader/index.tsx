import * as React from 'react';
import { Breadcrumb } from 'antd';
import utils from 'utils';
import './index.scss';

export default function CommonHeader(props: {
  title?: string;
  location: any;
  history: any;
  links?: any[];
  tabs?: any[];
  onTabClick?(index): void;
  currentTab: any;
}) {
  const breadcrumbs = utils.getPageBreadcrumb(props.location.pathname);

  const { title, links, tabs, currentTab, } = props;

  return (
    <div className="common-header">
      <section className="common-header-breadcrumb">
        {
          breadcrumbs && (
            <Breadcrumb>
              {
                breadcrumbs.map((item, index) => (
                  <Breadcrumb.Item key={index}>
                    {item.title}
                  </Breadcrumb.Item>
                ))
              }
            </Breadcrumb>
          )
        }
      </section>
      <section className="common-header-title"
        style={{ marginBottom: tabs ? 25 : 0, }}>
        <h2>{title}</h2>
        <div className='common-header-links'>
          {
            links && links.map((link, index) => (
              <a key={index} onClick={() => {
                props.history.push(link.path);
              }}>{link.title}</a>
            ))
          }
        </div>
      </section>
      <section className="common-header-tabs">
        {tabs && tabs.map((tab, index) => (
          <a key={tab.id} onClick={() => {
            props.onTabClick(tab.id);
          }} className={`${currentTab === tab.id ? 'tab-active' : ''} `}>
            <span>{tab.title}</span>
            {
              tab.tipComponent && tab.tipComponent()
            }
          </a>
        ))}
      </section>
      {/* <section className='common-header-links'>
          {
            links && links.map((link, index) => (
              <a key={index} onClick={() => {
                props.history.push(link.path);
              }}>{link.title}</a>
            ))
          }
      </section> */}
    </div>
  );
}