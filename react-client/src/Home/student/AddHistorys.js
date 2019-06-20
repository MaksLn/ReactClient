import React from 'react'
import { Form, Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import { Menu } from '../../Shared/Menu'

export class AddHistory extends React.Component {
    constructor(props) {
        super(props)

        this.state = { StartSkips: new Date().toISOString().substring(0, 10), Type: '', isLoad: false, StartSkipsError: false, TypeError: false,  addState: 0, isUnAuth: false }

        this.onChangeType = this.onChangeType.bind(this)
        this.onChangeYear = this.onChangeYear.bind(this)
        this.addFunc = this.addFunc.bind(this)
    }

    onChangeType(e) {
        this.setState({ Type: e.target.value })
    }

    onChangeSpcialty(e) {
        this.setState({ Cause: e.target.value })
    }

    onChangeYear(e) {
        this.setState({ StartSkips: e.target.value })
    }


    addFunc(e) {
        e.preventDefault()

        this.setState({
            TypeError: this.state.Type.length === 0 ? true : false,
            StartSkipsError: this.state.StartSkips === null ? true : false,
            isLoad: true
        })
        if ((this.state.Type.length === 0 ? true : false) === false & (this.state.StartSkips === null ? true : false) === false) {
            fetch('https://localhost:5001/api/student/history/' + this.props.location.state.StudentId, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Access-Control-Allow-Origin': '*',
                    Authorization: 'Bearer ' + sessionStorage.getItem('token')
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    type: this.state.Type,
                    dateTime: this.state.StartSkips,
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
        let TypeError = this.state.TypeError ? 'Укажите причину зачисления(отчисления)' : ''
        let yearError = this.state.StartSkipsError ? 'Укажите дату зачисления(отчисления)' : ''

        if (this.state.isUnAuth) {
            return (<Redirect to='/'></Redirect>)
        }

        if (this.state.addState === 1) {
            return (<Redirect to={{pathname:'/Historys', state:{Id: this.props.location.state.StudentId}}}></Redirect>)
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
                        <Form method='post' size='sm'>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Причина</Form.Label>
                                <Form.Control value={this.state.Type} onChange={this.onChangeType} type="text" placeholder="Введите причину зачисления(отчисления)" />
                                <Form.Label><font size='3' color='red'><b>{TypeError}</b></font></Form.Label>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Дата</Form.Label>
                                <Form.Control value={this.state.StartSkips} onChange={this.onChangeYear} type='date'></Form.Control>
                                <Form.Label><font size='3' color='red'><b>{yearError}</b></font></Form.Label>
                            </Form.Group>

                            <Button onClick={e => this.addFunc(e)} variant='success' type='submit'>
                                Добавить
  </Button>
                        </Form>
                    </Col></Row>
            </Container>
        )
    }
}