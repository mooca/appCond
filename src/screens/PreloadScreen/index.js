import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import C from './style';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useStateValue } from '../../contexts/StateContext';
import api from '../../services/api';

export default () => {
    const navigation = useNavigation();
    const [context, dispatch] = useStateValue();

    useEffect(()=>{
        const checkLogin = async () => {
            //   AsyncStorage.removeItem('token');

            let token = await api.getToken();
            // console.log('token:');
            // console.log(token);
            if(token) {
                let result = await api.validateToken();
                if(result.error === '') {
                    dispatch({
                        type: 'setUser',
                        payload: {
                            user: result.user
                        }
                    });
                    navigation.reset({
                        index: 1,
                        routes:[{name: 'ChoosePropertyScreen'}]
                    });
                } else {
                    alert(result.error);
                    dispatch({type:'setToken', payload: {token: ''}});
                    navigation.reset({
                        index: 1,
                        routes:[{name: 'LoginScreen'}]
                    });
                }
            } else {
                navigation.reset({
                    index: 1,
                    routes:[{name: 'LoginScreen'}]
                });
            }
        }

        checkLogin();
    }, []);

    return (
        <C.Container>
            <C.LoadingIcon color="#8863E6" size="large" />
        </C.Container>
    );
}