import React, { useMemo, useEffect, useCallback } from 'react';
import { Card, Row, Col, List } from 'antd';
import BasicLayout from '../../components/layout/BasicLayout';
import { archiveDataIndex } from '../../data/archive';
import { pastEventList } from '../../data/event';
import styles from './index.module.css';

const Index = ({
    match
}) => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const targetEventData = useMemo(() => {
        return pastEventList.find((data) => (data.id === match.params.id));
    }, [match]);
    const targetArchiveData = useMemo(() => {
        return archiveDataIndex[match.params.id];
    }, [match]);

    const onLinkClick = useCallback((linkId) => {
        window.open(`https://drive.google.com/file/d/${linkId}/view?usp=sharing`);
    }, []);

    const actions = useCallback((data) => {
        const actionList = [];
        if (data.tracklistId && data.tracklistId !== '') {
            actionList.push(
                <a onClick={() => { onLinkClick(data.tracklistId); }}>TrackList</a>
            );
        }
        if (data.recordingId && data.recordingId !== '') {
            actionList.push(
                <a onClick={() => { onLinkClick(data.recordingId); }}>
                    {'Recording'}
                </a>
            );
        }
        if (data.videoId && data.videoId !== '') {
            actionList.push(
                <a onClick={() => { onLinkClick(data.videoId); }}>
                    {'Video'}
                </a>
            );
        }
        if (data.streamRecId && data.streamRecId !== '') {
            actionList.push(
                <a onClick={() => { onLinkClick(data.streamRecId); }}>
                    {'StreamRec'}
                </a>
            );
        }
        return actionList;
    }, [onLinkClick, targetEventData]);

    return (
        <BasicLayout>
            <Card
                style={{ marginTop: 32, marginRight: 16, marginLeft: 16, backgroundColor: 'black', color: 'white' }}
                bordered={false}
                title={
                    <div className={styles.title}>
                        {targetEventData && targetEventData.title}
                    </div>
                }
            >
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Row gutter={[0, 24]}>
                            <Col span={24}>
                                <div className={styles.description}>
                                    {targetEventData.description}
                                </div>
                            </Col>
                            <Col span={24}>
                                <img
                                    src={`${process.env.PUBLIC_URL}/flier/${match.params.id}.png`}
                                    alt="event_image"
                                    style={{ width: '100%' }} />
                            </Col>
                        </Row>

                    </Col>
                    <Col xs={24} lg={12} xl={10}>
                        <div className="timetable">
                            <List
                                itemLayout="horizontal"
                            >
                                {targetArchiveData
                                    && targetArchiveData.map((data) => (
                                        <List.Item
                                            actions={actions(data)}
                                        >
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
