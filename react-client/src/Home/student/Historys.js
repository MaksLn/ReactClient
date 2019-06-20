import React from 'react'
import { Container, Button } from "react-bootstrap";
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Menu } from '../../Shared/Menu'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Redirect } from "react-router-dom";

export class Historys extends React.Component {

    render() {
        return (<Container style={{ margin: "unset", padding: "unset" }}>
            <br></br>
            <Row>
                <Col style={{ margin: 'unset' }} lg='2'>
                    <Menu></Menu>
                </Col>
                <Col lg='5'>
                    <Skips Id={this.props.location.state.Id}></Skips>
                </Col>
                <Col lg='5'>
                    <History Id={this.props.location.state.Id}></History>
                </Col>
            </Row>
        </Container>)
    }
}

class Skips extends React.Component {
    constructor(props) {
        super(props)

        this.state = { Id: '', IdStudent: this.props.Id, data: [], isLoading: true, isAuth: false }

        this.DeleteElement = this.DeleteElement.bind(this);
    }

    DeleteElement(Id) {
        this.setState({ data: this.state.data.filter(el => el.idSkips !== Id) })
    }

    componentDidMount() {
        fetch("https://localhost:5001/api/student/skips/" + this.state.IdStudent,
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
            return (<div>
                {load}
            </div>
            )
        }
        return (
            <div>
                <Button variant='success'><Link style={{ textDecoration: 'none', color: 'white' }} to={{ pathname: '/AddSkips', state: { StudentId: this.state.IdStudent } }} > Добавить пропуск</Link></Button>
                <Table className='table table-hover' striped bordered size='sm'>
                    <thead>
                        <tr>
                            <th>Причина</th>
                            <th>Тип</th>
                            <th>Числа</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(e =>
                            <tr id={e.id} style={{ fontSize: '0.85em' }}>
                                <th style={{ fontWeight: 'normal' }}>{e.cause}</th>
                                <th style={{ fontWeight: 'normal' }}>{e.typeSkips}</th>
                                <th style={{ fontWeight: 'normal' }}>{new Date(e.startSkips).toLocaleDateString()}-{new Date(e.endSkips).toLocaleDateString()}</th>
                                <th><DeleteSkips Id={e.idSkips} DeleteElement={this.DeleteElement} ></DeleteSkips></th>
                            </tr>)}
                    </tbody>
                </Table>
            </div>
        )
    }
}

class DeleteSkips extends React.Component {
    constructor(props) {
        super(props);
        this.ClickDelete = this.ClickDelete.bind(this)
    }

    ClickDelete() {
        fetch('https://localhost:5001/api/student/skips/' + this.props.Id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                Authorization: 'Bearer ' + sessionStorage.getItem('token')
            },
            credentials: "same-origin"
        })
            .then(response => this.props.DeleteElement(this.props.Id))
            .catch(error => {
                if (error.message === 'Failed to fetch') {
                    alert('Нет соединения с сервером');
                }
            })
    }

    render() {
        return (<Button style={{ marginLeft: '5%' }} onClick={this.ClickDelete} size='sm' variant='danger'>Удалить</Button>)
    }
}

class History extends React.Component {
    constructor(props) {
        super(props)

        this.state = { Id: '', IdStudent: this.props.Id, data: [], isLoading: true, isAuth: false }

        this.DeleteElement = this.DeleteElement.bind(this);
    }

    DeleteElement(Id) {
        this.setState({ data: this.state.data.filter(el => el.id !== Id) })
    }

    componentDidMount() {
        fetch("https://localhost:5001/api/student/history/" + this.state.IdStudent,
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
            return (<div>
                {load}
            </div>
            )
        }
        return (
            <div>
                <Button variant='success'><Link style={{ textDecoration: 'none', color: 'white' }} to={{pathname: '/AddHistory', state: {StudentId: this.state.IdStudent}}}>Добавить зачисление(отчисление)</Link></Button>
                <Table className='table table-hover' striped bordered size='sm'>
                    <thead>
                        <tr>
                            <th>Причина</th>
                            <th>Дата</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(e =>
                            <tr id={e.id} style={{ fontSize: '0.85em' }}>
                                <th style={{ fontWeight: 'normal' }}>{e.type}</th>
                                <th style={{ fontWeight: 'normal' }}>{new Date(e.dateTime).toLocaleDateString()}</th>
                                <th><DeleteHistory Id={e.id} DeleteElement={this.DeleteElement} ></DeleteHistory></th>
                            </tr>)}
                    </tbody>
                </Table>
            </div>
        )
    }
}

class DeleteHistory extends React.Component {
    constructor(props) {
        super(props);
        this.ClickDelete = this.ClickDelete.bind(this)
    }

    ClickDelete() {
        fetch('https://localhost:5001/api/student/history/' + this.props.Id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                Authorization: 'Bearer ' + sessionStorage.getItem('token')
            },
            credentials: "same-origin"
        })
            .then(response => this.props.DeleteElement(this.props.Id))
            .catch(error => {
                if (error.message === 'Failed to fetch') {
                    alert('Нет соединения с сервером');
                }
            })
    }

    render() {
        return (<Button style={{ marginLeft: '5%' }} onClick={this.ClickDelete} size='sm' variant='danger'>Удалить</Button>)
    }
}
