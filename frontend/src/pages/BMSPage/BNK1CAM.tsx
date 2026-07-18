
import { type ChangeEvent, useState, type KeyboardEvent } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import httpConfig from '../../config/httpConfig';

import { GridItem } from '../../components/GridSystem';
import Input from '../../components/Input';

export default function BNK1CAM() {
    
    type formInput = {
        custno: string,
acctyp: string,
intrt: string,
overdr: string,

    }

    type formOutput = {
        bnk1cam: string,
bnk1ca: string,
company: string,
accno: string,
srtcd: string,
opendd: string,
openmm: string,
openyy: string,
lstmdd: string,
lstmmm: string,
lstmyy: string,
nstmtdd: string,
nstmtmm: string,
nstmtyy: string,
avail: string,
actbal: string,
message: string,
dummy: string,

    }
    
    const [formData, setFormData] = useState<formInput>(
    {
        custno: '',
acctyp: '',
intrt: '',
overdr: '',

    });
    const [receivedData, setReceivedData] = useState<formOutput>(
     {
        bnk1cam: '',
bnk1ca: '',
company: 'CICS Banking Sample Application- Create Account.',
accno: '        ',
srtcd: '',
opendd: '',
openmm: '',
openyy: '',
lstmdd: '',
lstmmm: '',
lstmyy: '',
nstmtdd: '',
nstmtmm: '',
nstmtyy: '',
avail: '',
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
        httpConfig.domain + '/Bnk1cam',
        formData
        );

        setReceivedData(_state => response.data);
    }
    };
    
  return (
    <>
     
    <Helmet>
        <title>BNK1CAM</title>
    </Helmet>
    
<GridItem col={1} row={1}>
    <label style={{color:"blue"}}>
         BNK1CA  
    </label>
</GridItem>

    
<GridItem col={18} row={1}>
    <label style={{color:"red"}}>
         {receivedData.company } 
    </label>
</GridItem>

    
<GridItem col={1} row={3}>
    <label style={{color:"turquoise"}}>
         Please provide the requested information and press Enter. 
    </label>
</GridItem>

    
<GridItem col={1} row={6}>
    <label style={{color:"turquoise"}}>
         Customer number  : 
    </label>
</GridItem>

    
<GridItem col={23} row={6}>
    <Input maxLength={10} name='custno' id='custno' type='number' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={34} row={6}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={1} row={7}>
    <label style={{color:"turquoise"}}>
         Account Type     : 
    </label>
</GridItem>

    
<GridItem col={23} row={7}>
    <Input maxLength={8} name='acctyp' id='acctyp' type='text' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={32} row={7}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={1} row={8}>
    <label style={{color:"turquoise"}}>
         Interest Rate    : 
    </label>
</GridItem>

    
<GridItem col={23} row={8}>
    <Input maxLength={7} name='intrt' id='intrt' type='text' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={31} row={8}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={1} row={9}>
    <label style={{color:"turquoise"}}>
         Overdraft Limit  : 
    </label>
</GridItem>

    
<GridItem col={23} row={9}>
    <Input maxLength={8} name='overdr' id='overdr' type='number' styles={{color:"green"}}  onChange={handleInputChange} onKeyDown={handleSubmit}/>
</GridItem>
    
<GridItem col={32} row={9}>
    <label >
          
    </label>
</GridItem>

    
<GridItem col={1} row={13}>
    <label style={{color:"neutral"}}>
         Account number   : 
    </label>
</GridItem>

    
<GridItem col={23} row={13}>
    <label style={{color:"neutral"}}>
         {receivedData.accno } 
    </label>
</GridItem>

    
<GridItem col={1} row={14}>
    <label style={{color:"neutral"}}>
         Sort code        : 
    </label>
</GridItem>

    
<GridItem col={23} row={14}>
    <label style={{color:"neutral"}}>
         {receivedData.srtcd } 
    </label>
</GridItem>

    
<GridItem col={1} row={15}>
    <label style={{color:"neutral"}}>
         Account Opened   : 
    </label>
</GridItem>

    
<GridItem col={23} row={15}>
    <label style={{color:"neutral"}}>
         {receivedData.opendd } 
    </label>
</GridItem>

    
<GridItem col={26} row={15}>
    <label style={{color:"neutral"}}>
         / 
    </label>
</GridItem>

    
<GridItem col={28} row={15}>
    <label style={{color:"neutral"}}>
         {receivedData.openmm } 
    </label>
</GridItem>

    
<GridItem col={31} row={15}>
    <label style={{color:"neutral"}}>
         / 
    </label>
</GridItem>

    
<GridItem col={33} row={15}>
    <label style={{color:"neutral"}}>
         {receivedData.openyy } 
    </label>
</GridItem>

    
<GridItem col={1} row={16}>
    <label style={{color:"neutral"}}>
         Last Stmt Date   : 
    </label>
</GridItem>

    
<GridItem col={23} row={16}>
    <label style={{color:"neutral"}}>
         {receivedData.lstmdd } 
    </label>
</GridItem>

    
<GridItem col={26} row={16}>
    <label style={{color:"neutral"}}>
         / 
    </label>
</GridItem>

    
<GridItem col={28} row={16}>
    <label style={{color:"neutral"}}>
         {receivedData.lstmmm } 
    </label>
</GridItem>

    
<GridItem col={31} row={16}>
    <label style={{color:"neutral"}}>
         / 
    </label>
</GridItem>

    
<GridItem col={33} row={16}>
    <label style={{color:"neutral"}}>
         {receivedData.lstmyy } 
    </label>
</GridItem>

    
<GridItem col={1} row={17}>
    <label style={{color:"neutral"}}>
         Next Stmt Date   : 
    </label>
</GridItem>

    
<GridItem col={23} row={17}>
    <label style={{color:"neutral"}}>
         {receivedData.nstmtdd } 
    </label>
</GridItem>

    
<GridItem col={26} row={17}>
    <label style={{color:"neutral"}}>
         / 
    </label>
</GridItem>

    
<GridItem col={28} row={17}>
    <label style={{color:"neutral"}}>
         {receivedData.nstmtmm } 
    </label>
</GridItem>

    
<GridItem col={31} row={17}>
    <label style={{color:"neutral"}}>
         / 
    </label>
</GridItem>

    
<GridItem col={33} row={17}>
    <label style={{color:"neutral"}}>
         {receivedData.nstmtyy } 
    </label>
</GridItem>

    
<GridItem col={1} row={18}>
    <label style={{color:"neutral"}}>
         Available Balance: 
    </label>
</GridItem>

    
<GridItem col={22} row={18}>
    <label style={{color:"neutral"}}>
         {receivedData.avail } 
    </label>
</GridItem>

    
<GridItem col={1} row={19}>
    <label style={{color:"neutral"}}>
         Actual Balance   : 
    </label>
</GridItem>

    
<GridItem col={22} row={19}>
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
    