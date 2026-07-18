
import { type ChangeEvent, useState, type KeyboardEvent } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import httpConfig from '../../config/httpConfig';

import { GridItem } from '../../components/GridSystem';
import Input from '../../components/Input';

export default function BNK1CDM() {
    
    type formInput = {
        accno: string,
sign: string,
amt: string,

    }

    type formOutput = {
        bnk1cdm: string,
bnk1cd: string,
company: string,
sortc: string,
avbal: string,
actbal: string,
message: string,
dummy: string,

    }
    
    const [formData, setFormData] = useState<formInput>(
    {
        accno: '',
sign: '',
amt: '',

    });
    const [receivedData, setReceivedData] = useState<formOutput>(
     {
        bnk1cdm: '',
bnk1cd: '',
company: 'CICS Banking Sample Application - Credit/Debit Funds.',
sortc: '      ',
avbal: '',
actbal: '',
message: '',
dummy: '',

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
        httpConfig.domain + '/Bnk1cdm',
        formData
        );

        setReceivedData(_state => response.data);
    }
    };
    
  return (
    <>
     
    <Helmet>
        <title>BNK1CDM</title>
    </Helmet>
    
<GridItem col={1} row={1}>
    <label style={{color:"blue"}}>
         BNK1CD  
    </label>
</GridItem>

    
<GridItem col={15} row={1}>
    <label style={{color:"red"}}>
         {receivedData.company } 
    </label>
</GridItem>

    
<GridItem col={1} row={3}>
    <label style={{color:"turquoise"}}>
         Provide an ACCOUNT number and an AMOUNT and then press Enter. 
    </label>
</GridItem>

    
<GridItem col={1} row={8}>
    <label style={{color:"turquoise"}}>
         ACCOUNT NUMBER: 
    </label>
</GridItem>

    
<GridItem col={17} row={8}>
    <Input maxLength={8} name='accno' id='accno' type='number' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={26} row={8}>
    <label style={{color:"turquoise"}}>
         AMOUNT: 
    </label>
</GridItem>

    
<GridItem col={35} row={8}>
    <Input maxLength={1} name='sign' id='sign' type='text' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={37} row={8}>
    <Input maxLength={13} name='amt' id='amt' type='text' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={51} row={8}>
    <label style={{color:"green"}}>
           
    </label>
</GridItem>

    
<GridItem col={1} row={10}>
    <label style={{color:"turquoise"}}>
         Sort Code:  
    </label>
</GridItem>

    
<GridItem col={21} row={10}>
    <label style={{color:"neutral"}}>
         {receivedData.sortc } 
    </label>
</GridItem>

    
<GridItem col={1} row={11}>
    <label style={{color:"turquoise"}}>
         Available Balance: 
    </label>
</GridItem>

    
<GridItem col={20} row={11}>
    <label style={{color:"neutral"}}>
         {receivedData.avbal } 
    </label>
</GridItem>

    
<GridItem col={1} row={12}>
    <label style={{color:"turquoise"}}>
         Actual Balance: 
    </label>
</GridItem>

    
<GridItem col={20} row={12}>
    <label style={{color:"neutral"}}>
         {receivedData.actbal } 
    </label>
</GridItem>

    
<GridItem col={1} row={23}>
    <label style={{color:"yellow"}}>
         {receivedData.message } 
    </label>
</GridItem>

    
<GridItem col={1} row={24}>
    <label style={{color:"blue"}}>
         F3=Exit   F12=Cancel 
    </label>
</GridItem>

    
<GridItem col={79} row={24}>
    <label >
         {receivedData.dummy } 
    </label>
</GridItem>

    
    </>
  );
}
    