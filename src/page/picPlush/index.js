import React, {useState, useEffect, useReducer, useContext, memo, useRef} from 'react';
import styled from 'styled-components';
import { Button, Upload, Modal, message } from 'antd';
import Test from './asstet/a.jpg';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import PictrueOperate from './picModule/PicOperate';
import { PicRoute } from './src/contStart'
import ProcessPic from '@/page/picture/index';
import { rgbToHsl, changePic, HexToRgb, hslToRgb} from "@/page/picture/src/tools"

const HomePic = styled.div`
  width: calc(100% - 40px);
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  >.PictrueCont {
    width: 40%;
    display: flex;
    min-width: 400px;
    max-height: 1200px;
    border-radius: 10px;
    background: #ffffff;
    box-shadow:  3px 3px 7px #d9d9d9,
      -3px -3px 7px #ffffff;
    text-align: center;
    padding: 20px 0;

    >img {
      width: 48%;
      height: auto;
      max-height: 400px;
    }
    
    >div {
      width: 48%;
      height: 400px;
      position: relative;
      
      >img, canvas {
        width: 100%;
        height: 100%;
      }
      
      >canvas {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
`;

export default memo(() => {
    const [picState, setPicState] = useState();
    const pic = useRef(null);
    const [putPic, setPutSrc] = useState(Test);

    const [pics, setPics] = useState([]);

    const test = () => {
        console.log(pic);
        console.log(document.getElementById('pic'))
        setPicState(document.getElementById('pic'));
    }

    useEffect(() => {
        console.log("图片组件挂载完成之后执行:")
        setPicState(document.getElementById('pic'));
    },[])

    const changePic = (e) => {
        console.log(e)
        setPicState(document.getElementById('pic'));
        setPics(e);
    }

    const bigPic = async (pic) => {
       let file = await getBase64(pic);
        setPicState(document.getElementById('pic'));
       return file
    }

    // 下载所以图片
    const downloadPic = () => {
        let canvas = document.querySelectorAll('canvas');
        console.log(canvas)
        var save_link = document.createElement('a');
        if ([...canvas].length != 0) {
            [...canvas].map(res => {
                // const a = document.createElement('a')
                let tempSrc = res.toDataURL("image/jpg");

                save_link.href = tempSrc;
                save_link.download ='测试.png';

                var clickevent = document.createEvent('MouseEvents');
                clickevent.initEvent('click', true, false);
                save_link.dispatchEvent(clickevent);
            });
        }
        else {
                message.error('至少操作一张图片');
        }
    }

    return (
        <>
            <PicturesWall changePic={changePic}></PicturesWall>
            <Button type="primary" onClick={downloadPic} shape="round" icon={<DownloadOutlined />} size='large'>
                Download
            </Button>
            {
                pics.map(res => {
                    return (
                        <div key={res.uid}>
                            <ProcessPic uid={res.uid}  pic={ bigPic(res.originFileObj) } ></ProcessPic>
                        </div>
                    );
                })
            }
        </>
    );
})

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class PicturesWall extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
        // this.props.changePic(file.url);
    };

    handleChange = async ({ fileList }) => {
        console.log(fileList[0])
        console.log({ fileList })
        let picArr = [];
        let file = await getBase64(fileList[0].originFileObj);
        picArr.push(file);
        this.setState({ fileList })
        this.props.changePic(this.state.fileList);
        console.log(picArr);
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    multiple={true}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}
