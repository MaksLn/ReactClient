import React from 'react';
import { Container } from "react-bootstrap";
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Menu } from '../Shared/Menu'

export class Home extends React.Component {
    render() {
        return (
            <Container style={{ margin: "unset", padding: "unset" }}>
                <br></br>
                <Row>
                    <Col style={{ margin: 'unset' }} lg='2'>
                        <Menu></Menu>
                    </Col>
                    <Col lg='10'>
                        Тема: система деканат (студенты факультета)
                        Описание информационной системы:
                        Система предназначена для ведения базы данных студентов факультета. Функции
                        системы: создание, удаление и редактирование групп. Каждая группа
                        характеризуется: наименование, специальность, год создания. Также система
                        должна позволять создавать, редактировать и удалять данные о студентах (ФИО,
            
                        дата рождения, адрес, номер зачетной книжки) и осуществлять зачисление или
                        отчисление студентов в группы. Для каждого студента должна храниться история
                        его зачислений и отчислений. Дополнительно система должна предоставлять
                        возможность хранить в базе данных информацию о причинах пропусков студентом
                        занятий (справки, заявления и т.д.). Доступ к системе осуществляется после
                        процедуры аутентификации. Предполагается, что доступ к системе может
                        осуществляться несколькими пользователями, поэтому необходимо предусмотреть
                        процедуру авторизации.
                </Col>
                </Row>
            </Container>
        )
    }
}