
import { type ChangeEvent, useState, type KeyboardEvent } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import httpConfig from '../../config/httpConfig';

import { GridItem } from '../../components/GridSystem';
import Input from '../../components/Input';


export default function WEB_SHOWINFO() {


    type formInput = {
        name: string,
condition: string,

    }

    type formOutput = {
        name: string,
curtime: string,
condition: string,

    }
    
    const [formData, setFormData] = useState<formInput>(
    {
        name: '',
condition: '',

    });
    const [receivedData, setReceivedData] = useState<formOutput>(
     {
        name: '',
curtime: '',
condition: '',

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
        httpConfig.domain + '/Web_showinfo',
        formData
        );

        setReceivedData(_state => response.data);
    }
    };
    
  return (
    <>
    <Helmet>
        <title>WEB_SHOWINFO</title>
    </Helmet>
     
        <GridItem col={5} row={5}>
            <label >
                Hello 
            </label>
        </GridItem>
            
        <GridItem col={12} row={5}>
            <Input maxLength={25} id='name' name='name' value={formData.name } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={2} row={9}>
            <label id='curtime'>
                {receivedData.curtime }
            </label>
        </GridItem>
            
        <GridItem col={15} row={9}>
            <label >
                Current time
            </label>
        </GridItem>
            
        <GridItem col={2} row={10}>
            <Input maxLength={10} id='condition' name='condition' value={formData.condition } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
        <GridItem col={15} row={10}>
            <label >
                Current condition
            </label>
        </GridItem>
            
        <GridItem col={2} row={23}>
            <label >
                F3=Exit  F5=Refresh
            </label>
        </GridItem>
            
    </>
  );
}
    