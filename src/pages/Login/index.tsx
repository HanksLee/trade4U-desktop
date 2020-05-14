import WithRoute from 'components/@shared/WithRoute';
import logo from 'assets/img/logo.png';
import utils from 'utils';
import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import { Form, Input, Button, Select } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import './index.scss';

export interface ILoginProps {

}

export interface ILoginState {
  isLogin: boolean;
  brokerList: any[];
  searchResult: any[];
  codeInfo: any;
}
/* eslint new-cap: "off" */
@WithRoute('/login')
export default class Login extends BaseReact<ILoginProps, ILoginState> {
  formRef = React.createRef<FormInstance>();

  constructor(props: ILoginProps) {
    super(props);

    this.state = {
      isLogin: false,
      brokerList: [],
      searchResult: [],
      codeInfo: null,
    };
  }

  componentDidMount() {
    const token = utils.getLStorage('MOON_DESKTOP_TOKEN');
    if (token) {
      this.props.history.push('/dashboard');
    } else {
      this.getCodeImg();
    }
  }

  getCodeImg = async () => {
    const res = await this.$api.common.getCodeImg();

    if (res.status == 200) {
      this.setState({
        codeInfo: res.data,
      });
    }
  }

  renderLoginPanel = () => {
    const { codeInfo, } = this.state;

    return (
      <Form layout="vertical" onFinish={this.onLogin} hideRequiredMark={true}>
        <Form.Item name="username" label="登入名" rules={[{ required: true, message: "请输入登入名", }]}>
          <Input placeholder="输入登入名" />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true, message: "请输入密码", }]}>
          <Input type="password" placeholder="输入密码" />
        </Form.Item>
        <Form.Item name="code" label="验证码" rules={[{ required: true, message: "请输入验证码", }]}>
          <Input
            placeholder="输入验证码"
            suffix={
              codeInfo ? (
                <span className="login-code-img">
                  <img
                    src={codeInfo.image}
                    alt="验证码"
                    slot="content-end"
                  />
                  <ReloadOutlined onClick={this.getCodeImg} style={{ fontSize: '16px', }} />
                </span>
              ) : null
            }
          />
        </Form.Item>
        <Button className="login-btn" htmlType="submit">登入</Button>
      </Form>
    );
  }

  renderBrokerChoosePanel = () => {
    const { brokerList, } = this.state;
    return (
      <Form ref={this.formRef} layout="vertical" onFinish={this.chooseBroker} hideRequiredMark={true}>
        <Form.Item name="token" label="请选择券商" rules={[{ required: true, message: "请选择券商", }]}>
          <Select
            showSearch
            optionFilterProp="children"
            className="line-selector"
          >
            {
              brokerList.map(item => {
                return <Select.Option key={item.token} value={item.token}>{item.broker.name}</Select.Option>;
              })
            }
          </Select>
        </Form.Item>
        <Button className="login-btn" htmlType="submit">下一步</Button>
      </Form>
    );
  }

  onLogin = async (values: any) => {
    const res = await this.$api.common.login({
      ...values,
      key: this.state.codeInfo.key,
      platform: 'client_app',
    });

    if (res.status === 201) {
      this.setState({
        isLogin: true,
        brokerList: res.data.results,
        searchResult: res.data.results,
      });
      if (res.data.results.length > 0) {
        this.formRef.current.setFieldsValue({
          token: res.data.results[0].token,
        });
      }
    }
  }

  chooseBroker = (values) => {
    utils.setLStorage('MOON_DESKTOP_TOKEN', values.token);
    this.props.history.push('/');
  }

  render() {
    const { isLogin, } = this.state;
    return (
      <div className='login'>
        <div className='form-wrapper'>
          <img src={logo} alt="logo" />
          <h1>MetaTrader 4</h1>
          <div className='form'>
            {
              isLogin ? this.renderBrokerChoosePanel() :  this.renderLoginPanel()
            }
          </div>
        </div>
      </div>
    );
  }
}
