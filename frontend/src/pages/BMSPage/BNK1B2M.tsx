
import { type ChangeEvent, useState, type KeyboardEvent } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import httpConfig from '../../config/httpConfig';

import { GridItem } from '../../components/GridSystem';
import Input from '../../components/Input';

export default function BNK1B2M() {
    
    type formInput = {
        faccno: string,
amt: string,
taccno: string,

    }

    type formOutput = {
        bnk1tfm: string,
bnk1b2: string,
company: string,
fscde1: string,
fscde2: string,
fscde3: string,
actsign: string,
actpnd: string,
actpnc: string,
avasign: string,
avapnd: string,
avapnc: string,
tscde1: string,
tscde2: string,
tscde3: string,
message: string,
dummy: string,

    }
    
    const [formData, setFormData] = useState<formInput>(
    {
        faccno: '',
amt: '',
taccno: '',

    });
    const [receivedData, setReceivedData] = useState<formOutput>(
     {
        bnk1tfm: '',
bnk1b2: '',
company: 'CICS Banking Sample Application - Transfer Funds',
fscde1: '00',
fscde2: '00',
fscde3: '00',
actsign: ' ',
actpnd: '0000000000',
actpnc: '00',
avasign: ' ',
avapnd: '0000000000',
avapnc: '00',
tscde1: '00',
tscde2: '00',
tscde3: '00',
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
        httpConfig.domain + '/Bnk1b2m',
        formData
        );

        setReceivedData(_state => response.data);
    }
    };
    
  return (
    <>
     
    <Helmet>
        <title>BNK1B2M</title>
    </Helmet>
    
<GridItem col={1} row={1}>
    <label style={{color:"blue"}}>
         BNK1B2 
    </label>
</GridItem>

    
<GridItem col={15} row={1}>
    <label style={{color:"red"}}>
         {receivedData.company } 
    </label>
</GridItem>

    
<GridItem col={1} row={3}>
    <label style={{color:"neutral"}}>
         Transfer funds 
    </label>
</GridItem>

    
<GridItem col={1} row={2}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={5} row={5}>
    <label style={{color:"yellow"}}>
         Provide the Sort Code and Account Number of the Accounts you want  
    </label>
</GridItem>

    
<GridItem col={5} row={6}>
    <label style={{color:"yellow"}}>
         to transfer money FROM and TO and the AMOUNT you want to transfer.  
    </label>
</GridItem>

    
<GridItem col={5} row={7}>
    <label style={{color:"yellow"}}>
         Then press ENTER.   
    </label>
</GridItem>

    
<GridItem col={1} row={8}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={5} row={9}>
    <label style={{color:"turquoise"}}>
         From Account 
    </label>
</GridItem>

    
<GridItem col={10} row={10}>
    <label style={{color:"turquoise"}}>
         Sort Code      : 
    </label>
</GridItem>

    
<GridItem col={27} row={10}>
    <label style={{color:"turquoise"}}>
         {receivedData.fscde1 } 
    </label>
</GridItem>

    
<GridItem col={30} row={10}>
    <label style={{color:"turquoise"}}>
         - 
    </label>
</GridItem>

    
<GridItem col={32} row={10}>
    <label style={{color:"turquoise"}}>
         {receivedData.fscde2 } 
    </label>
</GridItem>

    
<GridItem col={35} row={10}>
    <label style={{color:"turquoise"}}>
         - 
    </label>
</GridItem>

    
<GridItem col={37} row={10}>
    <label style={{color:"turquoise"}}>
         {receivedData.fscde3 } 
    </label>
</GridItem>

    
<GridItem col={40} row={10}>
    <label style={{color:"red"}}>
          
    </label>
</GridItem>

    
<GridItem col={10} row={11}>
    <label style={{color:"yellow"}}>
         Account Number : 
    </label>
</GridItem>

    
<GridItem col={27} row={11}>
    <Input maxLength={8} name='faccno' id='faccno' type='number' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={36} row={11}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={1} row={12}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={10} row={13}>
    <label style={{color:"yellow"}}>
         Amount to be Transferred : 
    </label>
</GridItem>

    
<GridItem col={39} row={13}>
    <Input maxLength={13} name='amt' id='amt' type='text' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={53} row={13}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={1} row={14}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={10} row={15}>
    <label style={{color:"turquoise"}}>
         Actual Balance ......... : 
    </label>
</GridItem>

    
<GridItem col={37} row={15}>
    <label style={{color:"turquoise"}}>
         {receivedData.actsign } 
    </label>
</GridItem>

    
<GridItem col={39} row={15}>
    <label style={{color:"turquoise"}}>
         {receivedData.actpnd } 
    </label>
</GridItem>

    
<GridItem col={50} row={15}>
    <label style={{color:"turquoise"}}>
         . 
    </label>
</GridItem>

    
<GridItem col={52} row={15}>
    <label style={{color:"turquoise"}}>
         {receivedData.actpnc } 
    </label>
</GridItem>

    
<GridItem col={55} row={15}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={10} row={16}>
    <label style={{color:"turquoise"}}>
         Available Balance ...... : 
    </label>
</GridItem>

    
<GridItem col={37} row={16}>
    <label style={{color:"turquoise"}}>
         {receivedData.avasign } 
    </label>
</GridItem>

    
<GridItem col={39} row={16}>
    <label style={{color:"turquoise"}}>
         {receivedData.avapnd } 
    </label>
</GridItem>

    
<GridItem col={50} row={16}>
    <label style={{color:"turquoise"}}>
         . 
    </label>
</GridItem>

    
<GridItem col={52} row={16}>
    <label style={{color:"turquoise"}}>
         {receivedData.avapnc } 
    </label>
</GridItem>

    
<GridItem col={55} row={16}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={1} row={17}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={5} row={18}>
    <label style={{color:"yellow"}}>
         To Account 
    </label>
</GridItem>

    
<GridItem col={10} row={19}>
    <label style={{color:"yellow"}}>
         Sort Code      : 
    </label>
</GridItem>

    
<GridItem col={27} row={19}>
    <label style={{color:"turquoise"}}>
         {receivedData.tscde1 } 
    </label>
</GridItem>

    
<GridItem col={30} row={19}>
    <label >
         - 
    </label>
</GridItem>

    
<GridItem col={32} row={19}>
    <label style={{color:"turquoise"}}>
         {receivedData.tscde2 } 
    </label>
</GridItem>

    
<GridItem col={35} row={19}>
    <label >
         - 
    </label>
</GridItem>

    
<GridItem col={37} row={19}>
    <label style={{color:"green"}}>
         {receivedData.tscde3 } 
    </label>
</GridItem>

    
<GridItem col={40} row={19}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={10} row={20}>
    <label style={{color:"yellow"}}>
         Account Number : 
    </label>
</GridItem>

    
<GridItem col={27} row={20}>
    <Input maxLength={8} name='taccno' id='taccno' type='number' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={36} row={20}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={1} row={21}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={1} row={22}>
    <label >
          
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
    