
import { type ChangeEvent, useState, type KeyboardEvent } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import httpConfig from '../../config/httpConfig';

import { GridItem } from '../../components/GridSystem';
import Input from '../../components/Input';

export default function BNK1DCM() {
    
    type formInput = {
        custno: string,

    }

    type formOutput = {
        bnk1dcm: string,
bnk1dc: string,
company: string,
sortc: string,
custno2: string,
custnam: string,
custad1: string,
custad2: string,
custad3: string,
dobdd: string,
dobmm: string,
dobyy: string,
credsc: string,
scrdtdd: string,
scrdtmm: string,
scrdtyy: string,
message: string,
dummy: string,

    }
    
    const [formData, setFormData] = useState<formInput>(
    {
        custno: '',

    });
    const [receivedData, setReceivedData] = useState<formOutput>(
     {
        bnk1dcm: '',
bnk1dc: '',
company: 'CICS Banking Sample Application - Display Customer.',
sortc: '',
custno2: '',
custnam: '',
custad1: '',
custad2: '',
custad3: '',
dobdd: '',
dobmm: '',
dobyy: '',
credsc: '',
scrdtdd: '',
scrdtmm: '',
scrdtyy: '',
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
        httpConfig.domain + '/Bnk1dcm',
        formData
        );

        setReceivedData(_state => response.data);
    }
    };
    
  return (
    <>
     
    <Helmet>
        <title>BNK1DCM</title>
    </Helmet>
    
<GridItem col={1} row={1}>
    <label style={{color: "blue"}}>
         {"BNK1DC "}
    </label>
</GridItem>

    
<GridItem col={16} row={1}>
    <label style={{color: "red"}}>
         {receivedData.company }
    </label>
</GridItem>

    
<GridItem col={1} row={3}>
    <label style={{color: "turquoise"}}>
         {"Provide a CUSTOMER number. Then press Enter."}
    </label>
</GridItem>

    
<GridItem col={1} row={5}>
    <label style={{color: "turquoise"}}>
         {"CUSTOMER NUMBER"}
    </label>
</GridItem>

    
<GridItem col={17} row={5}>
    <Input maxLength={10} name='custno' id='custno' type='text' styles={{color: "green", textDecoration: "underline"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={28} row={5}>
    <label >
         {""}
    </label>
</GridItem>

    
<GridItem col={1} row={7}>
    <label style={{color: "inherit"}}>
         {"Sort Code       "}
    </label>
</GridItem>

    
<GridItem col={18} row={7}>
    <label style={{color: "inherit"}}>
         {receivedData.sortc }
    </label>
</GridItem>

    
<GridItem col={1} row={8}>
    <label style={{color: "inherit"}}>
         {"Customer Number "}
    </label>
</GridItem>

    
<GridItem col={18} row={8}>
    <label style={{color: "inherit"}}>
         {receivedData.custno2 }
    </label>
</GridItem>

    
<GridItem col={1} row={9}>
    <label style={{color: "inherit"}}>
         {"Customer Name   "}
    </label>
</GridItem>

    
<GridItem col={18} row={9}>
    <label style={{color: "inherit"}}>
         {receivedData.custnam }
    </label>
</GridItem>

    
<GridItem col={79} row={9}>
    <label style={{color: "green"}}>
         {""}
    </label>
</GridItem>

    
<GridItem col={1} row={10}>
    <label style={{color: "inherit"}}>
         {"Customer Address"}
    </label>
</GridItem>

    
<GridItem col={18} row={10}>
    <label style={{color: "inherit"}}>
         {receivedData.custad1 }
    </label>
</GridItem>

    
<GridItem col={79} row={10}>
    <label style={{color: "green"}}>
         {""}
    </label>
</GridItem>

    
<GridItem col={1} row={11}>
    <label style={{color: "inherit"}}>
         {" "}
    </label>
</GridItem>

    
<GridItem col={18} row={11}>
    <label style={{color: "inherit"}}>
         {receivedData.custad2 }
    </label>
</GridItem>

    
<GridItem col={79} row={11}>
    <label style={{color: "green"}}>
         {""}
    </label>
</GridItem>

    
<GridItem col={1} row={12}>
    <label style={{color: "inherit"}}>
         {" "}
    </label>
</GridItem>

    
<GridItem col={18} row={12}>
    <label style={{color: "inherit"}}>
         {receivedData.custad3 }
    </label>
</GridItem>

    
<GridItem col={59} row={12}>
    <label style={{color: "inherit"}}>
         {""}
    </label>
</GridItem>

    
<GridItem col={1} row={13}>
    <label style={{color: "inherit"}}>
         {"Customer D.O.B."}
    </label>
</GridItem>

    
<GridItem col={18} row={13}>
    <label style={{color: "inherit"}}>
         {receivedData.dobdd }
    </label>
</GridItem>

    
<GridItem col={21} row={13}>
    <label style={{color: "inherit"}}>
         {"/"}
    </label>
</GridItem>

    
<GridItem col={23} row={13}>
    <label style={{color: "inherit"}}>
         {receivedData.dobmm }
    </label>
</GridItem>

    
<GridItem col={26} row={13}>
    <label style={{color: "inherit"}}>
         {"/"}
    </label>
</GridItem>

    
<GridItem col={28} row={13}>
    <label style={{color: "inherit"}}>
         {receivedData.dobyy }
    </label>
</GridItem>

    
<GridItem col={1} row={14}>
    <label style={{color: "inherit"}}>
         {"Credit Score    "}
    </label>
</GridItem>

    
<GridItem col={18} row={14}>
    <label style={{color: "inherit"}}>
         {receivedData.credsc }
    </label>
</GridItem>

    
<GridItem col={1} row={15}>
    <label style={{color: "inherit"}}>
         {"CS Review Date  "}
    </label>
</GridItem>

    
<GridItem col={18} row={15}>
    <label style={{color: "inherit"}}>
         {receivedData.scrdtdd }
    </label>
</GridItem>

    
<GridItem col={21} row={15}>
    <label style={{color: "inherit"}}>
         {"/"}
    </label>
</GridItem>

    
<GridItem col={23} row={15}>
    <label style={{color: "inherit"}}>
         {receivedData.scrdtmm }
    </label>
</GridItem>

    
<GridItem col={26} row={15}>
    <label style={{color: "inherit"}}>
         {"/"}
    </label>
</GridItem>

    
<GridItem col={28} row={15}>
    <label style={{color: "inherit"}}>
         {receivedData.scrdtyy }
    </label>
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
    