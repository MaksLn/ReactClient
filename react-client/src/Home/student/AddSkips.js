import React from 'react'
import { Form, Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import { Menu } from '../../Shared/Menu'

export class AddSkips extends React.Component {
    constructor(props) {
        super(props)

        this.state = { StartSkips: new Date().toISOString().substring(0, 10), EndSkips: new Date().toISOString().substring(0, 10), Type: '', Cause: '', isLoad: false, EndSkipsError: false, StartSkipsError: false, TypeError: false, CauseError: false, addState: 0, isUnAuth: false }

        this.onChangeType = this.onChangeType.bind(this)
        this.onChangeSpcialty = this.onChangeSpcialty.bind(this)
        this.onChangeYear = this.onChangeYear.bind(this)
        this.onChangeEndSkips = this.onChangeEndSkips.bind(this)
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

    onChangeEndSkips(e) {
        this.setState({ EndSkips: e.target.value })
    }

    addFunc(e) {
        e.preventDefault()

        this.setState({
            TypeError: this.state.Type.length === 0 ? true : false,
            CauseError: this.state.Cause.length === 0 ? true : false,
            StartSkipsError: this.state.StartSkips === null ? true : false,
            EndSkipsError: this.state.EndSkips === null ? true : false,
            isLoad: true
        })
        if ((this.state.EndSkips === null ? true : false) === false & (this.state.Type.length === 0 ? true : false) === false & (this.state.Cause.length === 0 ? true : false) === false & (this.state.StartSkips === null ? true : false) === false) {
            fetch('https://localhost:5001/api/student/skips/' + this.props.location.state.StudentId, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Access-Control-Allow-Origin': '*',
                    Authorization: 'Bearer ' + sessionStorage.getItem('token')
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    typeSkips: this.state.Type,
                    cause: this.state.Cause,
                    startSkips: this.state.StartSkips,
                    endSkips: this.state.EndSkips,
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
        let TypeError = this.state.TypeError ? 'Укажите тип пропуска' : ''
        let spError = this.state.CauseError ? 'Укажите причину пропуска' : ''
        let yearError = this.state.StartSkipsError ? 'Укажите дату начала пропуска' : ''
        let endError = this.state.StartSkipsError ? 'Укажите дату конца пропусска' : ''

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
                                <Form.Label>Тип</Form.Label>
                                <Form.Control value={this.state.Type} onChange={this.onChangeType} type="text" placeholder="Введите тип пропуска" />
                                <Form.Label><font size='3' color='red'><b>{TypeError}</b></font></Form.Label>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Причина</Form.Label>
                                <Form.Control value={this.state.Cause} onChange={this.onChangeSpcialty} type="text" placeholder="Введите причину пропуска" />
                                <Form.Label><font size='3' color='red'><b>{spError}</b></font></Form.Label>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Дата начала</Form.Label>
                                <Form.Control value={this.state.StartSkips} onChange={this.onChangeYear} type='date'></Form.Control>
                                <Form.Label><font size='3' color='red'><b>{yearError}</b></font></Form.Label>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Дата конца</Form.Label>
                                <Form.Control value={this.state.EndSkips} onChange={this.onChangeEndSkips} type='date'></Form.Control>
                                <Form.Label><font size='3' color='red'><b>{endError}</b></font></Form.Label>
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