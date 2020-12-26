import React, { useMemo } from 'react';
import { Card, Carousel, Row, Col } from 'antd';
import BasicLayout from '../../components/layout/BasicLayout';
import FlierCard from '../../components/card/FlierCard';
import CategoryCard from '../../components/card/CategoryCard';
import { nextEvent, pastEventList, dekamoriList } from '../../data/event';
import styles from './index.module.css';

const Index = ({
    history
}) => {
    const overlayText = useMemo(() => {
        return (
            <div className={styles.centeredText}>
                <div>
                    僕の<span className={styles.emphasis}>最弱</span>を以て、
                            </div>
                <div>
                    君の<span className={styles.emphasis}>最強</span>を打ち破る——。
                            </div>
            </div>
        )
    }, []);

    return (
        <BasicLayout>
            <Carousel
                effect="fade">
                <div className={styles.container}>
                    <div className={styles.trim}>
                        <img
                            src={`${process.env.PUBLIC_URL}/background/2020_03.png`}
                            alt="top_image_2020"
                            className={styles.topImage}
                        />
                    </div>
                    {overlayText}
                </div>
                {/* <div className={styles.trim}>
                    <img
                        src={`${process.env.PUBLIC_URL}/flier/2019.png`}
                        alt="top_image_2019"
                        style={{ width: '100%' }} />
                </div>
                <div className={styles.trim}>
                    <img
                        src={`${process.env.PUBLIC_URL}/flier/2018.png`}
                        alt="top_image_2018"
                        style={{ width: '100%' }} />
                </div>
                <div className={styles.trim}>
                    <img
                        src={`${process.env.PUBLIC_URL}/flier/2017.png`}
                        alt="top_image2017"
                        style={{ width: '100%' }} />
                </div> */}
            </Carousel>
            <Card
                style={{ marginRight: 16, marginLeft: 16, backgroundColor: 'black', color: 'white' }}
                bordered={false}
            >
                {/* <div id="next">
                    <Row gutter={[24, 24]}>
                        <Col>
                            <CategoryCard
                                title="次の祭"
                            >
                                <Row gutter={[24, 24]}>
                                    <Col sm={24} md={8}>
                                        <FlierCard
                                            category="flier"
                                            type="next"
                                            eventInfo={nextEvent}
                                        />
                                    </Col>
                                </Row>
                            </CategoryCard>
                        </Col>
                    </Row>
                </div> */}
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
