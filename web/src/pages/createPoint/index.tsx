import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet'

import Modal from '../../components/modal';
import api from '../services/api';
import './styles.css';
import logo from '../../assets/logo.svg';
import Axios from 'axios';
import Dropzone from '../../components/dropzone';

interface ITEM {
    id: number,
    title: string,
    image_url: string
}

interface UF {
    sigla: string,
}

interface CITY {
    nome: string,
}

const CreatePoint = () => {
    const [items, setItems] = useState<ITEM[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedUF, setSelectedUF] = useState<string>("0");
    const [selectedCity, setSelectedCity] = useState<string>("0");
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([-19.947179, -43.9722806]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([-19.947179, -43.9722806]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });
    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
            setSelectedPosition([latitude, longitude]);
        })
    }, []);

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        })
    }, []);

    useEffect(() => {
        Axios.get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        })
    }, [])

    useEffect(() => {
        Axios.get<CITY[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
            const cities = response.data.map(city => city.nome);
            setCities(cities);
        })
    }, [selectedUF])

    function handleSelectUF(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUF(event.target.value)
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value)
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([event.latlng.lat, event.latlng.lng]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value })
    }

    function handleSelectItem(id: number) {
        if (selectedItems.includes(id)) {
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        } else {
            setSelectedItems([...selectedItems, id])
        }

    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const { name, email, whatsapp } = formData;
        const items = selectedItems;
        const [latitude, longitude] = selectedPosition;
        const uf = selectedUF;
        const city = selectedCity;

        const data = new FormData()
        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp)
        data.append('uf', uf)
        data.append('city', city)
        data.append('latitude', String(latitude))
        data.append('longitude', String(longitude))
        data.append('items', items.join(','))
        if (selectedFile)
            data.append('image', selectedFile)

        await api.post('points', data).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                alert("Cadastrado com sucesso")
            } else {
                alert(`${response.status} - ${response.statusText}`)
            }

            history.push('/');
        });
    }

    return (
        <div id="page-create-point">
            <Modal show={true} />
            <header>
                <img src={logo} alt="eColeta" />
                <Link to="/"><FiArrowLeft />Voltar para Home</Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do Ponto de Coleta</h1>

                <Dropzone onFileUpload={setSelectedFile} />

                <fieldset>
                    <legend><h2>Dados</h2></legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name="name" id="name" onChange={handleInputChange} />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">e-mail</label>
                            <input type="email" name="email" id="email" onChange={handleInputChange} />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange} />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="whatsapp">Estado(UF)</label>
                            <select name="uf" id="uf" onChange={handleSelectUF}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => {
                                    return <option value={uf} key={uf}>{uf}</option>
                                })}
                            </select>

                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" onChange={handleSelectCity}>
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map(city => {
                                    return <option value={city} key={city}>{city}</option>
                                })}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {
                            items.map(item => {
                                return (
                                    <li key={item.id}
                                        onClick={() => handleSelectItem(item.id)}
                                        className={selectedItems.includes(item.id) ? 'selected' : ''}>
                                        <img src={item.image_url} alt={item.title} />
                                        <span>{item.title}</span>
                                    </li>
                                )
                            })
                        }

                    </ul>
                </fieldset>
                <button type="submit">Cadastrar Ponto de Coleta</button>
            </form>
        </div>
    )
}

export default CreatePoint;