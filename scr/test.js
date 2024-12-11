import { useEffect, useState, useRef } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, Select, message, Row, Col } from "antd";
import MainPage from "../component/page/MainPage";
import "../component/assets/css/TextEditor.css";

const UserPage = () => {
    const [list, setList] = useState([]);
    const [role, setRole] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formCat] = Form.useForm();
    const [formPassword] = Form.useForm();

    useEffect(() => {
        getList();
        formCat.setFieldsValue({ Status: "1" });
    }, []);

    const filterRef = useRef({ txt_search: null, status: null });

    const getList = async () => {
        setLoading(true);
        const param = {
            txt_search: filterRef.current.txt_search,
            status: filterRef.current.status,
        };
        const res = await request("user/getlist", "get", param);
        setLoading(false);
        if (res) {
            setList(res.list);
            setRole(res.role);
        }
    };

    const onClickBtnEdit = (item) => {
        formCat.setFieldsValue({
            id: item.id,
            RoleId: item.RoleId,
            firstName: item.firstName,
            middleName: item.middleName,
            lastName: item.lastName,
            mobile: item.mobile,
            email: item.email,
            intro: item.intro,
            profile: item.profile,
        });
        setOpen(true);
    };

    const onClickBtnDelete = (item) => {
        Modal.confirm({
            title: "Delete",
            content: "Are you sure you want to delete?",
            okText: "Yes",
            cancelText: "No",
            okType: "danger",
            centered: true,
            onOk: async () => {
                const data = { id: item.id };
                const res = await request("user/delete", "delete", data);
                if (res) {
                    message.success(res.message);
                    getList();
                }
            },
        });
    };

    const onClickBtnSetPassword = (item) => {
        setSelectedUser(item);
        formPassword.resetFields();
        setPasswordModalOpen(true);
    };

    const onFinish = async (item) => {
        const id = formCat.getFieldValue("id");
        const data = {
            id: id,
            RoleId: item.RoleId,
            firstName: item.firstName,
            middleName: item.middleName,
            lastName: item.lastName,
            mobile: item.mobile,
            email: item.email,
            intro: item.intro,
            profile: item.profile,
            Password: item.Password,
        };
        const method = id == null ? "post" : "put";
        const url = id == null ? "user/create" : "user/update";
        const res = await request(url, method, data);
        if (res) {
            message.success(res.message);
            getList();
            onCloseModule();
        }
    };

    const onFinishPassword = async (values) => {
        const data = {
            mobile: selectedUser.mobile,
            Password: values.Password,
            ConfirmPassword: values.ConfirmPassword,
        };
        const res = await request("user/setpassword", "post", data);
        if (res) {
            message.success(res.message);
            setPasswordModalOpen(false);
        }
    };

    const onChangeSearch = (e) => {
        filterRef.current.txt_search = e.target.value;
        getList();
    };

    const onChangeStatus = (value) => {
        filterRef.current.status = value;
        getList();
    };

    const onCloseModule = () => {
        formCat.resetFields();
        setOpen(false);
    };

    return (
        <MainPage loading={loading}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                    <div className="txt_title">User</div>
                    <Input.Search allowClear onChange={onChangeSearch} placeholder="Search name" />
                </Space>
                <Button onClick={() => setOpen(true)} type="primary">New</Button>
            </div>
            <hr />
            <Table
                dataSource={list}
                pagination={{ pageSize: 7 }}
                columns={[
                    {
                        key: "No",
                        title: "No",
                        render: (value, item, index) => index + 1,
                    },
                    {
                        key: "mobile",
                        title: "Username",
                        dataIndex: "mobile",
                    },
                    {
                        key: "email",
                        title: "Email",
                        dataIndex: "email",
                    },
                    {
                        key: "RoleId",
                        title: "Permission",
                        dataIndex: "RoleId",
                        render: (RoleId) => role.find(r => r.id === RoleId)?.name || 'Unknown',
                    },
                    {
                        key: "Action",
                        title: "Action",
                        render: (value, item) => (
                            <Space>
                                <Button onClick={() => onClickBtnEdit(item)} type="primary">Edit</Button>
                                <Button onClick={() => onClickBtnDelete(item)} type="primary" danger>Delete</Button>
                                <Button onClick={() => onClickBtnSetPassword(item)} type="primary">Set Password</Button>
                            </Space>
                        ),
                    },
                ]}
            />
            <Modal
                title={formCat.getFieldValue("id") == null ? "New User" : "Update User"}
                open={open}
                onCancel={onCloseModule}
                footer={null}
                maskClosable={false}
            >
                <Form form={formCat} layout="vertical" onFinish={onFinish}>
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item
                                label="Username"
                                name="mobile"
                                rules={[{ required: true, message: "Please input username!" }]}
                            >
                                <Input style={{ width: "100%" }} placeholder="Username" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: "Please input email!" }]}
                            >
                                <Input style={{ width: "100%" }} placeholder="Email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="First Name"
                                name="firstName"
                                rules={[{ required: true, message: "Please input first name!" }]}
                            >
                                <Input style={{ width: "100%" }} placeholder="First Name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Middle Name"
                                name="middleName"
                            >
                                <Input style={{ width: "100%" }} placeholder="Middle Name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Last Name"
                                name="lastName"
                                rules={[{ required: true, message: "Please input last name!" }]}
                            >
                                <Input style={{ width: "100%" }} placeholder="Last Name" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Permission"
                                name="RoleId"
                                rules={[{ required: true, message: "Please select permission!" }]}
                            >
                                <Select placeholder="Please select role">
                                    {role.map((item) => (
                                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Intro"
                                name="intro"
                            >
                                <Input style={{ width: "100%" }} placeholder="Intro" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Profile"
                                name="profile"
                            >
                                <Input style={{ width: "100%" }} placeholder="Profile" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item style={{ textAlign: "right" }}>
                        <Space>
                            <Button onClick={onCloseModule}>Cancel</Button>
                            <Button type="primary" htmlType="submit">
                                {formCat.getFieldValue("id") == null ? "Save" : "Update"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Set Password"
                open={passwordModalOpen}
                onCancel={() => setPasswordModalOpen(false)}
                footer={null}
                maskClosable={false}
            >
                <Form form={formPassword} layout="vertical" onFinish={onFinishPassword}>
                    <Row gutter={5}>
                        <Col span={24}>
                            <Form.Item
                                label="Password"
                                name="Password"
                                rules={[{ required: true, message: "Please input password!" }]}
                            >
                                <Input.Password style={{ width: "100%" }} placeholder="Password" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Confirm Password"
                                name="ConfirmPassword"
                                dependencies={['Password']}
                                rules={[
                                    { required: true, message: "Please confirm password!" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('Password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The two passwords do not match!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password style={{ width: "100%" }} placeholder="Confirm Password" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item style={{ textAlign: "right" }}>
                        <Space>
                            <Button onClick={() => setPasswordModalOpen(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Set Password</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </MainPage>
    );
};

export default UserPage;
