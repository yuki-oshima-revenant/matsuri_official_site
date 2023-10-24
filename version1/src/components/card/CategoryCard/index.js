import React from 'react';
import { Card } from 'antd';

const { Meta } = Card;

const Index = ({
    title,
    children
}) => {
    return (
        <Card
            bordered={false}
            headStyle={{ color: 'white' }}
            style={{ width: '100%', backgroundColor: 'black', color: 'white' }}
            title={
                <div style={{fontWeight:'bold'}}>
                    {title}
                </div>
            }
        >
            {children}
        </Card>
    );
};

export default Index;
