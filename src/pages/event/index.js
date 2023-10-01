import React, { useEffect, useMemo } from 'react';
import { Card, Row, Col, List } from 'antd';
import BasicLayout from '../../components/layout/BasicLayout';
import styles from './index.module.css';
import { events, timetables } from '../../data/event';

const Index = ({
    match
}) => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const targetEventData = useMemo(() => {
        return events[match.params.id];
    }, [match]);

    return (
        <BasicLayout>
            <Card
                style={{ marginTop: 32, marginRight: 16, marginLeft: 16, backgroundColor: 'black', color: 'white' }}
                bordered={false}
                title={
                    <div className={styles.title}>
                        {targetEventData.title}
                    </div>
                }
            >
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={16} xl={16}>
                        <Row gutter={[0, 24]}>
                            <Col span={24}>
                                <div className={styles.description}>
                                    {targetEventData.description}
                                </div>
                            </Col>
                            <Col span={24}>
                                <img
                                    src={`${process.env.PUBLIC_URL}/flier/${targetEventData.id}.png`}
                                    alt="event_image"
                                    style={{ width: '100%' }} />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} lg={8} xl={8}>
                        <div className="timetable">
                            <List
                                itemLayout="horizontal"
                            >
                                {timetables[match.params.id].map((data, index) => (
                                    <List.Item key={index} >
                                        <List.Item.Meta
                                            title={data.name}
                                            description={data.time}
                                        />
                                    </List.Item>
                                ))}
                            </List>
                        </div>
                    </Col>
                </Row>
            </Card>
        </BasicLayout>
    );
};

export default Index;
