import React, { useMemo } from 'react';
import { Layout, Button, Menu, Dropdown } from 'antd';
import { HashLink } from 'react-router-hash-link';

import {
    MenuOutlined,
    GithubOutlined
} from '@ant-design/icons';
import styles from './index.module.css';

const { Header, Content, Footer } = Layout;


const Index = ({
    children,
    isMuted,
    setIsMuted
}) => {
    const rightButtonStyle = {
        backgroundColor: 'transparent',
        color: 'white',
        float: 'right',
        border: 'none',
        padding: 0,
        marginTop: 16
    };
    const menuList = [
        {
            id:'next',
            name:'次の祭'
        },
        {
            id:'past',
            name:'過去の祭'
        },
        {
            id:'dekamori',
            name:'デカ盛り美食大会'
        }
    ]
    const menu = useMemo(() => {
        return (
            <Menu
                style={{
                    // backgroundColor: 'transparent',
                    // borderColor: 'transparent' 
                }}
            >
                {menuList.map((menu) => (
                    <Menu.Item
                        className={styles.menuItem}>
                        <HashLink to={`#${menu.id}`}>{menu.name}</HashLink>
                    </Menu.Item>
                ))}
            </Menu>
        )
    }, [])

    return (
        <Layout>
            <Header style={{
                position: 'fixed',
                zIndex: 1,
                width: '100%',
                backgroundColor: 'transparent',
                paddingRight: 24,
                paddingLeft: 24,
            }}>
                <Dropdown overlay={menu}>
                    <Button icon={<MenuOutlined />} size='large' style={{
                        backgroundColor: 'transparent',
                        color: 'white',
                        borderColor: 'transparent'
                    }} />
                </Dropdown>
                <Button icon={<GithubOutlined />} size='large' style={rightButtonStyle}
                    onClick={() => { window.location.href = 'https://github.com/yuki-oshima-revenant/matsuri_official_site' }} />
                <Button size='large' style={rightButtonStyle}
                    onClick={() => { setIsMuted(!isMuted) }}>
                    {isMuted ? 'sound on' : 'sound off'}
                </Button>
            </Header>
            <Content className="site-layout" style={{ minHeight: '100vh', backgroundColor: 'black' }}>
                {children}
            </Content>
            <Footer style={{ textAlign: 'center', backgroundColor: 'black', color: 'white' }}>©︎2020 Yuki Oshima</Footer>
        </Layout>
    );
};

export default Index;
