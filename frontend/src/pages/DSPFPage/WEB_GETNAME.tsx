
import { type ChangeEvent, useState, type KeyboardEvent } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import httpConfig from '../../config/httpConfig';

import { GridItem } from '../../components/GridSystem';
import Input from '../../components/Input';


export default function WEB_GETNAME() {


    type formInput = {
        name: string,

    }

    
    const [formData, setFormData] = useState<formInput>(
    {
        name: '',

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

        await axios.post(
        httpConfig.domain + '/Web_getname',
        formData
        );

    }
    };
    
  return (
    <>
    <Helmet>
        <title>WEB_GETNAME</title>
    </Helmet>
     
        <GridItem col={5} row={5}>
            <label >
                What is your name?
            </label>
        </GridItem>
            
        <GridItem col={25} row={5}>
            <Input maxLength={25} id='name' name='name' value={formData.name } onChange={handleInputChange} onKeyDown={handleSubmit}/>
        </GridItem>
            
    </>
  );
}
    