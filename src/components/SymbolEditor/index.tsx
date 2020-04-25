import * as React from "react";
import {
  BaseReact
} from "components/@shared/BaseReact";
import {
  Form,
  Input,
  Select,
  Modal,
  Row,
  Col,
  Button,
  InputNumber,
  Icon
} from "antd";
import {
  inject
} from "mobx-react";
import { actionsType, tradeTypeOptions } from "constant";
import "./index.scss";

const FormItem = Form.Item;
const Option = Select.Option;

// @ts-ignore
@Form.create()
@inject("common")
export default class SymbolEditor extends BaseReact {
  state = {};

  renderActionButtons = () => {
    // 如果是平仓
    // return (
    //   <div className={'bg-down custom-btn'}  onClick={() => {
    //     // @todo
    //   } }>
    //     修改
    //   </div>
    // );
    //
    // // 如果是平仓
    // return (
    //   <div className={'bg-orange custom-btn'} onClick={() => {
    //     // @todo
    //   } }>
    //     平仓
    //   </div>
    // );

    // 如果创建订单
    return (
      <Row type={'flex'} justify={'space-between'}>
        <Col span={11}>
          <div className={'custom-btn bg-up'} block>买入</div>
        </Col>
        <Col span={11}>
          <div className={'custom-btn bg-down'}>卖出</div>
        </Col>
      </Row>
    );
  };

  render() {
    return (
      <div className={"editor symbol-editor"}>
        <div>
          <Icon type="close-circle" onClick={() => {
            // console.log(111);
          }} />
        </div>
        <Row>
          <Col className={"symbol-editor-chart"} span={12}>
            chart
          </Col>
          <Col style={{
            paddingLeft: 6,
          }} className={"symbol-editor-form"} span={12}>
            <Form layout={"vertical"}>
              <FormItem label={"交易品种"}>
                <Input
                  placeholder={"请输入交易品种"}
                  onChange={evt => {
                    // @todo
                  }}
                  value={1}
                  disabled={true}
                />
              </FormItem>
              <FormItem label={"交易类型"}>
                <Select
                  placeholder={"请选择交易类型"}
                  onChange={val => {
                    // @todo
                    // console.log("val", val);
                  }}
                >
                  {
                    tradeTypeOptions.map(item => {
                      return <Option key={item.id}>
                        {item.name}
                      </Option>;
                    })
                  }
                </Select>
              </FormItem>
              {
                // 如果交易类型是挂单交易
              }
              <FormItem label={"价格"}>
                <Input type={'number'} onChange={val => {

                }}/>
              </FormItem>
              <Row type={'flex'} justify={'space-between'}>
                <Col span={11}>
                  <FormItem label={"止损"}>
                    <Input type={'number'} onChange={val => {

                    }}/>
                  </FormItem>
                </Col>
                <Col span={11}>
                  <FormItem label={"止盈"}>
                    <Input type={'number'} onChange={val => {

                    }}/>
                  </FormItem>
                </Col>
              </Row>
              <div className={"symbol-editor-price"}>
                <span className={"p-up"}>12312</span>
                <span>/</span>
                <span className={"p-down"}>1231l122</span>
              </div>
              {
                this.renderActionButtons()
              }

            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}