
import { type ChangeEvent, useState, type KeyboardEvent } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import httpConfig from '../../config/httpConfig';

import { GridItem } from '../../components/GridSystem';
import Input from '../../components/Input';

export default function BNK1DAM() {
    
    type formInput = {
        accno: string,

    }

    type formOutput = {
        bnk1dam: string,
bnk1da: string,
company: string,
custno: string,
sortc: string,
accno2: string,
actype: string,
intrt: string,
opendd: string,
openmm: string,
openyy: string,
overdr: string,
lstmtdd: string,
lstmtmm: string,
lstmtyy: string,
nstmtdd: string,
nstmtmm: string,
nstmtyy: string,
avbal: string,
actbal: string,
message: string,
dummy: string,

    }
    
    const [formData, setFormData] = useState<formInput>(
    {
        accno: '',

    });
    const [receivedData, setReceivedData] = useState<formOutput>(
     {
        bnk1dam: '',
bnk1da: '',
company: 'CICS Banking Sample Application - Display Account.',
custno: '',
sortc: '',
accno2: '',
actype: '',
intrt: '',
opendd: '',
openmm: '',
openyy: '',
overdr: '',
lstmtdd: '',
lstmtmm: '',
lstmtyy: '',
nstmtdd: '',
nstmtmm: '',
nstmtyy: '',
avbal: '',
actbal: '',
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
        if (!formData[key]) {
            return;
        }
        }

        const response = await axios.post(
        httpConfig.domain + '/Bnk1dam',
        formData
        );

        setReceivedData(_state => response.data);
    }
    };
    
  return (
    <>
     
    <Helmet>
        <title>BNK1DAM</title>
    </Helmet>
    
<GridItem col={1} row={1}>
    <label style={{color:"blue"}}>
         BNK1DA  
    </label>
</GridItem>

    
<GridItem col={16} row={1}>
    <label style={{color:"red"}}>
         {receivedData.company } 
    </label>
</GridItem>

    
<GridItem col={1} row={3}>
    <label style={{color:"turquoise"}}>
         Provide an ACCOUNT number. Then press Enter. 
    </label>
</GridItem>

    
<GridItem col={1} row={5}>
    <label style={{color:"turquoise"}}>
         ACCOUNT NUMBER 
    </label>
</GridItem>

    
<GridItem col={17} row={5}>
    <Input maxLength={8} name='accno' id='accno' type='number' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={26} row={5}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={1} row={7}>
    <label style={{color:"neutral"}}>
          Customer Number: 
    </label>
</GridItem>

    
<GridItem col={20} row={7}>
    <label style={{color:"neutral"}}>
         {receivedData.custno } 
    </label>
</GridItem>

    
<GridItem col={1} row={8}>
    <label style={{color:"neutral"}}>
          Sort Code      : 
    </label>
</GridItem>

    
<GridItem col={20} row={8}>
    <label style={{color:"neutral"}}>
         {receivedData.sortc } 
    </label>
</GridItem>

    
<GridItem col={1} row={9}>
    <label style={{color:"neutral"}}>
          Account Number : 
    </label>
</GridItem>

    
<GridItem col={20} row={9}>
    <label style={{color:"neutral"}}>
         {receivedData.accno2 } 
    </label>
</GridItem>

    
<GridItem col={1} row={10}>
    <label style={{color:"neutral"}}>
          Account Type   : 
    </label>
</GridItem>

    
<GridItem col={20} row={10}>
    <label style={{color:"neutral"}}>
         {receivedData.actype } 
    </label>
</GridItem>

    
<GridItem col={1} row={11}>
    <label style={{color:"neutral"}}>
          Interest Rate  : 
    </label>
</GridItem>

    
<GridItem col={20} row={11}>
    <label style={{color:"neutral"}}>
         {receivedData.intrt } 
    </label>
</GridItem>

    
<GridItem col={1} row={12}>
    <label style={{color:"neutral"}}>
          Account Opened : 
    </label>
</GridItem>

    
<GridItem col={20} row={12}>
    <label style={{color:"neutral"}}>
         {receivedData.opendd } 
    </label>
</GridItem>

    
<GridItem col={23} row={12}>
    <label style={{color:"green"}}>
         / 
    </label>
</GridItem>

    
<GridItem col={25} row={12}>
    <label style={{color:"neutral"}}>
         {receivedData.openmm } 
    </label>
</GridItem>

    
<GridItem col={28} row={12}>
    <label style={{color:"green"}}>
         / 
    </label>
</GridItem>

    
<GridItem col={30} row={12}>
    <label style={{color:"neutral"}}>
         {receivedData.openyy } 
    </label>
</GridItem>

    
<GridItem col={1} row={13}>
    <label style={{color:"neutral"}}>
          Overdraft limit: 
    </label>
</GridItem>

    
<GridItem col={20} row={13}>
    <label style={{color:"neutral"}}>
         {receivedData.overdr } 
    </label>
</GridItem>

    
<GridItem col={1} row={14}>
    <label style={{color:"neutral"}}>
          Last statement : 
    </label>
</GridItem>

    
<GridItem col={20} row={14}>
    <label style={{color:"neutral"}}>
         {receivedData.lstmtdd } 
    </label>
</GridItem>

    
<GridItem col={23} row={14}>
    <label style={{color:"green"}}>
         / 
    </label>
</GridItem>

    
<GridItem col={25} row={14}>
    <label style={{color:"neutral"}}>
         {receivedData.lstmtmm } 
    </label>
</GridItem>

    
<GridItem col={28} row={14}>
    <label style={{color:"green"}}>
         / 
    </label>
</GridItem>

    
<GridItem col={30} row={14}>
    <label style={{color:"neutral"}}>
         {receivedData.lstmtyy } 
    </label>
</GridItem>

    
<GridItem col={1} row={15}>
    <label style={{color:"neutral"}}>
          Next statement : 
    </label>
</GridItem>

    
<GridItem col={20} row={15}>
    <label style={{color:"neutral"}}>
         {receivedData.nstmtdd } 
    </label>
</GridItem>

    
<GridItem col={23} row={15}>
    <label style={{color:"green"}}>
         / 
    </label>
</GridItem>

    
<GridItem col={25} row={15}>
    <label style={{color:"neutral"}}>
         {receivedData.nstmtmm } 
    </label>
</GridItem>

    
<GridItem col={28} row={15}>
    <label style={{color:"green"}}>
         / 
    </label>
</GridItem>

    
<GridItem col={30} row={15}>
    <label style={{color:"neutral"}}>
         {receivedData.nstmtyy } 
    </label>
</GridItem>

    
<GridItem col={1} row={16}>
    <label style={{color:"neutral"}}>
          Available Bal  : 
    </label>
</GridItem>

    
<GridItem col={19} row={16}>
    <label style={{color:"neutral"}}>
         {receivedData.avbal } 
    </label>
</GridItem>

    
<GridItem col={1} row={17}>
    <label style={{color:"neutral"}}>
          Actual Balance : 
    </label>
</GridItem>

    
<GridItem col={19} row={17}>
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
    