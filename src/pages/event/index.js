import React, {useEffect} from 'react';
import { Row, Col, Card } from 'antd';

import BasicLayout from '../../components/layout/BasicLayout';
import styles from './index.module.css';

export default () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const parent = process.env.NODE_ENV === 'development' ? 'localhost' : 'matsuri.unronritaro.net';
    return (
        <BasicLayout>
            <Card
                style={{ margin: 36, backgroundColor: 'black', color: 'white' }}
                bordered={false}
                title={
                    <div className={styles.title}>
                        八王子別天地
                    </div>
                }
            >
                <Row>
                    <Col xs={24} sm={18}>
                        <div className={styles.iframeContainerMovie}>
                            <iframe
                                title="twitch_movie"
                                src={`https://player.twitch.tv/?channel=matsuri_hachioji&parent=${parent}`}
                                frameborder="0"
                                allowfullscreen="true"
                                scrolling="no"
                                style={{ position: 'relative', height: '100%', width: '100%' }}
                            />
                        </div>
                    </Col>
                    <Col xs={24} sm={6}>
                        <div className={styles.iframeContainerChat}>
                            <iframe
                                title="twitch_chat"
                                id="chat_embed"
                                src={`https://www.twitch.tv/embed/matsuri_hachioji/chat?parent=${parent}`}
                                style={{ position: 'relative', height: '100%', width: '100%' }}
                            />
                        </div>
                    </Col>
                </Row>
            </Card>

        </BasicLayout>
    );
};
