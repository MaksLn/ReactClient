import React from 'react'
import { Form, Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import { Menu } from '../../Shared/Menu'

export class AddStudent extends React.Component {
    constructor(props) {
        super(props)

        this.state = { MidleName: '', Name: '', LastName: '', Address: '', NumberOfBooks: '', GroupName: '', AddressError: false, NumberOfBooksError: false, isLoad: false, MidleNameError: false, NameError: false, LastNameError: false, addState: 0, isUnAuth: false }

        this.onChangeName = this.onChangeName.bind(this)
        this.onChangeSpcialty = this.onChangeSpcialty.bind(this)
        this.onChangeYear = this.onChangeYear.bind(this)
        this.onChangeAddress = this.onChangeAddress.bind(this)
        this.onChangeGroupName = this.onChangeGroupName.bind(this)
        this.onChangeNumberOfBook = this.onChangeNumberOfBook.bind(this)
        this.addFunc = this.addFunc.bind(this)
    }

    onChangeName(e) {
        this.setState({ Name: e.target.value })
    }

    onChangeSpcialty(e) {
        this.setState({ LastName: e.target.value })
    }

    onChangeYear(e) {
        this.setState({ MidleName: e.target.value })
    }

    onChangeAddress(e) {
        this.setState({ Address: e.target.value })
    }

    onChangeNumberOfBook(e) {
        this.setState({ NumberOfBooks: e.target.value })
    }

    onChangeGroupName(e) {
        this.setState({ GroupName: e.target.value })
    }

    addFunc(e) {
        e.preventDefault()

        this.setState({
            NameError: this.state.Name.length === 0 ? true : false,
            LastNameError: this.state.LastName.length === 0 ? true : false,
            MidleNameError: this.state.MidleName.length === 0 ? true : false,
            AddressError: this.state.Address.length === 0 ? true : false,
            NumberOfBooksError: this.state.NumberOfBooks.length === 0 ? true : false,
            isLoad: true
        })
        if ((this.state.NumberOfBooks.length === 0) === false&(this.state.Address.length === 0) === false & (this.state.Name.length === 0 ? true : false) === false & (this.state.LastName.length === 0 ? true : false) === false & (this.state.MidleName === null ? true : false) === false) {
            fetch('https://localhost:5001/api/student', {
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
                    LastName: this.state.LastName,
                    MidleName: this.state.MidleName,
                    NumberOfBook: this.state.NumberOfBooks,
                    Address: this.state.Address,
                    GroupName: this.state.GroupName
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
        let spError = this.state.LastNameError ? 'Укажите специальность' : ''
        let yearError = this.state.MidleNameError ? 'Укажите дату создания' : ''
        let addressError = this.state.AddressError ? 'Укажите адрес' : ''
        let numberOfBooksError = this.state.NumberOfBooksError ? 'Укажите номер зачетной книги' : ''
        let addError = this.state.addState === 2 ? 'Студент уже существует' : ''

        if (this.state.isUnAuth) {
            return (<Redirect to='/'></Redirect>)
        }

        if (this.state.addState === 1) {
            return (<Redirect to='/student'></Redirect>)
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
                                <Form.Label>Имя</Form.Label>
                                <Form.Control value={this.state.Name} onChange={this.onChangeName} type="text" placeholder="Введите имя" />
                                <Form.Label><font size='3' color='red'><b>{nameError}</b></font></Form.Label>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Фамилия</Form.Label>
                                <Form.Control value={this.state.MidleName} onChange={this.onChangeYear} type='text' placeholder='Ввудите фамилию'></Form.Control>
                                <Form.Label><font size='3' color='red'><b>{yearError}</b></font></Form.Label>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Отчество</Form.Label>
                                <Form.Control value={this.state.LastName} onChange={this.onChangeSpcialty} type="text" placeholder="Введите отчество" />
                                <Form.Label><font size='3' color='red'><b>{spError}</b></font></Form.Label>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Адрес</Form.Label>
                                <Form.Control value={this.state.Address} onChange={this.onChangeAddress} type="text" placeholder="Введите адрес" />
                                <Form.Label><font size='3' color='red'><b>{addressError}</b></font></Form.Label>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Номер зачетной книги</Form.Label>
                                <Form.Control value={this.state.NumberOfBooks} onChange={this.onChangeNumberOfBook} type="text" placeholder="Введите номер" />
                                <Form.Label><font size='3' color='red'><b>{numberOfBooksError}</b></font></Form.Label>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Группа</Form.Label>
                                <Form.Control value={this.state.GroupName} onChange={this.onChangeGroupName} type="text" placeholder="Введите группу" />
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