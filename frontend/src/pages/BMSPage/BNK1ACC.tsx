
import { type ChangeEvent, useState, type KeyboardEvent } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import httpConfig from '../../config/httpConfig';

import { GridItem } from '../../components/GridSystem';
import Input from '../../components/Input';

export default function BNK1ACC() {
    
    type formInput = {
        custno: string,

    }

    type formOutput = {
        bnk1acc: string,
company: string,
account: string,
message: string,
dummy: string,

    }
    
    const [formData, setFormData] = useState<formInput>(
    {
        custno: '',

    });
    const [receivedData, setReceivedData] = useState<formOutput>(
     {
        bnk1acc: '',
company: 'CICS Banking Sample Application - Accounts for Customers.',
account: '',
message: '',
dummy: ' ',

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
        httpConfig.domain + '/Bnk1acc',
        formData
        );

        setReceivedData(_state => response.data);
    }
    };
    
  return (
    <>
     
    <Helmet>
        <title>BNK1ACC</title>
    </Helmet>
    
<GridItem col={1} row={1}>
    <label style={{color: "blue"}}>
         {"BNK1ACC"}
    </label>
</GridItem>

    
<GridItem col={14} row={1}>
    <label style={{color: "red"}}>
         {receivedData.company }
    </label>
</GridItem>

    
<GridItem col={1} row={3}>
    <label style={{color: "turquoise"}}>
         {"Provide a Customer number. Then press Enter."}
    </label>
</GridItem>

    
<GridItem col={1} row={5}>
    <label style={{color: "turquoise"}}>
         {"CUSTOMER NUMBER"}
    </label>
</GridItem>

    
<GridItem col={17} row={5}>
    <Input maxLength={10} name='custno' id='custno' type='number' styles={{color: "green", textDecoration: "underline"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={28} row={5}>
    <label >
         {""}
    </label>
</GridItem>

    
<GridItem col={1} row={8}>
    <label style={{color: "inherit"}}>
         {"SORT CODE   ACCOUNT NUMBER   ACCOUNT TYPE"}
    </label>
</GridItem>

    
<GridItem col={43} row={8}>
    <label style={{color: "inherit"}}>
         {"   AVAIL BALANCE   ACTUAL BALANCE"}
    </label>
</GridItem>

    
<GridItem col={1} row={9}>
    <label style={{color: "inherit"}}>
         {receivedData.account }
    </label>
</GridItem>

<GridItem col={1} row={10}>
    <label> {receivedData.account } </label>
</GridItem>

<GridItem col={1} row={11}>
    <label> {receivedData.account } </label>
</GridItem>

<GridItem col={1} row={12}>
    <label> {receivedData.account } </label>
</GridItem>

<GridItem col={1} row={13}>
    <label> {receivedData.account } </label>
</GridItem>

<GridItem col={1} row={14}>
    <label> {receivedData.account } </label>
</GridItem>

<GridItem col={1} row={15}>
    <label> {receivedData.account } </label>
</GridItem>

<GridItem col={1} row={16}>
    <label> {receivedData.account } </label>
</GridItem>

<GridItem col={1} row={17}>
    <label> {receivedData.account } </label>
</GridItem>

<GridItem col={1} row={18}>
    <label> {receivedData.account } </label>
</GridItem>

<GridItem col={1} row={19}>
    <label> {receivedData.account } </label>
</GridItem>

    
<GridItem col={1} row={23}>
    <label style={{color: "yellow", fontWeight: "bold"}}>
         {receivedData.message }
    </label>
</GridItem>

    
<GridItem col={1} row={24}>
    <label style={{color: "blue"}}>
         {"F3=Exit   F12=Cancel"}
    </label>
</GridItem>

    
<GridItem col={79} row={24}>
    <label style={{visibility: "hidden"}}>
         {receivedData.dummy }
    </label>
</GridItem>

    
    </>
  );
}
    