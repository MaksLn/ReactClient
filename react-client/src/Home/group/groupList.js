import React from 'react'
import { Container, Button } from "react-bootstrap";
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Menu } from '../../Shared/Menu'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Redirect } from "react-router-dom";


export class GroupList extends React.Component {

    constructor(props) {
        super(props);

        this.state = { isLoading: true, data: [], isUnAuth: false }

        this.DeleteElement = this.DeleteElement.bind(this)
    }

    DeleteElement(Id) {
        this.setState({ data: this.state.data.filter(el => el.id !== Id) })
    }

    componentDidMount() {
        fetch("https://localhost:5001/api/groups",
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
                        <Col lg='10'></Col>
                        <Button variant='success'><Link style={{ textDecoration: 'none', color: 'white' }} to='AddGroup'>Добавить группу</Link></Button>
                        <Col lg='2'></Col>
                    </Row>
                    <Row >
                        <Col style={{ margin: 'unset' }} lg='2'>
                            <Menu></Menu>
                        </Col>
                        <Col sm='10'>
                            <Table className='table table-hover' striped bordered size='sm'>
                                <thead>
                                    <tr>
                                        <th>Название</th>
                                        <th>Специальность</th>
                                        <th>Год создания</th>
                                        <th>Кол-во студентов</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.data.map(e =>
                                        <tr id={e.id} style={{ fontSize: '0.85em' }}>
                                            <th style={{ fontWeight: 'normal' }}>{e.name}</th>
                                            <th style={{ fontWeight: 'normal' }}>{e.specialty}</th>
                                            <th style={{ fontWeight: 'normal' }}>{new Date(e.createYear).toLocaleDateString()}</th>
                                            <th style={{ fontWeight: 'normal' }}>{e.count}</th>
                                            <th><UpdateGroup Id={e.id} Name={e.name} Specialty={e.specialty} CreateYear={e.createYear} /></th>
                                            <th><DeleteGroup Id={e.id} DeleteElement={this.DeleteElement} ></DeleteGroup></th>
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

class UpdateGroup extends React.Component {
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
                pathname: '/UpdateGroup',
                state: { Name: this.props.Name, Specialty: this.props.Specialty, CreateYear: this.props.CreateYear, Id: this.props.Id }
            }}></Redirect>)
        }

        return (<Button onClick={this.onUpdate} style={{ marginLeft: '10%' }} size='sm' variant='primary'>Изменить</Button>)
    }
}

class DeleteGroup extends React.Component {
    constructor(props) {
        super(props);
        this.ClickDelete = this.ClickDelete.bind(this)
    }

    ClickDelete() {
        fetch('https://localhost:5001/api/groups/' + this.props.Id, {
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
        return (<Button style={{ marginLeft: '10%' }} onClick={this.ClickDelete} size='sm' variant='danger'>Удалить</Button>)
    }
}