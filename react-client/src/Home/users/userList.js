import React from 'react'
import { Container, Button } from "react-bootstrap";
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Menu } from '../../Shared/Menu'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Redirect } from "react-router-dom";


export class UserList extends React.Component {

    constructor(props) {
        super(props);

        this.state = { isLoading: true, data: [], isUnAuth: false }

        this.DeleteElement = this.DeleteElement.bind(this)
    }

    DeleteElement(Name) {
        this.setState({ data: this.state.data.filter(el => el.name !== Name) })
    }

    componentDidMount() {
        fetch("https://localhost:5001/api/user",
            {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 401) {
                    this.setState({ isUnAuth: true })
                }
                else if (data.status === 403) {
                    this.setState({ isUnAuth: true })
                    alert('У вас не достаточно прав. Авторизуйтесь под учетной записью с правами администратора')
                }
                this.setState({ data: data, isLoading: false });
            })
            .catch(error => {
                if (error.message === 'Failed to fetch') {
                    alert('Нет соединения с сервером');
                } else if (error.message === 'Unexpected end of JSON input') {
                    this.setState({ isUnAuth: true })
                }
            })
    }

    render() {
        let load = <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="loading..." />;

        if (this.state.isUnAuth) {
            return (<Redirect to='/'></Redirect>)
        }

        if (this.state.isLoading) {
            return (
                <Container style={{ margin: "unset", padding: "unset" }}>
                    <br></br>
                    <Row>
                        <Col style={{ margin: 'unset' }} lg='2'>
                            <Menu></Menu>
                        </Col>
                        <Col xs={{ offset: 2, span: 2 }}>
                            {load}
                        </Col>
                    </Row>
                </Container>
            )
        }
        else {
            return (
                <Container style={{ margin: "unset", padding: "unset" }}>
                    <Row>
                        <Col lg='9'></Col>
                        <Col lg='3'>
                        <Button variant='success'><Link style={{ textDecoration: 'none', color: 'white' }} to='/AddUser'>Добавить пользователя</Link></Button>
                        </Col>
                    </Row>
                    <Row >
                        <Col style={{ margin: 'unset' }} lg='2'>
                            <Menu></Menu>
                        </Col>
                        <Col lg='10'>
                            <Table className='table table-hover' striped bordered size='sm'>
                                <thead>
                                    <tr>
                                        <th>Логин</th>
                                        <th>Email</th>
                                        <th>Пароль</th>
                                        <th>Роль</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.data.map(e =>
                                        <tr style={{ fontSize: '0.85em' }}>
                                            <th style={{ fontWeight: 'normal' }}>{e.name}</th>
                                            <th style={{ fontWeight: 'normal' }}>{e.email}</th>
                                            <th style={{ fontWeight: 'normal' }}>{e.password}</th>
                                            <th style={{ fontWeight: 'normal' }}>{e.role}</th>
                                            <th style={{ fontWeight: 'normal', width:'14%' }}><UpdateUser Name={e.name} Email={e.email} Password={e.password} Role={e.role} /></th> 
                                            <th style={{ fontWeight: 'normal', widht:'12%' }}><DeleteUser Name={e.name} DeleteElement={this.DeleteElement} ></DeleteUser></th>
                                        </tr>)}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            )

        }
    }
}

class UpdateUser extends React.Component {
    constructor(props) {
        super(props)

        this.state = { isUpdate: false }
        this.onUpdate = this.onUpdate.bind(this)
    }

    onUpdate() {
        this.setState({ isUpdate: true })
    }

    render() {
        if (this.state.isUpdate) {
            return (<Redirect to={{
                pathname: '/UpdateUser',
                state: {PrevLogin: this.props.Name, Name: this.props.Name, Email: this.props.Email, Password: this.props.Password, Role: this.props.Role }
            }}></Redirect>)
        }

        return (<Button onClick={this.onUpdate} style={{ marginLeft: '10%' }} size='sm' variant='primary'>Изменить</Button>)
    }
}

class DeleteUser extends React.Component {
    constructor(props) {
        super(props);
        this.ClickDelete = this.ClickDelete.bind(this)
    }

    ClickDelete() {
        fetch('https://localhost:5001/api/user/' + this.props.Name, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                Authorization: 'Bearer ' + sessionStorage.getItem('token')
            },
            credentials: "same-origin"
        })
            .then(response => this.props.DeleteElement(this.props.Name))
            .catch(error => {
                if (error.message === 'Failed to fetch') {
                    alert('Нет соединения с сервером');
                }
            })
    }

    render() {
        return (<Button style={{ marginLeft: '20%' }} onClick={this.ClickDelete} size='sm' variant='danger'>Удалить</Button>)
    }
}