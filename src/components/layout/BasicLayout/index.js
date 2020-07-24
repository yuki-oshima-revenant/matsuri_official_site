import React from 'react';
import { Layout, Button } from 'antd';
import {
    MenuOutlined,
    GithubOutlined
} from '@ant-design/icons';
import './index.css';

const { Header, Content, Footer } = Layout;


const Index = ({
    children,
    isMuted,
    setIsMuted
}) => {
    return (
        <Layout>
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'transparent' }}>
                <Button icon={<MenuOutlined />} size='large' style={{ backgroundColor: 'transparent', color: 'white' }} />
                <Button icon={<GithubOutlined />} size='large' style={{ backgroundColor: 'transparent', color: 'white', float: 'right', border: 'none', padding: 0, marginTop: 16 }}
                    onClick={() => { window.location.href = 'https://github.com/yuki-oshima-revenant/matsuri_official_site' }} />
                <Button size='large' style={{ backgroundColor: 'transparent', color: 'white', float: 'right', border: 'none', padding: 0, margin: 16 }}
                    onClick={()=>{setIsMuted(!isMuted)}}>
                        {isMuted ? 'sound on' : 'sound off'}
                    </Button>
            </Header>
            <Content className="site-layout" style={{ minHeight: '100vh', backgroundColor:'black' }}>
                {children}
            </Content>
            <Footer style={{ textAlign: 'center', backgroundColor:'black', color:'white' }}>©︎2020 Yuki Oshima</Footer>
        </Layout>
    );
};

export default Index;
