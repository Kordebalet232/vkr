import TestingCallT from "../../types/testingCallTypes";
import { io } from 'socket.io-client';
import testingCallAC from "../actionCreators/testingCallAC";


const socket_conf: any = io('http://localhost:4000')

const socket: any = io('http://127.0.0.1:5000/test');



export const startListening_server = () => (dispatch) => {
  
    socket_conf.on('connect', () => {
      dispatch(testingCallAC.connectSocket("conference"));

      let sourcetimerId = setTimeout(function tick() {  /// Раз в установленное время отправляем новый source
        dispatch(testingCallAC.sendSourceToAll())
        sourcetimerId = setTimeout(tick, 20000)
      }, 20000)
    });
    
    socket_conf.on('disconnect', () => {
      dispatch(testingCallAC.disconnectSocket("conference"));

      console.log('Соединение с сервером закрыто');
    });

    socket_conf.on('nextKpNorm', (data) => {
      // if (data.id !== socket_conf.id){
      dispatch(testingCallAC.makePicture(data.id === socket_conf.id ? "0" : data.id, data.kp_norm))
      // }
    })


    socket_conf.on('newSourceImage', (data) => {
      dispatch(testingCallAC.sendSourceImage(data.id === socket_conf.id ? "0" : data.id, data.image))
    });
};


export const startListening = () => (dispatch) => {
    // dispatch(testingCallAC.connectSocket());
  
    socket.on('connect', () => {
      dispatch(testingCallAC.connectSocket("local"));
    });
  
    socket.on('ImageResponse', (data) => {
        console.log(data)
    });

    socket.on('kpNorm', (data) => {
        console.log(data)
        dispatch(testingCallAC.sendKpNormToAll(data))
        console.log("kp_norm_sent")
    })
  
    socket.on("ResultImage", (data) => {
        dispatch(testingCallAC.setImage(data.image, data.id))
        console.log("image settet")
    })
    
    socket.on('disconnect', () => {
      dispatch(testingCallAC.disconnectSocket("local"));
      console.log('Соединение закрыто');
    });

};


const testing_call: TestingCallT =  {
    currentImage: null,
    socket: socket,
    local_server_connection: false,
    conference_server_connection: false,
    socket_conference: socket_conf,
    screenshot: null,
    users: new Map<string, any>()
}

export default testing_call