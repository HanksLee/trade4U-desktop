import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import './index.scss';
import {
  Button,
  Select,
  Input,
  Table,
  DatePicker,
  Checkbox,
  Icon,
  Pagination,
  Spin
} from 'antd';
import utils from 'utils';
import moment from 'moment';

const Option = Select.Option;
const InputGroup = Input.Group;
const RangePicker = DatePicker.RangePicker;

const widgetMap = {
  SelectInput: (config) => {
    const {
      selectValue,
      inputValue,
      placeholder,
      options,
      onSelectChange,
      onInputChange,
    } = config;

    return (
      <InputGroup compact>
        <Select
          style={{ width: 100, }}
          value={selectValue}
          onChange={onSelectChange}
        >
          {
            options && options.map((opt, index) => (
              <Option key={index} value={opt.value}>{opt.title}</Option>
            ))
          }
        </Select>
        <Input
          style={{ width: 238, }}
          value={inputValue}
          // @todo
          onChange={onInputChange}
          placeholder={placeholder} />
      </InputGroup>
    );
  },
  Select: (config) => {
    const {
      option,
      label,
      mode,
      onSearch,
      onSelect,
      onBlur,
      onFocus,
      value,
      placeholder,
      showSearch,
      width,
      filterOption,
      onChange,
      allowClear,
      onPopupScroll,
    } = config;
    return (
      <>
        {
          label && (
            <span className='common-list-label'>
              {`${label}：`}
            </span>
          )
        }
        <span className="common-list-control">
          <Select
            allowClear={allowClear}
            value={value}
            mode={mode || false}
            style={{ minWidth: width || 258, width, }}
            showSearch={showSearch}
            placeholder={placeholder}
            filterOption={filterOption}
            onSearch={onSearch}
            onSelect={onSelect}
            onChange={onChange}
            onBlur={onBlur}
            onPopupScroll={onPopupScroll}
            onFocus={onFocus}
          >
            {option.data.map(item => (
              // @ts-ignore
              <Option key={item[option.key] || item.id} value={item[option.value] || item.id} $data={item}>{item[option.title]}</Option>
            ))}
          </Select>
        </span>
      </>
    );
  },
  DatePicker: (config) => {
    const {
      label,
      placeholder,
      onChange,
      value,
      style,
      format,
      showTime,
    } = config;

    return (
      <>
        {
          label && (
            <span className='common-list-label'>
              {`${label}：`}
            </span>
          )
        }
        <span className="common-list-control">
          <DatePicker
            format={format || false}
            style={style}
            showTime={showTime}
            placeholder={placeholder}
            value={value}
            onChange={onChange} />
        </span>
      </>
    );
  },
  RangePicker: (config) => {
    const {
      label,
      alias,
      placeholder,
      onChange,
      value,
      showTime,
      format,
    } = config;
    return (
      <>
        {
          label && (
            <span className='common-list-label'>
              {`${label}：`}
            </span>
          )
        }
        <span className="common-list-control">
          <RangePicker
            style={{ width: 400, }}
            showTime={showTime}
            format={format}
            placeholder={placeholder}
            value={value}
            onChange={onChange} />
          <span className='common-list-control-date-alias'>
            {
              !utils.isEmpty(alias) && (

                alias.map((item, index) => (
                  <Button
                    key={index}
                    onClick={() => onChange([moment(Date.now() - 1000 * 60 * 60 * 24 * item), moment()])}>
                    {item} 天内
                  </Button>
                ))
              )
            }
          </span>
        </span>
      </>
    );
  },
  Input: (config) => {
    const {
      label,
      value,
      placeholder,
      onChange,
      width,
    } = config;

    return (
      <>
        {
          label && (
            <span className='common-list-label'>
              {`${label}：`}
            </span>
          )
        }
        <span className="common-list-control">
          <Input
            style={{ minWidth: width || 258, }}
            value={value}
            onChange={onChange}
            placeholder={placeholder} />
        </span>
      </>
    );
  },
  Checkbox: (config) => {
    const {
      label,
      value,
      onChange,
    } = config;
    return (
      <Checkbox checked={value} onChange={onChange}>{label}</Checkbox>
    );
  },
  Label: (config, children) => {
    const {
      label,
    } = config;

    return (
      <>
        {
          label && (
            <span className='common-list-label'>
              {`${label}：`}
            </span>
          )
        }
        <span className="common-list-control">
          {children}
        </span>
      </>
    );
  },
  Custom: (config) => {
    return <div>{this.props.children}</div>;
  },
};

export default class CommonList extends BaseReact {
  state = {
    collapse: true,
  }

