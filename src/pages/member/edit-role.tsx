import React, { useEffect, useState } from 'react';
import { Table, Switch, Button, Space, notification, Form } from 'antd';
import { getUserRoles, updateRolePermission } from '@/api/player.api';
import { Permission, Role } from '@/interface/player/player.interface';
import { useParams } from 'react-router-dom';
import { render } from 'react-dom';

const EditRolePage: React.FC = () => {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const token: string = localStorage.getItem('token') || '';
    const {admin_id} = useParams()

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        setLoading(true);
        const {status, result} = await getUserRoles(token, {admin_id}); // Make sure getUserRoles handles API correctly.
        if (status && result) {
            setPermissions(result.permissions);
        } else {
            notification.error({
                message: 'Fetch Failed',
                description: 'Unable to fetch roles data.',
            });
        }
        setLoading(false);
    };

    const handleRoleChange = async (id: string, permId: string, checked: boolean) => {
        const { status, result } = await updateRolePermission(token, {admin_id, permId, access: checked });
        if (status) {
            notification.success({
                message: 'Update Successful',
                description: 'Role permissions updated successfully.',
            });
            // Optimistically update the UI without refetching the entire list
            const updatedPermissions = permissions.map((permission: Permission) => {
                
                if (permission._id === permId) {
                    console.log(permission._id, permId)
                    return {
                        ...permission,
                        access: (permission._id === permId ? checked : permission.access)
                    };
                }
                return permission;
            });

            console.log('-------------', updatedPermissions)
            setPermissions(updatedPermissions)
        } else {
            notification.error({
                message: 'Update Failed',
                description: 'Failed to update role permissions.',
            });
        }
    };

    const columns = [
        {
            title: 'Url',
            key: 'url',
            render: (_: undefined, permission: Permission) => ( 
                permission.url.url
            )
        },
        {
            title: 'Permissions',
            key: 'permissions',
            render: (_: undefined, permission: Permission) => (
                <Space>
                    
                    <Form.Item key={permission._id}>
                        <Switch
                            checked={permission.access}
                            onChange={(checked) => handleRoleChange(permission._id, permission._id, checked)}
                        />
                    </Form.Item>
                  
                </Space>
            ),
        },
    ];

    return (
        <Table columns={columns} dataSource={permissions} rowKey="_id" loading={loading} />
    );
};

export default EditRolePage;
