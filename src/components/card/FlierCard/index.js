import React from 'react';
import { Card } from 'antd';
import { withRouter } from 'react-router-dom';
import { pastEventList } from '../../../data/event';

const { Meta } = Card;

const Index = ({
    category,
    type="archive",
    eventInfo,
    history
}) => {
    const { id, title, description } = eventInfo;
    return (
        <Card
            hoverable
            bordered={false}
            style={{ width: '100%', backgroundColor: 'black', color: 'white' }}
            cover={<img alt={`flier_${id}`} src={`${process.env.PUBLIC_URL}/${category}/${id}.png`} />}
            onClick={() => {
                // 暫定
                if (pastEventList.find((event) => (event.id === id))) {
                    history.push(`/archive/${id}`);
                }else if(type === 'next'){
                    history.push("/event");
                }
            }}
        >
            <Meta
                title={
                    <div style={{ color: 'white' }}>
                        {title}
                    </div>
                }
                description={
                    <div style={{ color: 'white' }}>
                        {description}
                    </div>
                } />
        </Card>
    )
};

export default withRouter(Index);