  toggleCollapse = (bool?) => {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  renderSearcher = () => {
    const { searcher, table, } = this.props.config;
    const { collapse, } = this.state;

    return (
      searcher && (
        <section className="common-list-search"
        >
          {this.renderWidgets(searcher.widgets)}
          {table && table.tableHeader && table.tableHeader()}
          <div className="common-list-search-right">
            {
              searcher.collapseControl && searcher.collapseControl.showMoreBtn && (
                <span className="common-list-serach-more">
                  <a 
                    style={{ display: 'flex', alignItems: 'center', }} 
                    onClick={this.toggleCollapse}>{collapse ? '更多' : '收起'} <Icon type={collapse ? 'down' : 'up'} /></a>
                </span>
              )
            }
            {
              !searcher.hideSearcher && <>
                <Button type='primary' onClick={searcher.onSearch}>查询</Button>
                <Button onClick={searcher.onReset}>重置</Button>
              </>
            }
          </div>
        </section>
      )
    );
  }

  renderWidgets = (widgets) => {
    const { collapse, } = this.state;
    const { searcher, } = this.props.config;

    return (
      widgets && (
        <div className="common-list-search-left">
          {
            widgets.map((widget, index) => {
              if (Array.isArray(widget)) {
                return (
                  <div
                    key={index} className={`common-list-search-row`}
                    style={{
                      display: searcher.collapseControl && searcher.collapseControl.showMoreBtn && 
                        collapse && index > 0 ? 'none' : 'flex',
                    }}
                  >
                    {
                      widget.map((item: any) => {
                        return <div
                          key={item.label} className='common-list-search-col' style={{
                            ...item.style,
                          }}>
                          {widgetMap[item.type] && widgetMap[item.type](item, item.children ? this.renderWidgets(item.children) : null)}
                        </div>;
                      })
                    }
                  </div>
                );
              }

              return <div key={widget.label} className={`common-list-search-row ${widget.className}`}>
                {widgetMap[widget.type] && widgetMap[widget.type](widget, widget.children ? this.renderWidgets(widget.children) : null)}
              </div>;
            })
          }
        </div>
      )
    );
  }

  renderAddBtn = () => {
    const { addBtn, searcher, } = this.props.config;

    return (
      addBtn && (
        <section className='common-list-addbtn' style={addBtn.style}>
          {
            typeof addBtn.title === 'function'
              ? <addBtn.title />
              : addBtn.title
          }
          <div className="common-list-search-batch">
            {
              searcher && searcher.batchControl.showBatchControl && (
                <Select
                  placeholder={searcher.batchControl.placeholder}
                  style={{ minWidth: 120, }}
                  defaultValue={undefined} onChange={searcher.batchControl.onBatch}>
                  {/* <Option value={undefined}>无</Option> */}
                  {
                    searcher.batchControl.options.map(opt => (
                      <Option key={opt.value} value={opt.value}>{opt.title}</Option>
                    ))
                  }
                </Select>
              )
            }
          </div>
        </section>
      )
    );
  }

  renderTableHeader = () => {
    const {
      tableHeader,
    } = this.props.config;
    return (
      <section className='common-list-table-header'>
        {tableHeader && tableHeader()}
      </section>
    );
  }

  renderTable = () => {
    const {
      rowKey,
      rowSelection,
      columns,
      dataSource,
      pagination,
      onChange,
      loading,
      locale,
    } = this.props.config.table;
    return (
      <section className='common-list-table'>
        <Table
          locale={locale}
          rowKey={rowKey || 'id'}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={pagination}
          onChange={onChange}
        />
      </section>
    );
  }

  renderCards = () => {
    const {
      dataSource,
      loading,
      pagination,
      renderCard,
      addBtn,
      mode,
    } = this.props.config.cards;

    return (
      <div className='common-list-cards-wrapper'>
        <ul className='common-list-cards'>
          {
            loading
              ? (
                <div className="common-list-cards-loading">
                  <Spin />
                </div>
              )
              : (
                <>
                  {
                    addBtn && (
                      <li className='common-list-card add-btn'>
                        <div className='common-list-card-item' onClick={addBtn.onAddBtnClick}>
                          {
                            addBtn.icon
                              ? (
                                <img src={addBtn.icon} alt="" />
                              )
                              : (
                                <Icon type="plus-circle" />
                              )
                          }
                          <p>{addBtn.title}</p>
                        </div>
                      </li>
                    )
                  }
                  {
                    mode === 'custom' ? (
                      dataSource.map(item => {
                        return (
                          <li key={item[item.key] || item.id}>
                            {renderCard(item)}
                          </li>
                        );
                      })
                    ) : (
                      dataSource.map(item => {
                        return <li className='common-list-card' key={item[item.key] || item.id}>
                          <div className='common-list-card-item'>
                            {renderCard(item)}
                          </div>
                        </li>;
                      })            
                    )
                  }
                </>
              )
          }
        </ul>
        <section className='common-list-cards-pagination'>
          <Pagination
            {...pagination}
          />
        </section>
      </div>
    );
  }

  render() {
    const { config, } = this.props;
    return (
      <div className='common-list'>
        {this.renderSearcher()}
        {this.renderAddBtn()}
        {this.renderTableHeader()}
        {config.table && this.renderTable()}
        {config.cards && this.renderCards()}
      </div>
    );
  }
}