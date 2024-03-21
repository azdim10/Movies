import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd'
const Loader = (
    <LoadingOutlined 
    style = {{
        fontSize : 100,
    }}
    spin
    />
)
const Loading = () => <Spin indicator = {Loader}/>
export default Loading