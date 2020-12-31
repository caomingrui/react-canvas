import React, {useState, useEffect, useReducer, useContext, memo, useRef} from 'react';
import styled from 'styled-components';
import { Button, Upload, Modal } from 'antd';
import Test from './asstet/a.jpg';
import { PlusOutlined } from '@ant-design/icons';
import PictrueOperate from './picModule/PicOperate';
import { PicRoute } from './src/contStart'

const HomePic = styled.div`
  width: calc(100% - 40px);
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
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

    >.viewImg {
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

export default memo((props) => {
    const [picState, setPicState] = useState();
    const pic = useRef(null);
    const [putPic, setPutSrc] = useState();
    const [bjPic, setBjSrc] = useState();
    const [boolValue, setBoolValue] = useState(false);

    const test = () => {
        console.log(pic);
        console.log(document.getElementById(props.uid + 'pic'))
        setPicState(document.getElementById(props.uid + 'pic'));
    }

    useEffect(() => {
        console.log("图片组件挂载完成之后执行:")
        setPicState(document.getElementById(props.uid + 'pic'));

    },[])

    const bigPic = async (pic) => {
        let file = await getBase64(pic);
        console.log(file)
        return file
    }

    // useEffect(() => {
    //     if(boolValue) {
    //         console.log("图片组件初始化了:")
    //         setBoolValue(false);
    //         console.log(props.pic)
    //         props.pic.then(res => {
    //             setPutSrc(res);
    //
    //         })
    //     }
    //     setBoolValue(true);
    // })

    useEffect(() => {
        console.log("组件挂载完成之后执行:")
        props.pic.then(res => {
            setPutSrc(res);

        })
    },[])

    const changePic = (e) => {
        console.log(e)
        setPicState(document.getElementById(props.uid + 'pic'));
        setPutSrc(e);
    }

    return (
        <PicRoute.Provider value={[picState, putPic, setBjSrc, props.uid]}>
            {/*<PicturesWall changePic={changePic}></PicturesWall>*/}
            <HomePic>
                <div className="PictrueCont" onClick={() => {test()}}>
                    <img src={putPic} alt="test" id={props.uid + 'bigPic'} style={{position: 'absolute', display: 'none'}}/>
                    <img src={putPic} alt="test" className="viewImg" ref={pic} id={props.uid + 'pic'}/>
                    <div>
                        <img src={bjPic} alt=""/>
                        <canvas id={props.uid}></canvas>
                    </div>
                </div>
                <PictrueOperate></PictrueOperate>
            </HomePic>
        </PicRoute.Provider>
    );
});


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
         let file = await getBase64(fileList[0].originFileObj);
        this.props.changePic(file);
        return this.setState({ fileList });
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
