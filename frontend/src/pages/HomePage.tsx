import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'; // Ví dụ dùng React Bootstrap

const HomePage = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <h1 className="mt-4">Trang Chủ VolunHub</h1>
                    <p>Nội dung danh sách sự kiện sẽ được hiển thị ở đây.</p>
                    {/* TODO: Implement event list fetching and display */}
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;