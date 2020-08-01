import React, { useMemo, useState } from 'react';
import { Layout, Button, Menu, Dropdown } from 'antd';
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
import {
    MenuOutlined,
    GithubOutlined
} from '@ant-design/icons';
import styles from './index.module.css';

const { Header, Content, Footer } = Layout;


const Index = ({
    children
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
            id: 'next',
            name: '次の祭'
        },
        {
            id: 'past',
            name: '過去の祭'
        },
        {
            id: 'dekamori',
            name: 'デカ盛り美食大会'
        }
    ];

    const [isMuted, setIsMuted] = useState(true);
    const menu = useMemo(() => {
        return (
            <Menu>
                <Menu.Item
                    className={styles.menuItem}>
                    <Link to={`/top`} onClick={() => {
                        window.scroll({
                            top: 0,
                            behavior: "smooth"
                        })
                    }}>Top</Link>
                </Menu.Item>
                {menuList.map((menu) => (
                    <Menu.Item
                        className={styles.menuItem}>
                        <HashLink to={`/top#${menu.id}`} smooth>{menu.name}</HashLink>
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
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button
                        icon={<MenuOutlined />}
                        size='large'
                        style={{
                            backgroundColor: 'transparent',
                            color: 'white',
                            borderColor: 'transparent'
                        }} />
                </Dropdown>
                <Button
                    icon={<GithubOutlined />}
                    size='large'
                    style={rightButtonStyle}
                    onClick={() => { window.open('https://github.com/yuki-oshima-revenant/matsuri_official_site'); }} />
                <Button
                    size='large'
                    style={rightButtonStyle}
                    onClick={() => { setIsMuted(!isMuted) }}>
                    {isMuted ? 'sound on' : 'sound off'}
                </Button>
            </Header>
            <Content className="site-layout" style={{ minHeight: '100vh', backgroundColor: 'black' }}>
                {children}
            </Content>
            <Footer style={{ textAlign: 'center', backgroundColor: 'black', color: 'white' }}>©︎2020 Yuki Oshima</Footer>
            <iframe
                allow="autoplay"
                className={styles.bgm}
                title="bgm"
                src={isMuted ? 'about:blank' : `${process.env.PUBLIC_URL}/identity.mp3`}
            >
                {/* <audio className="midi" autoPlay loop>
                    <source src={isMuted ? 'about:blank' : `${process.env.PUBLIC_URL}/identity.mp3`} />
                </audio> */}
            </iframe>
        </Layout>
    );
};

export default Index;
