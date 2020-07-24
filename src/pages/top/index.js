import React, { useState } from 'react';
import { Typograpy, Card, Carousel, Row, Col } from 'antd';
import BasicLayout from '../../components/layout/BasicLayout';
import FlierCard from '../../components/card/FlierCard';
import CategoryCard from '../../components/card/CategoryCard';
import './index.css';

const { Meta } = Card;

const Index = ({

}) => {
    const [isMuted, setIsMuted] = useState(true);
    const nextEvent = {
        id: '2020',
        title: '八王子別天地',
        description: '2020.09.xx'
    };
    const pastEventList = [
        {
            id: '2019',
            title: '沢庵収穫祭',
            description: '2019.08.10'
        },
        {
            id: '2018',
            title: '豊楽安寧祭',
            description: '2018.08.18'
        },
        {
            id: '2017',
            title: '七星剣武祭',
            description: '2017.08.18'
        }
    ];
    const dekamoriList = [
        {
            id: '0001',
            title: '鮎の塩焼きまるかじり',
            description: '2019.03.10 にいがた酒の陣'
        }
    ];

    return (
        <BasicLayout
            isMuted={isMuted}
            setIsMuted={setIsMuted}
        >
            <iframe
                allow="autoplay"
                className="midi"
                title="bgm"
                src={isMuted ? 'about:blank' : `${process.env.PUBLIC_URL}/identity.mp3`}
            >
                {/* <audio className="midi" autoPlay loop>
                    <source src={isMuted ? 'about:blank' : `${process.env.PUBLIC_URL}/identity.mp3`} />
                </audio> */}
            </iframe>
            <Carousel effect="fade">
                <div>
                    <img src={`${process.env.PUBLIC_URL}/image/2019.png`} alt="top_image" style={{ width: '100%' }} />
                </div>
                <div>
                    <img src={`${process.env.PUBLIC_URL}/image/2018.png`} alt="top_image" style={{ width: '100%' }} />
                </div>
                <div>
                    <img src={`${process.env.PUBLIC_URL}/image/2017.png`} alt="top_image" style={{ width: '100%' }} />
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
