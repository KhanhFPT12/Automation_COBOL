
import { type ChangeEvent, useState, type KeyboardEvent } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import httpConfig from '../../config/httpConfig';

import { GridItem } from '../../components/GridSystem';
import Input from '../../components/Input';


export default function WORD() {


    type formInput = {
        option: string,
id_cli: string,

    }

    type formOutput = {
        id_crd: string,
shop_crd: string,
name_shp: string,
id_cli: string,

    }
    
    const [formData, setFormData] = useState<formInput>(
    {
        option: '',
id_cli: '',

    });
    const [receivedData, setReceivedData] = useState<formOutput>(
     {
        id_crd: '',
shop_crd: '',
name_shp: '',
id_cli: '',

    });

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((state) => {
        return {
        ...state,
        [event.target.name]: event.target.value,
        };
    });
    };

    const handleSubmit = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        for (const key in formData) {
        if (!formData[key as keyof typeof formData]) {
            return;
        }
        }

        const response = await axios.post(
        httpConfig.domain + '/Word',
        formData
        );

        setReceivedData(_state => response.data);
    }
    };
    
  return (
    <>
    <Helmet>
        <title>WORD</title>
    </Helmet>
     
        <GridItem col={2} row={22}>
            <label >
                _______________________________________________________________________________
            </label>
        </GridItem>
            
        <GridItem col={6} row={23}>
            <label >
                F3=Exit
            </label>
        </GridItem>
            
        <GridItem col={27} row={1}>
            <label >
                List of Cards by Client
            </label>
        </GridItem>
            
        <GridItem col={5} row={9}>
            <Input maxLength={1} id='option' name='option' value={formData.option } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={12} row={9}>
            <label id='id_crd'>
                {receivedData.id_crd }
            </label>
        </GridItem>
            
        <GridItem col={27} row={9}>
            <label id='shop_crd'>
                {receivedData.shop_crd }
            </label>
        </GridItem>
            
        <GridItem col={42} row={9}>
            <label id='name_shp'>
                {receivedData.name_shp }
            </label>
        </GridItem>
            
        <GridItem col={8} row={4}>
            <label >
                Client Nr.
            </label>
        </GridItem>
            
        <GridItem col={19} row={4}>
            <Input  id='id_cli' name='id_cli' value={formData.id_cli } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={4} row={6}>
            <label >
                Op.
            </label>
        </GridItem>
            
        <GridItem col={12} row={6}>
            <label >
                Card Nr.
            </label>
        </GridItem>
            
        <GridItem col={27} row={6}>
            <label >
                Shop Nr.
            </label>
        </GridItem>
            
        <GridItem col={42} row={6}>
            <label >
                Shop Name
            </label>
        </GridItem>
            
        <GridItem col={2} row={7}>
            <label >
                _______________________________________________________________________________
            </label>
        </GridItem>
            
    </>
  );
}
    