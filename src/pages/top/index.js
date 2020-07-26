import React from 'react';
import { Card, Carousel, Row, Col } from 'antd';
import BasicLayout from '../../components/layout/BasicLayout';
import FlierCard from '../../components/card/FlierCard';
import CategoryCard from '../../components/card/CategoryCard';
import {nextEvent, pastEventList, dekamoriList} from '../../data/event';
import './index.css';

const Index = ({
    history
}) => {
    return (
        <BasicLayout>
            <Carousel effect="fade">
                <div>
                    <img
                        src={`${process.env.PUBLIC_URL}/flier/2019.png`}
                        alt="top_image_2019"
                        style={{ width: '100%' }} />
                </div>
                <div>
                    <img
                        src={`${process.env.PUBLIC_URL}/flier/2018.png`}
                        alt="top_image_2018"
                        style={{ width: '100%' }} />
                </div>
                <div>
                    <img
                        src={`${process.env.PUBLIC_URL}/flier/2017.png`}
                        alt="top_image2017"
                        style={{ width: '100%' }} />
                </div>
            </Carousel>
            <Card
                style={{ margin: 24, backgroundColor: 'black', color: 'white' }}
                bordered={false}
            >
                <div id="next">
                    <Row gutter={[24, 24]}>
                        <Col>
                            <CategoryCard
                                title="次の祭"
                            >
                                <Row gutter={[24, 24]}>
                                    <Col sm={24} md={8}>
                                        <FlierCard
                                            category="flier"
                                            eventInfo={nextEvent}
                                        />
                                    </Col>
                                </Row>
                            </CategoryCard>
                        </Col>
                    </Row>
                </div>
                <div id="past">
                    <Row>
                        <Col>
                            <CategoryCard
                                title="過去の祭"
                            >
                                <Row gutter={[24, 24]}>
                                    {pastEventList.map((eventInfo) => (
                                        <Col sm={24} md={8}>
                                            <FlierCard
                                                category="flier"
                                                eventInfo={eventInfo}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </CategoryCard>
                        </Col>
                    </Row>
                </div>
                <div id="dekamori">
                    <Row>
                        <Col>
                            <CategoryCard
                                title="デカ盛り美食大会"
                            >
                                <Row>
                                    {dekamoriList.map((info) => (
                                        <Col sm={24} md={8}>
                                            <FlierCard
                                                category="dekamori"
                                                eventInfo={info}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </CategoryCard>
                        </Col>
                    </Row>
                </div>
            </Card>
        </BasicLayout>
    );
};

export default Index;
