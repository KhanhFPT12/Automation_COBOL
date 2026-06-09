
import { type ChangeEvent, useState, type KeyboardEvent } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import httpConfig from '../../config/httpConfig';

import { GridItem } from '../../components/GridSystem';
import Input from '../../components/Input';

export default function BNK1CCM() {
    
    type formInput = {
        custtit: string,
christn: string,
custins: string,
custsn: string,
custad1: string,
custad2: string,
custad3: string,
dobdd: string,
dobmm: string,
dobyy: string,

    }

    type formOutput = {
        bnk1ccm: string,
bnk1cc: string,
company: string,
sortc: string,
custno2: string,
credsc: string,
scrdtdd: string,
scrdtmm: string,
scrdtyy: string,
message: string,
dummy: string,

    }
    
    const [formData, setFormData] = useState<formInput>(
    {
        custtit: '',
christn: '',
custins: '',
custsn: '',
custad1: '',
custad2: '',
custad3: '',
dobdd: '',
dobmm: '',
dobyy: '',

    });
    const [receivedData, setReceivedData] = useState<formOutput>(
     {
        bnk1ccm: '',
bnk1cc: '',
company: 'CICS Banking Sample Application - Create Customer.',
sortc: '',
custno2: '',
credsc: '',
scrdtdd: '',
scrdtmm: '',
scrdtyy: '',
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
        if (!formData[key]) {
            return;
        }
        }

        const response = await axios.post(
        httpConfig.domain + '/Bnk1ccm',
        formData
        );

        setReceivedData(_state => response.data);
    }
    };
    
  return (
    <>
     
    <Helmet>
        <title>BNK1CCM</title>
    </Helmet>
    
<GridItem col={1} row={1}>
    <label style={{color:"blue"}}>
         BNK1CC  
    </label>
</GridItem>

    
<GridItem col={16} row={1}>
    <label style={{color:"red"}}>
         {receivedData.company } 
    </label>
</GridItem>

    
<GridItem col={1} row={3}>
    <label style={{color:"turquoise"}}>
         Provide a Name, Address and D.O.B. then Enter  
    </label>
</GridItem>

    
<GridItem col={1} row={7}>
    <label style={{color:"neutral"}}>
          Customer Title 
    </label>
</GridItem>

    
<GridItem col={18} row={7}>
    <Input maxLength={10} name='custtit' id='custtit' type='text' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={29} row={7}>
    <label style={{color:"neutral"}}>
          
    </label>
</GridItem>

    
<GridItem col={31} row={7}>
    <label style={{color:"neutral"}}>
         First Name 
    </label>
</GridItem>

    
<GridItem col={46} row={7}>
    <Input maxLength={20} name='christn' id='christn' type='text' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={67} row={7}>
    <label style={{color:"neutral"}}>
          
    </label>
</GridItem>

    
<GridItem col={1} row={8}>
    <label style={{color:"neutral"}}>
          Middle Initials 
    </label>
</GridItem>

    
<GridItem col={18} row={8}>
    <Input maxLength={2} name='custins' id='custins' type='text' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={21} row={8}>
    <label style={{color:"green"}}>
          
    </label>
</GridItem>

    
<GridItem col={22} row={8}>
    <label style={{color:"neutral"}}>
         Family name  
    </label>
</GridItem>

    
<GridItem col={35} row={8}>
    <Input maxLength={20} name='custsn' id='custsn' type='text' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={56} row={8}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={1} row={10}>
    <label style={{color:"neutral"}}>
          Customer Addr1  
    </label>
</GridItem>

    
<GridItem col={18} row={10}>
    <Input maxLength={60} name='custad1' id='custad1' type='text' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={79} row={10}>
    <label style={{color:"green"}}>
          
    </label>
</GridItem>

    
<GridItem col={1} row={11}>
    <label style={{color:"neutral"}}>
          Customer Addr2  
    </label>
</GridItem>

    
<GridItem col={18} row={11}>
    <Input maxLength={60} name='custad2' id='custad2' type='text' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={79} row={11}>
    <label style={{color:"green"}}>
          
    </label>
</GridItem>

    
<GridItem col={1} row={12}>
    <label style={{color:"neutral"}}>
          Customer Addr3  
    </label>
</GridItem>

    
<GridItem col={18} row={12}>
    <Input maxLength={40} name='custad3' id='custad3' type='text' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={59} row={12}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={1} row={13}>
    <label style={{color:"neutral"}}>
          Customer D.O.B. 
    </label>
</GridItem>

    
<GridItem col={18} row={13}>
    <Input maxLength={2} name='dobdd' id='dobdd' type='number' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={21} row={13}>
    <label style={{color:"neutral"}}>
         / 
    </label>
</GridItem>

    
<GridItem col={23} row={13}>
    <Input maxLength={2} name='dobmm' id='dobmm' type='number' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={26} row={13}>
    <label style={{color:"neutral"}}>
         / 
    </label>
</GridItem>

    
<GridItem col={28} row={13}>
    <Input maxLength={4} name='dobyy' id='dobyy' type='number' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={33} row={13}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={1} row={15}>
    <label style={{color:"neutral"}}>
          Sort Code      
    </label>
</GridItem>

    
<GridItem col={18} row={15}>
    <label style={{color:"neutral"}}>
         {receivedData.sortc } 
    </label>
</GridItem>

    
<GridItem col={1} row={16}>
    <label style={{color:"neutral"}}>
          Customer Number 
    </label>
</GridItem>

    
<GridItem col={18} row={16}>
    <label style={{color:"neutral"}}>
         {receivedData.custno2 } 
    </label>
</GridItem>

    
<GridItem col={1} row={17}>
    <label style={{color:"neutral"}}>
          Credit Score    
    </label>
</GridItem>

    
<GridItem col={18} row={17}>
    <label style={{color:"neutral"}}>
         {receivedData.credsc } 
    </label>
</GridItem>

    
<GridItem col={1} row={18}>
    <label style={{color:"neutral"}}>
          CS Review Date  
    </label>
</GridItem>

    
<GridItem col={18} row={18}>
    <label style={{color:"neutral"}}>
         {receivedData.scrdtdd } 
    </label>
</GridItem>

    
<GridItem col={21} row={18}>
    <label style={{color:"neutral"}}>
         / 
    </label>
</GridItem>

    
<GridItem col={23} row={18}>
    <label style={{color:"neutral"}}>
         {receivedData.scrdtmm } 
    </label>
</GridItem>

    
<GridItem col={26} row={18}>
    <label style={{color:"neutral"}}>
         / 
    </label>
</GridItem>

    
<GridItem col={28} row={18}>
    <label style={{color:"neutral"}}>
         {receivedData.scrdtyy } 
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
    