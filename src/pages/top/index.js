import React, { useState } from 'react';
import { Typograpy, Card, Carousel, Row, Col } from 'antd';
import BasicLayout from '../../components/layout/BasicLayout';
import './index.css';

const { Meta } = Card;

const Index = ({

}) => {
    const [isMuted, setIsMuted] = useState(true);

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
            </iframe>
            <Carousel effect="fade">
                {/* <div>
                    <img src={`${process.env.PUBLIC_URL}/image/2017.png`} alt="top_image" style={{ width: '100%' }} />
                </div>
                <div>
                    <img src={`${process.env.PUBLIC_URL}/image/2018.png`} alt="top_image" style={{ width: '100%' }} />
                </div> */}
                <div>
                    <img src={`${process.env.PUBLIC_URL}/image/2019.png`} alt="top_image" style={{ width: '100%' }} />
                </div>
            </Carousel>
            <Card
                style={{ margin: 24, backgroundColor: 'black', color: 'white' }}
                bordered={false}
            >
                <Row gutter={[24, 24]}>
                    <Col>
                        <Card
                            bordered={false}
                            headStyle={{ color: 'white' }}
                            style={{ width: '100%', backgroundColor: 'black', color: 'white' }}
                            title="次の祭"
                        >
                            <Row gutter={[24, 24]}>
                                <Col span={8}>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        headStyle={{ color: 'white' }}
                                        style={{ width: '100%', backgroundColor: 'black', color: 'white' }}
                                        cover={<img alt="2020" src={`${process.env.PUBLIC_URL}/image/noimage.png`} />}
                                    >
                                        <Meta
                                            title={
                                                <div style={{ color: 'white' }}>
                                                    八王子別天地
                                            </div>
                                            }
                                            description={
                                                <div style={{ color: 'white' }}>
                                                    2020.09.xx
                                                    </div>
                                            } />
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card
                            bordered={false}
                            headStyle={{ color: 'white' }}

                            style={{ width: '100%', backgroundColor: 'black', color: 'white' }}
                            title="過去の祭"
                        >
                            <Row gutter={[24, 24]}>
                                <Col span={8}>
                                    <Card
                                        hoverable
                                        bordered={false}

                                        style={{ width: '100%', backgroundColor: 'black', color: 'white' }}
                                        cover={<img alt="example" src={`${process.env.PUBLIC_URL}/flier/2019.jpg`} />}
                                    >
                                        <Meta
                                            title={
                                                <div style={{ color: 'white' }}>
                                                    沢庵収穫祭
                                            </div>
                                            }
                                            description={
                                                <div style={{ color: 'white' }}>
                                                    2019.08.10
                                                    </div>
                                            } />
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card
                                        hoverable
                                        bordered={false}

                                        style={{ width: '100%', backgroundColor: 'black', color: 'white' }}
                                        cover={<img alt="example" src={`${process.env.PUBLIC_URL}/flier/2018.png`} />}
                                    >
                                        <Meta
                                            title={
                                                <div style={{ color: 'white' }}>
                                                    豊楽安寧祭
                                            </div>
                                            }
                                            description={
                                                <div style={{ color: 'white' }}>
                                                    2018.08.18
                                            </div>
                                            } />
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        style={{ width: '100%', backgroundColor: 'black', color: 'white' }}
                                        cover={<img alt="example" src={`${process.env.PUBLIC_URL}/flier/2017.png`} />}
                                    >
                                        <Meta
                                            title={
                                                <div style={{ color: 'white' }}>
                                                    七星剣武祭
                                            </div>
                                            }
                                            description={
                                                <div style={{ color: 'white' }}>
                                                    2017.08.18
                                            </div>
                                            } />
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card
                            bordered={false}
                            headStyle={{ color: 'white' }}
                            title="デカ盛り美食大会"
                            style={{ backgroundColor: 'black', color: 'white' }}>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </BasicLayout>
    );
};

export default Index;
