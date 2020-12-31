// 操作图片块
import styled from "styled-components";
import {Button, Slider, InputNumber, Row, Col, Upload, message} from "antd";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, {useState, useEffect, useReducer, useContext, memo} from 'react';
import { PicRoute } from '../src/contStart';
import ColorThief from "../src/colorThief";
import { rgbToHsl, changePic, HexToRgb, hslToRgb} from "../src/tools"

const OperationPanel = styled.div`
      width: 360px;
      padding: 20px;
      border-radius: 10px;
      background: #ffffff;
      box-shadow:  3px 3px 7px #d9d9d9,
        -3px -3px 7px #ffffff;
      text-align: center;
  
        >.operBut {
          width: 100%;
          display: flex;
          justify-content: space-around;
        }
`;

export default memo((props) => {
    const [picState, pic, setPutSrc, uid] = useContext(PicRoute);
    const [color, setColor] = useState('#000000'); // 当前选中 颜色
    const [progress, setProgress] = useState([1,2]); // 滚动条 亮度 饱和度值
    const [scopeData, setScopeData] = useState(0.018); // 改色范围
    const [lineBut, setLineBut] = useState(true);// 按钮选中
    const [boolValue, setBoolValue] = useState(false);

    const [A, setA] = useState({A: [1]});

    const test = () => {
        console.log(picState)
        subminBut()
    }

    const subminBut = (opacity = 1) => {
        const colorThief = new ColorThief()
        console.log(picState)
        console.log(colorThief.getColor(picState, 1))
        const [r, g, b] = colorThief.getColor(picState, 1);
        let da = rgbToHsl(r, g, b)[0];
        let arr1 = da.toFixed(2) - scopeData;
        let arr2 = Number(da.toFixed(2)) + scopeData;
        let [hslR, hslG, hslB] = rgbToHsl(color[0], color[1], color[2])
        // hslG += progress[0];
        // hslB += progress[1];
        console.log(progress[0])
        changePic(picState, pic, [arr1, arr2], hslToRgb(hslR, hslG, hslB), opacity, progress[0], uid)
        // console.log(rgbToHsl(r, g, b));
    }

    useEffect(() => {
        if(boolValue) {
            console.log("依赖更新了呀")
            setBoolValue(false);

            if (picState.src.length>100) {
                let [hslR, hslG, hslB] = rgbToHsl(color[0], color[1], color[2])

                setTimeout(() => {
                    const colorThief = new ColorThief()
                    console.log(colorThief.getColor(picState, 1))
                    const [r, g, b] = colorThief.getColor(picState, 1);
                    let da = rgbToHsl(r, g, b)[0];
                    let arr1 = da.toFixed(2) - scopeData;
                    let arr2 = Number(da.toFixed(2)) + scopeData;
                    changePic(picState, pic, [arr1, arr2], hslToRgb(hslR, hslG, hslB), 0, 1, uid)
                }, 1000)
            }
            else {
                console.log('123123123123')
                setA('')
                setTimeout(() => {
                    setA({A: [345]})
                }, 1100)
            }
        }
        setBoolValue(true);
    },[picState, A])

    const changeScope = (e) => {
        let arr = e;
        setScopeData(arr);
        subminBut(0);
    }

    const changeStep1 = (e) => {
        console.log(e);
        let arr = [...progress];
        arr[0] = e;
        setProgress(arr);
        subminBut(0)
    }

    const changeStep2 = (e) => {
        console.log(e);
        let arr = [...progress];
        arr[1] = e;
        setProgress(arr);
        subminBut(0)
    }

    const getPic = (src) => {
        console.log(src);
        setPutSrc(src);
        subminBut(0)
    }

    return (
        <OperationPanel>
            <p>操作面板</p>
            <div className="operBut">
                <Button type={lineBut?"primary": ""} onClick={() => {setLineBut(true)}}>改色</Button>
                <Button type={!lineBut?"primary": ""} onClick={() => {setLineBut(false)}}>改背景</Button>
            </div>
            <div style={lineBut?{display: 'block'}: {display: 'none'}}>
                <input type="color" onChange={(e)=> {
                    setColor(HexToRgb(e.target.value, true))}}/>
                <p>修改范围</p>
                <DecimalStep num={changeScope} data={[0, 0.03]} step={0.001}></DecimalStep>
                <p>亮度</p>
                <DecimalStep num={changeStep1} data={[1, 100]} step={1}></DecimalStep>
                <p>饱和度</p>
                <DecimalStep num={changeStep2} data={[0, 1]} step={0.1}></DecimalStep>
            </div>
            <div style={!lineBut?{display: 'block'}: {display: 'none'}}>
                <Avatar getPic={getPic}></Avatar>
            </div>
        </OperationPanel>
    );
});

// 滑动条
class DecimalStep extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        inputValue: 0,
    };

    onChange = value => {
        if (isNaN(value)) {
            return;
        }
        this.props.num(value)
        this.setState({
            inputValue: value,
        });

    };

    render() {
        const { inputValue } = this.state;
        return (
            <Row>
                <Col span={12}>
                    <Slider
                        min={this.props.data[0]}
                        max={this.props.data[1]}
                        onChange={this.onChange}
                        value={typeof inputValue === 'number' ? inputValue : 0}
                        step={this.props.step}
                    />
                </Col>
                <Col span={4}>
                    <InputNumber
                        min={this.props.data[0]}
                        max={this.props.data[1]}
                        style={{ margin: '0 16px' }}
                        step={this.props.step}
                        value={inputValue}
                        onChange={this.onChange}
                    />
                </Col>
            </Row>
        );
    }
}

// 图片上传
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

class Avatar extends React.Component {
    state = {
        loading: false,
    };

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => {
                    this.setState({
                        imageUrl,
                        loading: false,
                    })
                    this.props.getPic(imageUrl)
                }
            );
        }
    };

    render() {
        const { loading, imageUrl } = this.state;
        const uploadButton = (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
            >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
        );
    }
}
