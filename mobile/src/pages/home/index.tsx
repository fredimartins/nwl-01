import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, Image, StyleSheet, Text, ImageBackground, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import Axios from 'axios';

interface UF {
    sigla: string,
}

interface CITY {
    nome: string,
}

interface pickerItem {
    label: string,
    value: string
}

const Home = () => {
    const navigation = useNavigation();
    const [selectedUf, setSelectedUf] = useState('')
    const [selectedCity, setSelectedCity] = useState('')
    const [ufs, setUfs] = useState<pickerItem[]>([]);
    const [cities, setCities] = useState<pickerItem[]>([]);

    function handleNavigateTo(screen: string) {
        navigation.navigate(screen, { uf: selectedUf, city: selectedCity });
    }

    useEffect(() => {
        Axios.get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            let ufPicker: pickerItem[] = [];
            ufInitials.map(uf => {
                ufPicker.push({ label: uf, value: uf })
            })
            setUfs(ufPicker);
        })
    }, [])

    useEffect(() => {
        Axios.get<CITY[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cities = response.data.map(city => city.nome);
            let citiesPicker: pickerItem[] = [];
            cities.map(city => {
                citiesPicker.push({ label: city, value: city })
            })
            setCities(citiesPicker);
        })
    }, [selectedUf])

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? "padding" : undefined}>
            <ImageBackground
                source={require('../../assets/home-background.png')}
                style={styles.container}
                imageStyle={{ width: 274, height: 368 }}
            >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />
                    <View>
                        <Text style={styles.title}>Seu Marktplace de coleta de residuos</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <RNPickerSelect
                        style={styles}
                        onValueChange={setSelectedUf}
                        items={ufs}
                        placeholder={{ label: "Selecione a UF" }}
                    />
                    <RNPickerSelect
                        style={styles}
                        onValueChange={setSelectedCity}
                        items={cities}
                        placeholder={{ label: "Selecione a Cidade" }
                        }
                    />

                    <RectButton style={styles.button} onPress={() => handleNavigateTo('Points')}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon name="arrow-right" color="#FFF" size={24} />
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>
                            Entrar
                </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    select: {},

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    },
    inputIOS: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
      },
      inputAndroid: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
      },
});

export default Home;