import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { Card, Row, Col, List, Modal, Input, Button } from 'antd';
import BasicLayout from '../../components/layout/BasicLayout';
import { archiveDataIndex } from '../../data/archive';
import { pastEventList } from '../../data/event';
import styles from './index.module.css';

const Index = ({
    match
}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [inputPassword, setInputPassword] = useState();
    const [targetLinkid, setTargetLinkid] = useState();
    const [passed, setPassed] = useState(false);

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
        if (passed) {
            window.open(`https://drive.google.com/file/d/${linkId}/view?usp=sharing`);
        } else {
            setModalOpen(true);
            setTargetLinkid(linkId);
        }
    }, [passed])

    const onPasswordEnter = useCallback(() => {
        if (String(inputPassword) === "5163") {
            window.open(`https://drive.google.com/file/d/${targetLinkid}/view?usp=sharing`);
            setModalOpen(false);
            setPassed(true);
        }
    }, [targetLinkid, inputPassword]);

    const handleModalCancel = useCallback(() => {
        setModalOpen(false);
    }, []);

    const actions = useCallback((data) => {
        const actionList = [];
        if (data.tracklistId !== '') {
            actionList.push(
                <a onClick={() => { onLinkClick(data.tracklistId); }}>TrackList</a>
            );
        }
        if (data.recordingId !== '') {
            actionList.push(
                <a onClick={() => { onLinkClick(data.recordingId); }}>Recording</a>
            );
        }
        return actionList;
    }, [onLinkClick]);

    return (
        <BasicLayout>
            <Card
                style={{ margin: 36, backgroundColor: 'black', color: 'white' }}
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
            <Modal
                title="ひみつのパスワード"
                visible={modalOpen}
                onCancel={handleModalCancel}
                footer={
                    <Button onClick={onPasswordEnter}>OK</Button>
                }
            >
                <Input
                    value={inputPassword}
                    onChange={(e) => { setInputPassword(e.target.value) }}
                    onPressEnter={onPasswordEnter}
                />
            </Modal>
        </BasicLayout>
    );
};

export default Index;
