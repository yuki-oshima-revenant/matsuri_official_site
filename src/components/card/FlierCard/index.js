import React from 'react';
import { Card } from 'antd';

const { Meta } = Card;

const Index = ({
    category,
    eventInfo
}) => {
    const {id, title, description} = eventInfo;
    return (
        <Card
            hoverable
            bordered={false}
            style={{ width: '100%', backgroundColor: 'black', color: 'white' }}
            cover={<img alt={`flier_${id}`} src={`${process.env.PUBLIC_URL}/${category}/${id}.png`} />}
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

export default Index;
