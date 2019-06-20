import React from 'react'
import { Form, Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import { Menu } from '../../Shared/Menu'

export class UpdateUser extends React.Component {
    constructor(props) {
        super(props)

        this.state = { Role: this.props.location.state.Role, Password: this.props.location.state.Password, Name: this.props.location.state.Name, Email: this.props.location.state.Email, isLoad: false, RoleError: false, PasswordError: false, NameError: false, EmailError: false, addState: 0, isUnAuth: false }

        this.onChangeName = this.onChangeName.bind(this)
        this.onChangeSpcialty = this.onChangeSpcialty.bind(this)
        this.onChangeYear = this.onChangeYear.bind(this)
        this.onChangeRole = this.onChangeRole.bind(this)
        this.addFunc = this.addFunc.bind(this)
    }

    onChangeRole(e) {
        this.setState({ Role: e.target.value })
    }

    onChangeName(e) {
        this.setState({ Name: e.target.value })
    }

    onChangeSpcialty(e) {
        this.setState({ Email: e.target.value })
    }

    onChangeYear(e) {
        this.setState({ Password: e.target.value })
    }

    addFunc(e) {
        e.preventDefault()

        this.setState({
            NameError: this.state.Name.length === 0 ? true : false,
            EmailError: this.state.Email.length === 0 ? true : false,
            PasswordError: this.state.Password.length === 0 ? true : false,
            isLoad: true
        })
        if ((this.state.Name.length === 0 ? true : false) === false & (this.state.Email.length === 0 ? true : false) === false & (this.state.Password === null ? true : false) === false) {
            fetch('https://localhost:5001/api/user/'+this.props.location.state.PrevLogin, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Access-Control-Allow-Origin': '*',
                    Authorization: 'Bearer ' + sessionStorage.getItem('token')
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    name: this.state.Name,
                    Email: this.state.Email,
                    Password: this.state.Password,
                    role: this.state.Role
                })
            })
                .then(response => {
                    this.setState({ isLoad: false, addState: response.status === 400 ? 2 : 1 });
                    if (response.status === 401) {
                        this.setState({ isUnAuth: true })
                    }
                    else if (response.status === 201) {
                        this.setState({ addState: 1 })
                    }
                    else if (response.status === 403) {
                        this.setState({ isUnAuth: true })
                        alert('У вас не достаточно прав. Авторизуйтесь под учетной записью с правами администратора')
                    }
                })
                .catch(error => {
                    if (error.message === 'Failed to fetch') {
                        alert('Нет соединения с сервером');
                    }
                })
        }
        else {
            this.setState({ isLoad: false })
        }

    }

    render() {
        let load = this.state.isLoad ? <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="loading..." /> : ' ';
        let nameError = this.state.NameError ? 'Укажите имя' : ''
        let spError = this.state.EmailError ? 'Укажите Email' : ''
        let yearError = this.state.PasswordError ? 'Укажите пароль' : ''
        let addError = this.state.addState===2 ? 'Пользователь уже существует' : ''

        if (this.state.isUnAuth) {
            return (<Redirect to='/'></Redirect>)
        }

        if (this.state.addState===1) {
            return (<Redirect to='/user'></Redirect>)
        }
        if (this.state.isLoad) {
            return (
                <Container>
                    <Row>
                        <Col xs={{ span: 4 }}>
                            <Menu></Menu>
                        </Col>
                        <Col xs='4'>
                            {load}
                        </Col></Row>
                </Container>
            )
        }
        return (
            <Container>
                <Row>
                    <Col xs={{ span: 4 }}>
                        <Menu></Menu>
                    </Col>
                    <Col xs='4'>
                        <h5><font color='red'>{addError}</font></h5>
                        <Form method='post' size='sm'>
                            <Form.Group style={{marginBottom:'0px'}} controlId="formBasicEmail">
                                <Form.Label>Логин</Form.Label>
                                <Form.Control value={this.state.Name} onChange={this.onChangeName} type="text" placeholder="Введите логин" />
                                <Form.Label><font size='3' color='red'><b>{nameError}</b></font></Form.Label>
                            </Form.Group>

                            <Form.Group style={{marginBottom:'0px'}} controlId="formBasicPassword">
                                <Form.Label>Email</Form.Label>
                                <Form.Control value={this.state.Email} onChange={this.onChangeSpcialty} type="email" placeholder="Введите email" />
                                <Form.Label><font size='3' color='red'><b>{spError}</b></font></Form.Label>
                            </Form.Group>

                            <Form.Group style={{marginBottom:'0px'}} controlId="formBasicPassword">
                                <Form.Label>Пароль</Form.Label>
                                <Form.Control value={this.state.Password} onChange={this.onChangeYear} type='text'></Form.Control>
                                <Form.Label><font size='3' color='red'><b>{yearError}</b></font></Form.Label>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Роль</Form.Label>
                                <Form.Control value={this.state.Role} onChange={this.onChangeRole} as="select">
                                    <option value='user'>User</option>
                                    <option value='admin'>Admin</option>
                                </Form.Control>
                            </Form.Group>
                            <Button onClick={e => this.addFunc(e)} variant='success' type='submit'>
                                Редактировать
  </Button>
                        </Form>
                    </Col></Row>
            </Container>
        )
    }
}