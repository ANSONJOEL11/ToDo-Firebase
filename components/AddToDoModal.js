import { View, Text, TextInput, Button,TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import React, { useState }  from 'react';
import AppStyles from '../styles/AppStyles';
import * as SMS from 'expo-sms';
import * as MailComposer from 'expo-mail-composer';
import { Accelerometer } from 'expo-sensors';
import * as Clipboard from 'expo-clipboard';
import { StatusBar } from 'expo-status-bar';


export default function AddToDoModal(props) {

  

  [accelerometerData, setAccelerometerData] = useState({});
  [listener, setListener] = useState();

  let [todo, setTodo] = React.useState("");



  startAccelerometerWatch = () => {
    setListener(
      Accelerometer.addListener(data => {
        setAccelerometerData(data);
       // Clipboard.setString(data);
      })
    );  

    Accelerometer.setUpdateInterval(100);
  }

  stopAccelerometerWatch = () => {
    listener.remove();
    // Accelerometer.removeAllListeners(); 
    setAccelerometerData({});
  }

  round = (n) => {
    if (!n) {
      return 0.00;
    }
  
    return (Math.floor(n * 100) / 100).toFixed(2);
  }

  sendMessageWithSMS = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync(
        ['3213213214', '1231231234'],
        todo
      );
      console.log(result);
    } else {
      console.log("SMS is not available on this device");
    }
  }

  sendMessageWithEmail = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();

    if(isAvailable) {
      var options = {
        
        recipients: ['matthewtanner91@gmail.com'],
        
        subject: "Your Subject",
        
        body: todo
        
      };

      MailComposer.composeAsync(options).then((result) => { console.log(result.status); });
    } else {
      console.log("Email is not available on this device");
    }
  }
  return (

    <View style={AppStyles.container}>
      <StatusBar style="light" />
      <Text style={AppStyles.header}>Add ToDo</Text>
      <Text >
        x: {round(accelerometerData.x)}
      </Text>
      <Text >
        y: {round(accelerometerData.y)} 
      </Text>
      <Text >
        z: {round(accelerometerData.z)}
      </Text>
      <TextInput 
          style={[AppStyles.textInput, AppStyles.darkTextInput]} 
          placeholder='ToDo'
          value={todo}
          onChangeText={setTodo} />
      <View style={[AppStyles.rowContainer, AppStyles.rightAligned, AppStyles.rightMargin]}>

      <Button title="Get free-fall data" onPress={startAccelerometerWatch} />
        <Button title="Cancel" onPress={props.onClose} />
        <TouchableOpacity onPress={sendMessageWithSMS}>
                            <Feather name="send" size={24} color="black" style={{paddingRight:15, paddingLeft:15}}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={sendMessageWithEmail}>
                            <Feather name="mail" size={24} color="black" style={{paddingRight:15}}/>
                        </TouchableOpacity>
        <Button title="OK" onPress={() => {
          props.addToDo(todo);
          setTodo("");
          props.onClose();

          Alert.alert('Alert', 'Your Todo is added', [
            
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ]);

        }} />
      </View>
    </View>
  );
}