import React from 'react';
import { Form, Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Redirect } from "react-router-dom";

export class LoginFrom extends React.Component {
  constructor(props) {
    super(props);

    this.state = { login: '', password: '', loginError: false, passwordError: false, error: false, isLoading: false, isAutorize: false };

    this.RigisterFunc = this.RigisterFunc.bind(this);
    this.onChangeLogin = this.onChangeLogin.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  onChangeLogin(event) {
    this.setState({ login: event.target.value });
  }

  RigisterFunc(e) {
    e.preventDefault();

    this.setState({ loginError: this.state.login.length === 0 ? true : false });
    this.setState({ passwordError: this.state.password.length === 0 ? true : false });
    this.setState({ isLoading: true });
    fetch('https://localhost:5001/api/account', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
      method: 'POST',
      credentials: "same-origin",

      body: JSON.stringify({
        login: this.state.login,
        password: this.state.password
      })
    }).then(response => response.json())
      .then(data => {
        sessionStorage.removeItem('token', data['access_token']);
        sessionStorage.removeItem('name', data['username']);
        sessionStorage.setItem('token', data['access_token']);
        sessionStorage.setItem('name', data['username']);
        this.setState({ error: false });
        this.setState({ password: '' });
        this.setState({ isLoading: false });
        this.props.onChangeName(data['username']);
        this.setState({ isAutorize: true });
      }).catch(error => {
        if (error.message === 'Failed to fetch') {
          alert('Нет соединения с сервером');
        }
        this.setState({ error: true });
        this.setState({ password: '' });
        this.setState({ isLoading: false });
      });
  }

  render() {
    let error = this.state.error ? 'Неверный логин или пароль' : '';
    let loginEr = this.state.loginError ? 'Введите логин' : '';
    let passwordEr = this.state.passwordError ? 'Введите пароль' : '';
    let load = this.state.isLoading ? <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="loading..." /> : ' ';

    if (this.state.isAutorize === true) {
      return (
        <Redirect to="/home" />
      )
    }
    return (
      <Container>
        <Row>
          <Col xs={{ span: 8 }}>
            {load}
          </Col>
          <Col xs='4'>
            <h5><font color='red'>{error}</font></h5>
            <Form method='post' size='sm'>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Логин</Form.Label>
                <Form.Control value={this.state.login} onChange={this.onChangeLogin} type="text" placeholder="Введите логин" />
                <Form.Label><font size='3' color='red'><b>{loginEr}</b></font></Form.Label>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Пароль</Form.Label>
                <Form.Control value={this.state.password} onChange={this.onChangePassword} type="password" placeholder="Введите пароль" />
                <Form.Label><font size='3' color='red'><b>{passwordEr}</b></font></Form.Label>
              </Form.Group>
              <Button onClick={e => this.RigisterFunc(e)} variant="primary" type='submit'>
                Войти
  </Button>
            </Form>
          </Col></Row>
      </Container>
    )
  }
}