import React from 'react'
import { Form, Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import { Menu } from '../../Shared/Menu'

export class AddGroup extends React.Component {
    constructor(props) {
        super(props)

        this.state = { CreateYear: new Date().toISOString().substring(0,10), Name: '', Specialty: '', isLoad: false, CreateYearError: false, NameError: false, SpecialtyError: false, addState: 0, isUnAuth: false }

        this.onChangeName = this.onChangeName.bind(this)
        this.onChangeSpcialty = this.onChangeSpcialty.bind(this)
        this.onChangeYear = this.onChangeYear.bind(this)
        this.addFunc = this.addFunc.bind(this)
    }

    onChangeName(e) {
        this.setState({ Name: e.target.value })
    }

    onChangeSpcialty(e) {
        this.setState({ Specialty: e.target.value })
    }

    onChangeYear(e) {
        this.setState({ CreateYear: e.target.value })
    }

    addFunc(e) {
        e.preventDefault()

        this.setState({
            NameError: this.state.Name.length === 0 ? true : false,
            SpecialtyError: this.state.Specialty.length === 0 ? true : false,
            CreateYearError: this.state.CreateYear === null ? true : false,
            isLoad: true
        })
        if ((this.state.Name.length === 0 ? true : false) === false & (this.state.Specialty.length === 0 ? true : false) === false & (this.state.CreateYear === null ? true : false) === false) {
            fetch('https://localhost:5001/api/groups', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Access-Control-Allow-Origin': '*',
                    Authorization: 'Bearer ' + sessionStorage.getItem('token')
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    name: this.state.Name,
                    specialty: this.state.Specialty,
                    CreateYear: this.state.CreateYear
                })
            })
                .then(response => {
                    this.setState({ isLoad: false, addState: response.status === 400 ? 2: 1 });
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
        let spError = this.state.SpecialtyError ? 'Укажите специальность' : ''
        let yearError = this.state.CreateYearError ? 'Укажите дату создания' : ''
        let addError = this.state.addState===2 ? 'Группа уже существует' : ''

        if (this.state.isUnAuth) {
            return (<Redirect to='/'></Redirect>)
        }

        if (this.state.addState===1) {
            return (<Redirect to='/group'></Redirect>)
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
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Название</Form.Label>
                                <Form.Control value={this.state.Name} onChange={this.onChangeName} type="text" placeholder="Введите название" />
                                <Form.Label><font size='3' color='red'><b>{nameError}</b></font></Form.Label>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Специальность</Form.Label>
                                <Form.Control value={this.state.Specialty} onChange={this.onChangeSpcialty} type="text" placeholder="Введите специальность" />
                                <Form.Label><font size='3' color='red'><b>{spError}</b></font></Form.Label>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Дата создания</Form.Label>
                                <Form.Control value={this.state.CreateYear} onChange={this.onChangeYear} type='date'></Form.Control>
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